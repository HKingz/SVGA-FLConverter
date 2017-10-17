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

        if(window.currentVersion == "2.0"){
            writer.createBinaryPackage((blob) => {
                if (window.cep !== undefined) {
                    window.top.saveAs(blob);
                }
                // onConverted(blob);
            });
        }else{
            writer.createZIPPackage((blob) => {
                var reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    base64data = reader.result;
                    window.top && window.top.saveAs(base64data.replace("data:application/zip;base64,", ""))
                }
            });
        }
    }
    window.top && window.top.LoadingPercent && window.top.LoadingPercent(parseInt(currentFrame / totalFrames * 100))
    document.querySelector('.downloadButton').innerHTML = "转换中：" + parseInt(currentFrame / totalFrames * 100) + "%";
}

var onConverted = function (blob) {
    var reader = new window.FileReader();
    // reader.readAsDataURL(blob);
    reader.onloadend = function () {
        base64data = reader.result;
        document.querySelector('#canvas').style.opacity = 1.0;
        document.querySelector('.downloadButton').innerHTML = "下载 SVGA 文件";
        var player = new Svga.Player('#canvas');
        var parser = new Svga.Parser();
        parser.load(base64data.replace("data:application/zip;base64,", "data:image/svga;base64,"), function (videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
        });
    }
}

handleComplete = function (event, comp) {
    originalHandleComplete(event, comp);
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