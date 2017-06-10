var csInterface = new CSInterface();
var fs = require('fs');
var nodePath = require("path");
var spawn = require("child_process");
var request = require('request');
var unzip = require("unzip");

var outPutPath;
var inputPath;

var player;
var parser;

var httpServer;

var CURRENT_SOURCE_PATH;
var CURRENT_SOURCE_NAME;
var CURRENT_SOURCE_REALNAME;
var CURRENT_SOURCT_SUFFIX = '';
var TEMP_SOURCE_PATH = nodePath.join(csInterface.getSystemPath(SystemPath.MY_DOCUMENTS), '_WORKINGTEMP_');
var CURRENT_PROJECT_PATH = csInterface.getSystemPath(SystemPath.APPLICATION);

function alertMessages(message) {
    csInterface.evalScript("alertMessage('" + message + "');");
}

function updateInfo(callback) {
    csInterface.evalScript("getActiveInfo()", function (result) {

        var infoArr = result.split('_and_');
        var sourceType = infoArr.pop();
        var sourcePath = infoArr[0];

        CURRENT_SOURCE_PATH = nodePath.dirname(sourcePath);
        CURRENT_SOURCE_REALNAME = nodePath.basename(sourcePath, '.fla');

        if (sourceType == 'htmlcanvas') {

            var nameArray = CURRENT_SOURCE_REALNAME.split('_');

            CURRENT_SOURCT_SUFFIX = '_Canvas';
            CURRENT_SOURCE_NAME = nameArray[0];
        }else{
            CURRENT_SOURCE_NAME = CURRENT_SOURCE_REALNAME;
        }

        callback();
    });
}

function selectPath() {

    updateInfo(function () {
        var result = window.cep.fs.showSaveDialogEx ("选择保存目录", CURRENT_SOURCE_PATH, ["svga"], CURRENT_SOURCE_NAME + '.svga', '');

        if (result.data){
            outPutPath = result.data;

            var startConvertBtn = document.getElementById("startConvertBtn");
            startConvertBtn.disabled = false;
        }
    });
}

function startConvert() {

    if(outPutPath == null || outPutPath == undefined || outPutPath == ''){

        alertMessages("请先选择输出路径...");

    }else {

        copySourceToTempFolder(function () {

            var startConvertBtn = document.getElementById("startConvertBtn");
            startConvertBtn.disabled = true;

            csInterface.evalScript("startConvert('" + getAbsoluURIForPath(TEMP_SOURCE_PATH) + '_and_' + getAbsoluURIForPath(nodePath.join(CURRENT_PROJECT_PATH, 'src', 'assets') + nodePath.sep) + '_and_' + getAbsoluURIForPath(nodePath.join(TEMP_SOURCE_PATH, 'tempConvertedFile_Canvas.fla')) + "');", function () {

                var files = fs.readdirSync(nodePath.join(TEMP_SOURCE_PATH, 'images'));

                // 将资源图片全部压缩
                files.forEach(function (file, index) {

                    var imgPath = nodePath.join(TEMP_SOURCE_PATH, 'images', file);
                    var outImgPath = nodePath.join(TEMP_SOURCE_PATH, 'images', encodeURIComponent(file));
                    var isLastImage = index == (files.length - 1);

                    pngquantImage(imgPath, outImgPath, isLastImage, function () {

                        setTimeout("createHTTPServer()", 500);
                    });
                });
            });
        });
    }
}

function copySourceToTempFolder(callback) {

    // 删除临时文件目录
    deleteFlider(TEMP_SOURCE_PATH, true, true, function () {

        // 创建 temp 文件夹
        fs.mkdir(TEMP_SOURCE_PATH, function () {

            // 复制资源到 temp 文件夹
            fs.readFile(nodePath.join(CURRENT_SOURCE_PATH, CURRENT_SOURCE_REALNAME + '.fla'), function(err,data){
                fs.writeFile(nodePath.join(TEMP_SOURCE_PATH, 'tempConvertedFile' + CURRENT_SOURCT_SUFFIX + '.fla'),data,function(err){
                    callback();
                });
            });
        });
    });
}

function deleteFlider(path, isFirstFolder, delFirstFolder, callback) {

    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {

            var curPath = nodePath.join(path, file);
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFlider(curPath, false, true);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        if (!isFirstFolder || delFirstFolder) {
            fs.rmdirSync(path);
        }
    }
    if (isFirstFolder){
        callback();
    }
}

function createHTTPServer() {

    var port = 10045;

    var http = require('http');
    httpServer = http.createServer(function (req, res)
    {
        // CURRENT_SOURCE_PATH + req.url.split('?')[0]
        
        fs.createReadStream(nodePath.join(TEMP_SOURCE_PATH, req.url.split('?')[0])).pipe(res);
    }).listen(port, '127.0.0.1');

    updateiFrame();
}

