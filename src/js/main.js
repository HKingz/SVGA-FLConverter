
import Exporter from './exporter'
import Writer from './writer'

var originalHandleComplete = handleComplete;
var currentFrame = 0;
var exporter = null;

var onTick = function(event) {
    stage.handleEvent(event);
    exporter.readFrame(currentFrame);
    currentFrame++;
    if (currentFrame >= exportRoot.totalFrames) {
        createjs.Ticker.removeAllEventListeners();
        let writer = new Writer(exporter);
        writer.createZIPPackage();
    }
}

handleComplete = function(event) {
    originalHandleComplete(event);
    createjs.Ticker.removeAllEventListeners();
    exporter = new Exporter();
    createjs.Ticker.addEventListener("tick", onTick);
}