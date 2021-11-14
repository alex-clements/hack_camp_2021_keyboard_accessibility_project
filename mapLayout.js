window.onload = () => {

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

    var dataMap = new Map();
    // key -> index of node
    // val -> Array of string [leftIndex, rightIndex]

    dataMap.set("0", ["0", "1"])

    var i;

    for (i=1; i<myMap.size-2; i++) {
        dataMap.set(i.toString(), [(i-1).toString(), (i+1).toString()])
    }

    dataMap.set(i.toString(), [(i-1).toString(), i.toString()])

    console.log(dataMap);

    chrome.storage.local.set({"dataMap": [...dataMap]}, function() {
        console.log('data map set');
    }); 

    chrome.storage.local.set({"currentIndex": "0"}, function() {
        console.log('current index set');
    });

    
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
                console.log("current index = " + lookupIndex);
                console.log("new index item = " + newIndexItem);
                var newLookupIndex = lookupIndex;
                while (newIndexItem === lookupIndex) {
                    newLookupIndex += 1;
                    
                    newElement = document.querySelectorAll('[data-customAttribute="' + newLookupIndex + '"]');
                    newElement[0].focus();

                    activeElement = document.activeElement;
                    newIndexItem = activeElement.getAttribute('data-customAttribute');

                }

                // add updated map to local storage
                chrome.storage.local.set({"dataMap": [...loadedDataMap]}, function() {
                    console.log('data map set');
                    console.log("");
                }); 

                

            })

        }


    })

}