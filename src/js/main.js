'use strict';

/**
 * @file  : svga-flconverter
 * @author: cuiminghui
 * @team  : UED中心
 * @export: umd
 */

import SVGATimeline from './modules/SVGATimeline'
import SVGAWriter from './modules/SVGAWriter'

var originalHandleComplete = handleComplete;
var currentFrame = 0;
var timeline = null;

var onTick = function (event) {
    stage.handleEvent(event);
    timeline.readFrame(currentFrame);
    currentFrame++;
    if (currentFrame >= exportRoot.totalFrames) {
        createjs.Ticker.removeAllEventListeners();
        timeline.resetOrders();
        let writer = new SVGAWriter(timeline);
        writer.createZIPPackage((blob) => {
            onConverted(blob);
        });
    }
}

var onConverted = function (blob) {
    document.querySelector('#canvas').style.opacity = 1.0;
    document.querySelector('.downloadButton').innerHTML = "下载 SVGA 文件";
    var player = new Svga.Player('#canvas');
    var parser = new Svga.Parser();
    parser.load(new File([blob], 'output.svga'), function (videoItem) {
        player.setVideoItem(videoItem);
        player.startAnimation();
    });
}

handleComplete = function (event) {
    originalHandleComplete(event);
    createjs.Ticker.removeAllEventListeners();
    timeline = new SVGATimeline();
    createjs.Ticker.addEventListener("tick", onTick);
    document.querySelector('#canvas').style.opacity = 0.0;
    document.querySelector('.downloadButton').innerHTML = "正在转换中";
}

if (navigator.userAgent.indexOf("Chrome") < 0) {
    alert("请复制 URL， 然后使用 Chrome 浏览器打开此页面");
}