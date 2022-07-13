var canvas;

var dom;
var image = null;

document.addEventListener("mousedown", function (event) {
    //right click
    if (event.button == 2) {
        dom = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "imageToCanvas") {
        selectedImageToCanvas();
    } else if (request.action == "resetCanvas") {
        resetCanvas();
    } else if (request.action == "flipHorizontal") {
        flipCanvas(true, false);
    } else if (request.action == "flipVertical") {
        flipCanvas(false, true);
    }
});

function imageToCanvas() {
    if (image !== null) {

    } else {

    }
}

function selectedImageToCanvas() {
    image = dom;
    var width = image.width;
    var height = image.height;
    var id = image.getAttribute('id');
    var cl = image.getAttribute('class');
    var st = image.getAttribute('style');

    canvas = $('<canvas>');

    canvas.attr('width', width);
    canvas.attr('height', height);
    if (id !== "") {
        canvas.attr('id', id);
    }
    if (cl !== "") {
        canvas.attr('class', cl);
    }
    if (st !== "") {
        canvas.attr('style', st);
    }
    canvas.css('cursor', 'crosshair');

    image.style.display = "none";

    image.parentNode.insertBefore(canvas[0], image);
    var context = canvas[0].getContext('2d');
    // context.transform(-1,0,0,0,1,0);
    context.drawImage(image, 0, 0, width, height);
    setCanvasDrawable(canvas);
    console.log(canvas);
}

function resetCanvas() {
    console.log(canvas);
    if (isCanvas(dom)) {
        console.log(canvas);
        var context = canvas.getContext('2d');
        context.clearRect(0,0,image.width, image.height);
        context.drawImage(image, 0, 0, image.width, image.height);
    } else {
    }
}

function flipCanvas(horizontal, vertical) {
    console.log(canvas);
    if (isCanvas(dom)) {
        console.log(canvas);
        var ctx = canvas.getContext('2d');
        var w = image.width;
        var h = image.height;

        var input = ctx.getImageData(0, 0, w, h);
        // Create output image data temporary buffer
        var output = ctx.createImageData(w, h);
        // Get imagedata size
        var inputData = input.data;
        var outputData = output.data;
        // loop
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                // RGB
                var i = (y * w + x) * 4;
                var flip;
                if (horizontal) {
                    flip = (y * w + (w - 1 - x)) * 4;
                }
                if (vertical) {
                    flip = ((h - 1 - y) * w + x) * 4;
                }
                for (var c = 0; c < 4; c++) {
                    outputData[i + c] = inputData[flip + c];
                }
            }
        }
        ctx.putImageData(output, 0, 0);
    } else {
    }
}

function isCanvas(dom) {
    return !!(dom.getContext && dom.getContext('2d'));
}