Background = {
    save: function() {
        chrome.bookmarks.getTree(function(tree) {
            var date = new Date().getTime();
            var item = {};
            item[date] = tree;
            chrome.storage.local.set(item);
        });
        window.setTimeout(Background.save, 24*60*60*1000);
    }
}

window.setTimeout(Background.save, 24*60*60*1000);
