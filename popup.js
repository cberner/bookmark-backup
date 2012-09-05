Popup = {
    refreshItems: function() {
        //Remove all the children before repopulating
        $("body ul").children().remove();
        chrome.storage.local.get(null, Popup.loadItems);
    },

    loadItems: function(items) {
        for (var key in items) {
            var value = items[key];
            var elem = "<li><a href=" + key + ">" + new Date(parseInt(key));
            elem += "</a> <span class=delete>&times;</span></li>";
            $("body ul").append(elem);
        }
        $("body ul li a").on('click', function() {
            var key = $(this).attr('href');
            key = "" + key; //Cast to string
            chrome.storage.local.get(key, function(items) {
                console.log(items);
                var html = Popup.bookmarksToHtml(items[key][0].children);
                saveAs(new Blob([html], {type: "text/html"}), "bookmarks.html");
            });
            return false;
        });

        $("body ul li .delete").on('click', function() {
            var key = $(this).siblings('a').attr('href');
            key = "" + key; //Cast to string
            chrome.storage.local.remove(key);

            Popup.refreshItems();
        });
    },

    nodeToHtml: function(node, indent) {
        var whitespace = "";
        for (var i = 0; i < indent; i++) {
            whitespace += "    ";
        }

        if (node.hasOwnProperty('url')) {
            var html = whitespace + '<DT><A HREF="' + node.url + '" ADD_DATE="';
            html += node.dateAdded + '">' + node.title + "</A>\n";
            return html;
        } else {
            var html = whitespace + '<DT><H3'
            if (node.hasOwnProperty('dateAdded')) {
                html += ' ADD_DATE="' + node.dateAdded + '"';
            }
            if (node.title === "Bookmarks Bar") {
                html += ' PERSONAL_TOOLBAR_FOLDER="true"';
            }
            html += node.title + "></H3>\n";
            html += whitespace + "<DL><p>\n";

            if (node.children) {
                $.each(node.children, function(i, child) {
                    html += Popup.nodeToHtml(child, indent + 1);
                });
            }

            html += whitespace + "</DL><p>\n";
            return html;
        }
    },

    bookmarksToHtml: function(nodes) {
        var html = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
        html += '<!-- This is an automatically generated file.\n';
        html += 'It will be read and overwritten.\n';
        html += 'DO NOT EDIT! -->\n';
        html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
        html += '<TITLE>Bookmarks</TITLE>\n';
        html += '<H1>Bookmarks</H1>\n';
        html += '<DL><p>\n';

        $.each(nodes, function(i, e) {
            html += Popup.nodeToHtml(e, 1);
        });

        html += "</DL><p>";

        return html;
    }
}

Popup.refreshItems();

$(document).ready(function() {
    $("#save_now").on('click', function() {
        chrome.bookmarks.getTree(function(tree) {
            var date = new Date().getTime();
            var item = {};
            item[date] = tree;
            chrome.storage.local.set(item);

            Popup.refreshItems();
        });
    });
});
