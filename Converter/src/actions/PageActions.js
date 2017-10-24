var csInterface = new CSInterface();
var fs = require('fs');
var nodePath = require('path');
var zlib = require('zlib');
var spawn = require('child_process');
var request = require('request');
var portfinder = require('portfinder');

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
var USEFFULPORT;
var CURRENT_OUTPUT_VERSION = "2.0";

var CONSULEMESSAGE = '请先打开资源文件...';

function alertMessages(message) {
    csInterface.evalScript("alertMessage('" + message + "');");
}

function confirmMessages(message, callbackTrue, callbackFalse) {
    csInterface.evalScript("confirmMessage('" + message + "');", function (result) {

        if (result == 'true'){
            callbackTrue();

        }else{
            callbackFalse();
        }
    });
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

        if (CURRENT_SOURCE_NAME == 'undefined'){
            alertMessages(CONSULEMESSAGE);
        }else {
            var result = window.cep.fs.showSaveDialogEx ("选择保存目录", CURRENT_SOURCE_PATH, ["svga"], CURRENT_SOURCE_NAME + '.svga', '');

            if (result.data){
                outPutPath = result.data;

                var startConvertBtn = document.getElementById("startConvertBtn");
                startConvertBtn.disabled = false;
                var dropDownBtn = document.getElementById("dropDownBtn");
                dropDownBtn.disabled = false;
            }
        }
    });
}

function openMenu() {
    
    document.getElementById("dropGroupDiv").className = document.getElementById("dropGroupDiv").className == "col-md-5 btn-group" ? "col-md-5 btn-group open" : "col-md-5 btn-group";

}

function startConvert() {

    if(outPutPath == null || outPutPath == undefined || outPutPath == ''){

        alertMessages("请先选择输出路径...");

    }else {

        copySourceToTempFolder(function () {
            var startConvertBtn = document.getElementById("startConvertBtn");
            startConvertBtn.disabled = true;
            var dropDownBtn = document.getElementById("dropDownBtn");
            dropDownBtn.disabled = true;

            csInterface.evalScript("startConvert('" + getAbsoluURIForPath(TEMP_SOURCE_PATH) + '_and_' + getAbsoluURIForPath(nodePath.join(CURRENT_PROJECT_PATH, 'src', 'assets') + nodePath.sep) + '_and_' + getAbsoluURIForPath(nodePath.join(TEMP_SOURCE_PATH, 'tempConvertedFile_Canvas.fla')) + "');", function () {
                CONSULEMESSAGE = CONSULEMESSAGE + '\\n 发布成功...';
                // 处理 html
                var htmlPath = nodePath.join(TEMP_SOURCE_PATH, 'tempConvertedFile_Canvas.html');

                fs.readFile(htmlPath, function (err, data) {

                    var htmlString = data.toString();
                    htmlString = "<script>window.currentVersion=\"" + CURRENT_OUTPUT_VERSION + "\"</script>" + htmlString;
                    if(htmlString.indexOf("})(createjs = createjs||{}, AdobeAn = AdobeAn||{});") > 0 ) {

                        htmlString = htmlString.replace("})(createjs = createjs||{}, AdobeAn = AdobeAn||{});", "window.lib = lib; window.ss=ss; window.img=img;})(createjs = createjs||{}, AdobeAn = AdobeAn||{});");
                    }

                    fs.writeFile(htmlPath, htmlString, function (err) {
                        // 处理图片
                        fs.exists(nodePath.join(TEMP_SOURCE_PATH, 'images'), function(exists) {

                            if (exists){
                                var files = fs.readdirSync(nodePath.join(TEMP_SOURCE_PATH, 'images'));
                                // 将资源图片全部压缩
                                files.forEach(function (file, index) {
                                    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功压缩图片...' + index;

                                    var imgPath = nodePath.join(TEMP_SOURCE_PATH, 'images', file);
                                    var outImgPath = nodePath.join(TEMP_SOURCE_PATH, 'images', encodeURIComponent(file));
                                    var isLastImage = index == (files.length - 1);

                                    pngquantImage(imgPath, outImgPath, isLastImage, function () {
                                        setTimeout("createHTTPServer()", 500);
                                    });
                                });
                            }else {
                                setTimeout("createHTTPServer()", 500);
                            }
                        });
                    });
                });
            });
        });
    }
}

function copySourceToTempFolder(callback) {

    // 删除临时文件目录
    deleteFlider(TEMP_SOURCE_PATH, true, true, function () {
        CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功清除临时目录...';

        // 创建 temp 文件夹
        fs.mkdir(TEMP_SOURCE_PATH, function () {
            CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功创建临时目录...';

            // 复制资源到 temp 文件夹
            fs.readFile(nodePath.join(CURRENT_SOURCE_PATH, CURRENT_SOURCE_REALNAME + '.fla'), function(err,data){
                fs.writeFile(nodePath.join(TEMP_SOURCE_PATH, 'tempConvertedFile' + CURRENT_SOURCT_SUFFIX + '.fla'),data,function(err){
                    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功创建临时资源文件...';
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

    portfinder.getPort(function (err, port) {
        USEFFULPORT = port;
        var http = require('http');
        httpServer = http.createServer(function (req, res)
        {
            // CURRENT_SOURCE_PATH + req.url.split('?')[0]

            fs.createReadStream(nodePath.join(TEMP_SOURCE_PATH, req.url.split('?')[0])).pipe(res);
        }).listen(port, '127.0.0.1');

        CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功创建服务器 port：' + USEFFULPORT + '...';
        updateiFrame();
    });
}

// 刷新 iFrame
function updateiFrame() {
    // 创建 iFrame 标签，转换数据
    var converteriFrame = document.getElementById("ConverterFrame");
    var newiFrame = document.createElement("iframe");

    newiFrame.setAttribute('id', 'ConverterFrame');
    newiFrame.setAttribute('src', 'http://127.0.0.1:' + USEFFULPORT + '/tempConvertedFile_Canvas.html');
    newiFrame.setAttribute('width', '0');
    newiFrame.setAttribute('height', '0');
    newiFrame.style.display = 'none';

    var parent = converteriFrame.parentNode;
    parent.replaceChild(newiFrame, converteriFrame);

    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 开始转换...';
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
    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 转换完成...';

    // 完成转换后关闭服务器
    httpServer.close();
    var converteriFrame = document.getElementById("ConverterFrame");
    converteriFrame.setAttribute('src', '#');

    // 将文件写入本地
    if(CURRENT_OUTPUT_VERSION == "2.0"){
        const stream = new Buffer(result);
        fs.writeFileSync(outPutPath, zlib.deflateSync(stream))
    }else{
        window.cep.fs.writeFile (outPutPath, result, "Base64");
    }
    
    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 成功写出资源...';

    // 删除 temp 目录
    deleteFlider(TEMP_SOURCE_PATH, true, true, function () {});

    preview(outPutPath);
    CONSULEMESSAGE = CONSULEMESSAGE + '\\n 开始播放...';
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

function changeToVersion(version){
    CURRENT_OUTPUT_VERSION = version;
    var startConvertBtn = document.getElementById("startConvertBtn");
    startConvertBtn.innerHTML = "开始转换 - " + version;
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
    
    var fileName = filePath;
    
    parser.load(fileName, function (videoItem) {
        
        player.setContentMode("AspectFit");
        player.setClipsToBounds(true);

        player.setVideoItem(videoItem);
        player.startAnimation()
    });
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
