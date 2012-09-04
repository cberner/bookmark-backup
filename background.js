Background = {
    save: function() {
        console.log("saving the file...");
        var date = new Date().getTime();
        var item = {};
        item[date] = "saved at " + date;
        chrome.storage.local.set(item);
        //window.setTimeout(Background.save, 10000);
    }
}

//window.setTimeout(Background.save, 10000);
