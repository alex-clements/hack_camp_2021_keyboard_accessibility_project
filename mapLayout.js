window.onload = () => {

    var allElements = document.querySelectorAll(
        'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
        );

    let allElementsArray = Array.from(allElements);

    allElementsArray.filter(el => !el.hasAttribute('disabled') && !el.getAttribute("aria-hidden"));

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


    // document.addEventListener('keydown', function(event) {

    //     var keyPressed;

    //     if (event.key == "ArrowLeft") {
    //         event.preventDefault();
    //         keyPressed = "left arrow"
    //     }
    // })

}