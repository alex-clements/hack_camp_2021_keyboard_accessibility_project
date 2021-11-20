function setupMutationObserver() {
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(graphLayout)
    });
    mutationObserver.observe(document.body, {attributes: false, subtree: true, childList: true, characterData: true});

}