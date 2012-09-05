Background = {
    save: function() {
        chrome.storage.local.get({'last_save': 0}, function(lastSaveItems) {
            var now = new Date().getTime();
            if (now - parseInt(lastSaveItems.last_save) > 24*60*60*1000) {
                chrome.bookmarks.getTree(function(tree) {
                    var date = new Date().getTime();
                    var items = {'last_save': date};
                    items[date] = tree;
                    chrome.storage.local.set(items);
                });
            }
        });
        window.setTimeout(Background.save, 60*1000);
    }
}

window.setTimeout(Background.save, 60*1000);
