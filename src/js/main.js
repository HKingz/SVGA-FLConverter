
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
        writer.createZIPPackage((blob) => {
            onConverted(blob);
        });
    }
}

var onConverted = function(blob) {
    document.querySelector('#canvas').style.opacity = 1.0;
    document.querySelector('.downloadButton').innerHTML = "下载 SVGA 文件";
    var player = new Svga.Player('#canvas');
	var parser = new Svga.Parser();
	parser.load(new File([blob], 'output.svga'), function(videoItem) {
		player.setVideoItem(videoItem);
		player.startAnimation();
	});
}

handleComplete = function(event) {
    originalHandleComplete(event);
    createjs.Ticker.removeAllEventListeners();
    exporter = new Exporter();
    createjs.Ticker.addEventListener("tick", onTick);
    document.querySelector('#canvas').style.opacity = 0.0;
    document.querySelector('.downloadButton').innerHTML = "正在转换中";

}