// 刷新 iFrame
function updateiFrame() {
    // 创建 iFrame 标签，转换数据
    var converteriFrame = document.getElementById("ConverterFrame");
    var newiFrame = document.createElement("iframe");

    newiFrame.setAttribute('id', 'ConverterFrame');
    newiFrame.setAttribute('src', 'http://127.0.0.1:10045/tempConvertedFile_Canvas.html');
    newiFrame.setAttribute('width', '0');
    newiFrame.setAttribute('height', '0');
    newiFrame.style.display = 'none';

    var parent = converteriFrame.parentNode;
    parent.replaceChild(newiFrame, converteriFrame);
}

// 获取路径 uri
function getAbsoluURIForPath(path) {

    var result;
    // 判断当前系统
    var OSVersion = csInterface.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0){

        var pathArr =  path.replace(":\\", "|/").split("\\");

        result = "file:///" + pathArr.join("/");

    }
    else if (OSVersion.indexOf("Mac") >= 0)
    {
        result = 'file://' + path;
    }
    return result;
}

// 关闭窗口的时候关闭服务器
window.onunload = function()
{
    httpServer.close();

    // 删除临时文件目录
    deleteFlider(TEMP_SOURCE_PATH, true, true, function () {});
}

// 转换完成回调
function saveAs(result) {

    // 完成转换后关闭服务器
    httpServer.close();
    var converteriFrame = document.getElementById("ConverterFrame");
    converteriFrame.setAttribute('src', '#');

    // 将文件写入本地
    window.cep.fs.writeFile (outPutPath, result, "Base64");

    // 删除 temp 目录
    deleteFlider(TEMP_SOURCE_PATH, true, true, function () {});

    preview(outPutPath);
    outPutPath = undefined;
}

// 转换进度回调
function LoadingPercent(percentage) {

    if(!document.getElementById("selectFile").disabled){
        document.getElementById("selectFile").disabled = true;
    }

    if (percentage == 100){
        $("button#selectFile").text('选择播放文件');
        document.getElementById("selectFile").disabled = false;

    }else{
        $("button#selectFile").text('转换进度：' +  percentage.toString() + ' %');
    }



}

// 转换失败回调
function convertFail() {

    updateiFrame();

}

function selectFile() {

    var fileArr =  csInterface.getSystemPath(SystemPath.MY_DOCUMENTS).split("/");
    fileArr.pop();
    fileArr.pop();

    var desktopPath = fileArr.join("/") + "Desktop/";

    inputPath = window.cep.fs.showOpenDialogEx(false, false, "标题", desktopPath, ["svga"] , "").data.toString();

    preview(inputPath);
}

function preview(filePath) {

    var fileName = filePath.toString()

    var file = window.cep.fs.readFile(fileName, "Base64");

    parser.load("data:image/svga;base64," + file.data, function (videoItem) {

        previewWithVideoItems(videoItem);

    });
}

function previewWithVideoItems(videoItem) {
    var scale = 1;
    var moveX = 0;
    var moveY = 0;

    if (videoItem.videoSize.width <= 400 && videoItem.videoSize.height <= 400){


    }else{

        if (videoItem.videoSize.width > videoItem.videoSize.height){

            moveY = (400 - (videoItem.videoSize.height / videoItem.videoSize.width) * 400) / 2;

        }else{

            scale = (videoItem.videoSize.width / videoItem.videoSize.height);
            moveX = ((400 - 400 * scale)) / 2;
        }
    }

    player.setVideoItem(videoItem);
    player._stageLayer.setTransform(moveX, moveY, scale, scale);

    player.startAnimation();
}

function pngquantImage(inImgPath, outImgPath, isLastImage, callback) {

    var program;
    var programWriteFile;

    // 判断当前系统
    var OSVersion = csInterface.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0) {

        program = nodePath.join(CURRENT_PROJECT_PATH, 'pngquant', 'WINDOWS', 'pngquant.exe');
        program = '\"' + program + '\"';

    } else if (OSVersion.indexOf("Mac") >= 0) {

        program = nodePath.join(CURRENT_PROJECT_PATH, 'pngquant', 'OSX', 'pngquant').replace('Application ', 'Application\\ ');
    }

    var args = [

        '--quality=0-100',
        '--speed 2',
        inImgPath,
        '--output',
        outImgPath,
        '--force'
    ];
    spawn.execSync(program + ' ' + args.join(' '));

    if (isLastImage){
        programWriteFile = 'echo "WriteEnd" > ' + nodePath.join(TEMP_SOURCE_PATH, 'result');
        spawn.exec(programWriteFile, function () {
            callback();
        });
    }
}
