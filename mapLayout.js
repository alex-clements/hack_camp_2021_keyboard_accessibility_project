window.onload = () => {

    // var mutationObserver = new MutationObserver(function(mutations) {
    //     mutations.forEach(mutationFunctionDebounced)
    // });
    // mutationObserver.observe(document.body, {attributes: false, subtree: true, childList: true, characterData: true});

    var allElements = document.querySelectorAll(
        // 'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
        );

    let allElementsArrayUnfiltered = Array.from(allElements);

    const allElementsArray2 = allElementsArrayUnfiltered.filter(el => 
        !el.hasAttribute('disabled') 
    && !el.getAttribute("aria-hidden") );

    function isHidden(el) {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    }

    allElementsArray = allElementsArray2.filter(el => !isHidden(el));

    var myMap = new Map();

    allElementsArray.map((i, index) => {

        var rect = i.getBoundingClientRect();

        const newObject = {
            "domElement" : i,
            "x" : rect.x,
            "y" : rect.y
        }

        i.setAttribute("data-customAttribute", index);

        myMap.set(index, newObject);

    })

    chrome.storage.local.set({"myMap": [...myMap]}, function() {
        console.log('myMap committed to storage');
    }); 

    var dataMap = new Map();
    // key -> index of node
    // val -> Array of string [leftIndex, rightIndex]

    dataMap.set("0", ["0", "1"])

    var i;

    for (i=1; i<myMap.size-2; i++) {
        dataMap.set(i.toString(), [(i-1).toString(), (i+1).toString()])
    }

    dataMap.set(i.toString(), [(i-1).toString(), "0"])

    console.log(dataMap);

    chrome.storage.local.set({"dataMap": [...dataMap]}, function() {
        console.log('data map set');
    }); 

    chrome.storage.local.set({"currentIndex": "0"}, function() {
        console.log('current index set');
    });

    chrome.storage.local.get("autofocus", function(data) {
        var autofocus = data.autofocus;

        if (autofocus) {
            myMap.get(0)['domElement'].focus();
        }
    })
    

    
    document.addEventListener('keydown', function(event) {

        var keyPressed = "";
        var nextIndex = -1;

        if (event.key == "ArrowLeft") {
            event.preventDefault();
            nextIndex = 0;
        } else if (event.key == "ArrowRight") {
            event.preventDefault();
            nextIndex = 1;
        }
        
        var loadedDataMap;

        if (nextIndex != -1) {
            chrome.storage.local.get(["dataMap", "currentIndex"], function(data) {
                loadedDataMap = data.dataMap;
                loadedCurrentIndex = data.currentIndex;
                
                // get the data attribute of the active element
                var activeElement = document.activeElement;
                var lookupIndex = activeElement.getAttribute('data-customAttribute')
                
                // look up the index of the next item 
                var nextFocusItem = loadedDataMap[lookupIndex][1][nextIndex];

                // find and focus on the new item
                var newElement = document.querySelectorAll('[data-customAttribute="' + nextFocusItem + '"]');
                newElement[0].focus();

                // check newly focused element for index
                activeElement = document.activeElement;
                var newIndexItem = activeElement.getAttribute('data-customAttribute')
                
                // if the index of the new item in focus is the same as the index before, 
                // then go through a loop to find the next focus-able item                
                var newIndexItemInt = parseInt(newIndexItem);
                var lookupIndexInt = parseInt(lookupIndex);
                var newLookupIndex = lookupIndexInt;

                while (newIndexItemInt === lookupIndexInt && nextIndex === 1) {
                    newLookupIndex += 1;
                    
                    newElement = document.querySelectorAll('[data-customAttribute="' + newLookupIndex + '"]');
                    newElement[0].focus();

                    activeElement = document.activeElement;
                    newIndexItemInt = parseInt(activeElement.getAttribute('data-customAttribute'));
                }

                if (nextIndex === 1) {
                    loadedDataMap[lookupIndexInt][1][nextIndex] = newIndexItemInt;
                    loadedDataMap[newIndexItemInt][1][0] = lookupIndexInt;
                }

                // add updated map to local storage
                chrome.storage.local.set({"dataMap": [...loadedDataMap]}, function() {
                }); 

                

            })

        }


    })


//     function mutationFunction() {

//         var allElements = document.querySelectorAll(
//             'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
//             );
    
//         let allElementsArrayUnfiltered = Array.from(allElements);
    
//         const allElementsArray2 = allElementsArrayUnfiltered.filter(el => 
//             !el.hasAttribute('disabled') 
//         && !el.getAttribute("aria-hidden") );
    
//         function isHidden(el) {
//             var style = window.getComputedStyle(el);
//             return (style.display === 'none')
//         }
    
//         allElementsArray = allElementsArray2.filter(el => !isHidden(el));

//         chrome.storage.local.get(["myMap", "dataMap"], function(data) {
//             var mySet = new Set();
            

//             allElementsArray.map((i, index) => {
//                 mySet.add(index);
//             })

//             var myMap = data.myMap;
//             var dataMap = data.dataMap; 
//             console.log(myMap);
//             var attributeData;

//             var dataMapOriginalSize = dataMap.length;

//             allElementsArray.map((i, index) => {
//                 attributeData = parseInt(i.getAttribute('data-customAttribute'));
//                 console.log(attributeData);

//                 if (mySet.has(attributeData)) {
//                     //
//                 } else {
//                     var rect = i.getBoundingClientRect();
        
//                     const newObject = {
//                         "domElement" : i,
//                         "x" : rect.x,
//                         "y" : rect.y
//                     }
//                     console.log(i);
//                     i.setAttribute("data-customAttribute", index);
            
//                     myMap.push([index, newObject])
//                 }
//             })

//             chrome.storage.local.set({"myMap": [...myMap]}, function() {
//                 console.log('myMap set in storage');
//             })
// // --------------------------------------------------------------------------------------------------------
        
//             var i;
        
//             for (i=dataMapOriginalSize-1; i<myMap.size-2; i++) {
//                 dataMap.set(i.toString(), [(i-1).toString(), (i+1).toString()])
//             }
        
//             dataMap.set(i.toString(), [(i-1).toString(), i.toString()])
        
//             chrome.storage.local.set({"dataMap": [...dataMap]}, function() {
//                 console.log('data map set');
//             }); 
//         })
//     }

//     function debounce_leading(func, timeout = 5000){

//       let timer;
//         return (...args) => {
//           clearTimeout(timer);
//           timer = setTimeout(() => {
//             func.apply(this, args);
//             timer = undefined;
//           }, timeout);
//         };
//     }

//       const mutationFunctionDebounced = debounce_leading(() => mutationFunction());

}