

window.onload = () => {
    chrome.storage.local.set({"currentIndexInitialized" : false}, function(){
        console.log("current index initialized reset");
    })

    graphLayout();

    setupMutationObserver();

    document.addEventListener('keydown', function(event) {

        var keyPressed = "";
        var nextIndex = -1;

        if (event.key == "ArrowLeft" && event.shiftKey) {
            event.preventDefault();
            nextIndex = 0;
        } else if (event.key == "ArrowRight" && event.shiftKey) {
            event.preventDefault();
            nextIndex = 1;
        } else if (event.key == "ArrowUp" && event.shiftKey) {
            event.preventDefault();
            nextIndex = 3;
        } else if (event.key == "ArrowDown" && event.shiftKey) {
            event.preventDefault();
            nextIndex = 2;
        }

        console.log(nextIndex);

        if (nextIndex != -1) {
            chrome.storage.local.get(["currentIndex", "graphObject"], function(data) {
                var graphObject = JSON.parse(data.graphObject);
                var currentIndex = parseInt(data.currentIndex);

                unhighlightCurrentElements(graphObject, currentIndex);

                newElementIndex = graphObject[currentIndex][1][nextIndex];
                newElementArray = document.querySelectorAll('[data-customAttribute="' + newElementIndex + '"]');
                newElementArray[0].focus();

                highlightNextElements(graphObject, newElementIndex);
                

                chrome.storage.local.set({"currentIndex" : newElementIndex}, function() {
                    console.log("Current Index set");
                })
            })
        }
    })
}