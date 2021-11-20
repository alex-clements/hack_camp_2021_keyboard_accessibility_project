function graphLayout() {
    var allElements = $( ":tabbable" ).toArray();
    
    let allElementsArrayUnfiltered = Array.from(allElements);

    const allElementsArray2 = allElementsArrayUnfiltered.filter(el => 
        !el.hasAttribute('disabled') 
    && !el.getAttribute("aria-hidden") );

    function isHidden(el) {
        var style = window.getComputedStyle(el);
        return (style.display === 'none')
    }

    var allElementsArray = allElementsArray2.filter(el => !isHidden(el));

    var myMap = new Set();

    allElementsArray.map((i, index) => {

        var rect = i.getBoundingClientRect();

        thisNode = new Node(index, rect.x, rect.y);

        myMap.add(thisNode);

        i.setAttribute("data-customAttribute", index);
    })
    
    var graphObject = createGraphObject(myMap);

    chrome.storage.local.set({"graphObject": graphObject}, function() {
        console.log('Page graph committed to storage');
    }); 

    chrome.storage.local.set({"currentIndex": 0}, function() {
        console.log("Initial index set");
    });

    firstElement = document.querySelectorAll('[data-customAttribute="' + 0 + '"]');
}

function distance(node1, node2, costX=1, costY=1) {
    return Math.sqrt(costX*(node2.x-node1.x)**2 + costY*(node2.y-node1.y)**2)
}

function createGraphObject(myDict) {

    var costX = 50;
    var costY = 50;

    var returnObject = [];

    var testDistanceX;
    var testDistanceY;

    var upNode;
    var downNode;
    var leftNode;
    var rightNode;

    var minDistanceRight;
    var minDistanceLeft;
    var minDistanceUp;
    var minDistanceDown;

    myDict.forEach((currentNode) => {

        minDistanceRight = Number.MAX_SAFE_INTEGER;
        minDistanceLeft = Number.MAX_SAFE_INTEGER;
        minDistanceUp = Number.MAX_SAFE_INTEGER;
        minDistanceDown = Number.MAX_SAFE_INTEGER;

        upNode = null;
        downNode = null;
        leftNode = null;
        rightNode = null;

        myDict.forEach((testNode) => {
        
            testDistanceX = distance(currentNode, testNode, 1, costY);
            testDistanceY = distance(currentNode, testNode, costX, 1);
            
            if (testNode.x > currentNode.x && testDistanceX < minDistanceRight) {
                rightNode = testNode
                minDistanceRight = testDistanceX
            }
            if (testNode.x < currentNode.x && testDistanceX < minDistanceLeft) {
                leftNode = testNode
                minDistanceLeft = testDistanceX
            }
            if (testNode.y > currentNode.y && testDistanceY < minDistanceUp) {
                upNode = testNode
                minDistanceUp = testDistanceY
            }
            if (testNode.y < currentNode.y && testDistanceY < minDistanceDown) {
                downNode = testNode
                minDistanceDown = testDistanceY
            }
        });

        returnObject.push([currentNode.value, [leftNode ? leftNode.value : null,
                                                rightNode ? rightNode.value : null,
                                                upNode ? upNode.value : null,
                                                downNode ? downNode.value : null]])

    });

    return JSON.stringify(returnObject);
}