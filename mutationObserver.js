function setupMutationObserver() {
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(debounce(graphLayout,300))
    });
    mutationObserver.observe(document.body, {attributes: false, subtree: true, childList: true, characterData: true});

}

function debounce(func, wait, immediate) {
    var timeout;
    
    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait)

        if(callNow) func.apply(context, args);
    }
}