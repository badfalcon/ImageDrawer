a = "ImageDrawer\n\nmade by \nbadfalcon\nbadfalcon610@gmail.com"
console.log(a);

let toolIndex;
let colorIndex;
let lineIndex;

chrome.runtime.onInstalled.addListener(function () {
    setDefault();
});

chrome.runtime.onStartup.addListener(function () {
    setDefault();
});

function setToolSetting(ti, li, ci) {
    let args = {};
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

let ContextMenus = new function () {
    let items = {};

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
        }
    });
};
let mainTitles = ["convert image drawable", "change tool", "change color", "change line width", "reset image", "flip image horizontal", "flip image vertical"];
let mainIds = ["toCanvas", "changeTool", "changeColor", "changeLine", "resetCanvas", "flipHorizontal", "flipVertical"];
let mainContexts = ["image", "all", "all", "all", "all", "all", "all"];

let toolTitles = ["pen", "line"];
let toolIds = ["toPen", "toLine"];

let colorTitles = ["black", "white", "Red", "Green", "Blue"];
let colorIds = ["toBlack", "toWhite", "toRed", "toGreen", "toBlue"];

let lineTitles = ["1", "3", "5"];
let lineIds = ["toThinLine", "toNormalLine", "toThickLine"];

function ContextItems() {
    let items = [];

    items.push({
        title: "Image Drawer options",
        id: 'main',
        contexts: ["all"]
    });


    for (let i = 0; i < mainTitles.length; i++) {
        items.push({
            title: mainTitles[i],
            parentId: 'main',
            id: mainIds[i],
            contexts: [mainContexts[i]]
        });
    }

    for (let i = 0; i < toolTitles.length; i++) {
        items.push({
            //        type: "radio",
            title: toolTitles[i],
            parentId: "changeTool",
            id: toolIds[i],
            contexts: ["all"]
        });
    }

    for (let i = 0; i < colorTitles.length; i++) {
        items.push({
//            type: "radio",
            title: colorTitles[i],
            parentId: "changeColor",
            id: colorIds[i],
            contexts: ["all"]
        });
    }

    for (let i = 0; i < lineTitles.length; i++) {
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