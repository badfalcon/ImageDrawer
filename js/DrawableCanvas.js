/**
 * Created by badfalcon on 2015/12/23.
 */
var offset = {x: null, y: null};

var toolIndex;
var colorIndex;
var lineIndex;

var lineValues = [1, 3, 5];
var colorValues = ["000000", "ffffff", "ff0000", "00ff00", "0000ff"];

var canvas;

function setCanvasDrawable(dom) {
    dom.on('mousedown', onCanvasMouseDown);
    dom.on('mousemove', onCanvasMouseMove);
    dom.on('mouseup', onCanvasMouseUp);
    dom.on('mouseenter', onCanvasMouseEnter);
    dom.on('mouseleave', onCanvasMouseLeave);
}

var old;

var pressed;

function onCanvasMouseDown(e, m) {
    me = m || $(this);

    e.preventDefault();

    if (e.target !== canvas) {
        canvas = dom;
        var rect = e.target.getBoundingClientRect();
        offset.x = parseInt(me.css('padding-left'), 10) + parseInt(me.css('border-left'), 10) + rect.left;
        offset.y = parseInt(me.css('padding-top'), 10) + parseInt(me.css('border-top'), 10) + rect.top;
    }

    if (isLeftMouseButton(e)) {

        chrome.storage.sync.get({"toolIndex": 0, "lineIndex": 1, "colorIndex": 0}, function (data) {
            toolIndex = data.toolIndex;
            colorIndex = data.colorIndex;
            lineIndex = data.lineIndex;

            var context = e.target.getContext('2d');

            context.strokeStyle = "#" + colorValues[colorIndex];
            console.log("#" + colorValues[colorIndex]);
            context.lineWidth = lineValues[lineIndex];
            console.log("#" + lineValues[lineIndex]);

            var pos = getMousePosition(e);
            old = {x: pos.x, y: pos.y};
            pressed = true;
            context.beginPath();
            context.moveTo(pos.x, pos.y);

        });

    }

}

function onCanvasMouseMove(e) {
    e.preventDefault();
    if (pressed) {
        var pos = getMousePosition(e);

        var context = e.target.getContext('2d');

        switch (toolIndex) {
            case 0:
                context.lineTo(pos.x, pos.y);
                context.stroke();
                break;
            case 1:
                break;
        }

        old = {x: pos.x, y: pos.y};
    }
}

function onCanvasMouseUp(e) {
    e.preventDefault();
    if (pressed) {
        pressed = false;
        switch (toolIndex) {
            case 0:
                break;
            case 1:
                var pos = getMousePosition(e);
                var context = e.target.getContext('2d');
                context.lineTo(pos.x, pos.y);
                context.stroke();
                break;
        }
    }
}

function onCanvasMouseEnter(e) {
    if (!e) e = window.event; // レガシー

    // buttons プロパティが利用可能である
    if (e.buttons !== undefined) {

        var data = e.buttons;

        var button_l = ((data & 0x0001) ? true : false);
        var button_r = ((data & 0x0002) ? true : false);
        var button_c = ((data & 0x0004) ? true : false);

        if (button_l) {
            onCanvasMouseDown(e, $(this));
        }
    }

    // ------------------------------------------------------------
    // デフォルトの動作を無効化する
    // ------------------------------------------------------------
    if (e.preventDefault) {
        // デフォルトの動作を無効化する
        e.preventDefault();
    } else {
        // デフォルトの動作を無効化する(非標準)
        return false;
    }
}

function onCanvasMouseLeave(e) {
    e.preventDefault();
    onCanvasMouseMove(e);
    pressed = false;
}

function getMousePosition(e) {
    var mouse = {x: null, y: null};
    mouse.x = e.clientX - offset.x;
    mouse.y = e.clientY - offset.y;
    return mouse;
}

function isLeftMouseButton(e) {
    if (!e) e = window.event; // レガシー

    // buttons プロパティが利用可能である
    if (e.button !== undefined) {

        var button = e.button;
        return (button === 0);

    }
    return false;
}