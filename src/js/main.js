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
    var totalFrames = exportRoot.totalFrames;
    if (totalFrames === 1) {
        for (let index = 0; index < exportRoot.children.length; index++) {
            let element = exportRoot.children[index];
            if (element.totalFrames > 1) {
                totalFrames = Math.max(totalFrames, element.totalFrames);
            }
        }
    }
    if (currentFrame >= totalFrames) {
        createjs.Ticker.removeAllEventListeners();
        timeline.resetOrders();
        let writer = new SVGAWriter(timeline);
        writer.createZIPPackage((blob) => {
            onConverted(blob);
        });
    }
    document.querySelector('.downloadButton').innerHTML = "转换中：" + parseInt(currentFrame / totalFrames * 100) + "%";
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
    if (60 % lib.properties.fps > 0) {
        alert("FPS 只能是 60 的约数，如 [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]，当前 FPS = " + lib.properties.fps + "，请修改后再执行导出操作。");
        document.querySelector('#canvas').style.opacity = 0.0;
        document.querySelector('.downloadButton').innerHTML = "转换失败";
        throw new Error("FPS 只能是 60 的约数，如 [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]，当前 FPS = " + lib.properties.fps + "，请修改后再执行导出操作。");
    }
    if (!window.location.href.startsWith("http://")) {
        alert("请在 Flash 软件中，按 ctrl + enter 或 command + return 进行导出操作。");
        document.querySelector('#canvas').style.opacity = 0.0;
        document.querySelector('.downloadButton').innerHTML = "转换失败";
        throw new Error("请在 Flash 软件中，按 ctrl + enter 或 command + return 进行导出操作。");
    }
    createjs.Ticker.removeAllEventListeners();
    timeline = new SVGATimeline();
    createjs.Ticker.addEventListener("tick", onTick);
    document.querySelector('#canvas').style.opacity = 0.0;
    document.querySelector('.downloadButton').innerHTML = "正在转换中";
}

if (navigator.userAgent.indexOf("Chrome") < 0) {
    alert("请复制 URL， 然后使用 Chrome 浏览器打开此页面");
}