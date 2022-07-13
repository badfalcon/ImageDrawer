// アイコンがクリックされるたびに呼び出される

$(function () {
    getSettings();

    $('#tool').on('change', function () {
        setTool(parseInt($(this).val()));
        //      chrome.storage.local.set({"toolIndex": $(this).val()}, function (data) {
        //  });
    });
    $('#color').on('change', function () {
        setColor(parseInt($(this).val()));
        //      chrome.storage.local.set({"colorIndex": $(this).val()}, function (data) {
        //    });
    });
    $('#line').on('change', function () {
        setLine(parseInt($(this).val()));
//        chrome.storage.local.set({"lineIndex": $(this).val()}, function (data) {
        //      });
    });
});

function getSettings() {
    chrome.storage.sync.get({"toolIndex": 0, "lineIndex": 1, "colorIndex": 0}, function (data) {
        $('#tool').val(data.toolIndex);
        $('#color').val(data.colorIndex);
        $('#line').val(data.lineIndex);
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