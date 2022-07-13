a = "ImageDrawer\n\nmade by \nbadfalcon\nbadfalcon610@gmail.com"
console.log(a);

var toolIndex;
var colorIndex;
var lineIndex;

$(window).on('load', function () {
    chrome.runtime.onInstalled.addListener(function () {
        setDefault();
    });

    chrome.runtime.onStartup.addListener(function () {
        setDefault();
    });
});

function getToolSetting() {
    return [toolIndex, lineIndex, colorIndex];
}

function setToolSetting(ti, li, ci) {
    var args = {};
    if (ti != null) {
        args["toolIndex"] = ti;
    }
    if (li != null) {
        args["lineIndex"] = li;
    }
    if (ci != null) {
        args["colorIndex"] = ci;
    }
    chrome.storage.sync.set(args, function () {
    });
}

function setTool(ti) {
    setToolSetting(ti, null, null);
}

function setColor(ci) {
    setToolSetting(null, null, ci);
}

function setLine(li) {
    setToolSetting(null, li, null);
}

function setDefault() {
    chrome.storage.sync.get({"toolIndex": 0, "lineIndex": 1, "colorIndex": 0}, function (data) {
        toolIndex = data.toolIndex;
        lineIndex = data.lineIndex;
        colorIndex = data.colorIndex;
        chrome.storage.sync.set({
            "toolIndex": toolIndex,
            "lineIndex": lineIndex,
            "colorIndex": colorIndex
        }, function (data) {
        });
    });
}

var ContextMenus = new function () {
    var items = {};
    var callbacks = {};

    this.setItems = function (aItems) {
        aItems.forEach(function (item) {
            items[item.id] = item;
        });
    };

    this.create = function () {
        Object.keys(items).forEach(
            function (key) {
                chrome.contextMenus.create(items[key]);

            }
        );

    };

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.parentMenuItemId === "main") {
            if (info.menuItemId === "toCanvas") {
                chrome.tabs.sendMessage(tab.id, {action: "imageToCanvas"});
            } else if (info.menuItemId === "resetCanvas") {
                chrome.tabs.sendMessage(tab.id, {action: "resetCanvas"});
            } else if (info.menuItemId === "flipHorizontal") {
                chrome.tabs.sendMessage(tab.id, {action: "flipHorizontal"});
            }
            if (info.menuItemId === "flipVertical") {
                chrome.tabs.sendMessage(tab.id, {action: "flipVertical"});
            }
        } else {
            switch (info.parentMenuItemId) {
                case "changeTool":
                    setTool(toolIds.indexOf(info.menuItemId));
                    break;
                case "changeColor":
                    setColor(colorIds.indexOf(info.menuItemId));
                    break;
                case "changeLine":
                    setLine(lineIds.indexOf(info.menuItemId));
                    break;
            }
//            chrome.contextMenus.update(info.menuItemId, {checked: true});
        }
    });
};
var mainTitles = ["convert image drawable", "change tool", "change color", "change line width", "reset image", "flip image horizontal", "flip image vertical"];
var mainIds = ["toCanvas", "changeTool", "changeColor", "changeLine", "resetCanvas", "flipHorizontal", "flipVertical"];
var mainContexts = ["image", "all", "all", "all", "all", "all", "all"];

var toolTitles = ["pen", "line"];
var toolIds = ["toPen", "toLine"];

var colorTitles = ["black", "white", "Red", "Green", "Blue"];
var colorIds = ["toBlack", "toWhite", "toRed", "toGreen", "toBlue"];

var lineTitles = ["1", "3", "5"];
var lineIds = ["toThinLine", "toNormalLine", "toThickLine"];

function ContextItems() {
    var items = [];

    items.push({
        title: "Image Drawer options",
        id: 'main',
        contexts: ["all"]
    });


    for (var i = 0; i < mainTitles.length; i++) {
        items.push({
            title: mainTitles[i],
            parentId: 'main',
            id: mainIds[i],
            contexts: [mainContexts[i]]
        });
    }

    for (var i = 0; i < toolTitles.length; i++) {
        items.push({
            //        type: "radio",
            title: toolTitles[i],
            parentId: "changeTool",
            id: toolIds[i],
            contexts: ["all"]
        });
    }

    for (var i = 0; i < colorTitles.length; i++) {
        items.push({
//            type: "radio",
            title: colorTitles[i],
            parentId: "changeColor",
            id: colorIds[i],
            contexts: ["all"]
        });
    }

    for (var i = 0; i < lineTitles.length; i++) {
        items.push({
            //      type: "radio",
            title: lineTitles[i],
            parentId: "changeLine",
            id: lineIds[i],
            contexts: ["all"]
        });
    }

    return items;
}

ContextMenus.setItems(ContextItems());

chrome.runtime.onInstalled.addListener(ContextMenus.create);