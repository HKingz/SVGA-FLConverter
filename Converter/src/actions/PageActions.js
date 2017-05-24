var csInterface = new CSInterface();
var nodePath = require("path");
var spawn = require("child_process");

var outPutPath;
var inputPath;

var player;
var parser;

var httpServer;

var CURRENT_SOURCE_PATH;
var CURRENT_SOURCE_NAME;
var CURRENT_PROJECT_PATH = csInterface.getSystemPath(SystemPath.APPLICATION);

csInterface.evalScript("getActiveInfo()", function (result) {

    CURRENT_SOURCE_PATH = nodePath.dirname(result);
    CURRENT_SOURCE_NAME = nodePath.basename(result, '.fla');

});

function selectPath() {

    var result = window.cep.fs.showSaveDialogEx ("选择保存目录", CURRENT_SOURCE_PATH, ["svga"], CURRENT_SOURCE_NAME + '.svga', '');

    outPutPath = result.data;

    var startConvertBtn = document.getElementById("startConvertBtn");
    startConvertBtn.disabled = false;
}

function startConvert() {

    if(outPutPath == null || outPutPath == undefined || outPutPath == ''){
        alert("请先选择输出路径...");

    }else {
        var startConvertBtn = document.getElementById("startConvertBtn");
        startConvertBtn.disabled = true;

        csInterface.evalScript("startConvert('"+ getAbsoluURIForPath(CURRENT_SOURCE_PATH) + '_and_' + getAbsoluURIForPath(nodePath.join(CURRENT_PROJECT_PATH, 'src', 'assets', 'SVGA-FLConveter.apr'))  +"');", function (res) {

            // 将资源图片全部压缩
            var fs = require('fs')

            fs.readdirSync(nodePath.join(CURRENT_SOURCE_PATH, 'images')).forEach(function (file) {

                var imgPath = nodePath.join(CURRENT_SOURCE_PATH, 'images', file);
                pngquantImage(imgPath, imgPath);

            });

            setTimeout("createHTTPServer()",500);
        });
    }
}

function createHTTPServer() {

    var port = 10045;

    var http = require('http');
    httpServer = http.createServer(function (req, res)
    {
        // CURRENT_SOURCE_PATH + req.url.split('?')[0]
        require("fs").createReadStream(nodePath.join(CURRENT_SOURCE_PATH, req.url.split('?')[0])).pipe(res);
    }).listen(port, '127.0.0.1');

    // 创建 iFrame 标签，转换数据
    var converteriFrame = document.getElementById("ConverterFrame");
    var newiFrame = document.createElement("iframe");

    // <iframe id="ConverterFrame" src="http://127.0.0.1:10045/shengli_Canvas.html" width="0" height="0" style="display: none"></iframe>
    newiFrame.setAttribute('id', 'ConverterFrame');
    newiFrame.setAttribute('src', 'http://127.0.0.1:10045/'+ CURRENT_SOURCE_NAME +'_Canvas.html');
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
}

// 转换完成回调
function saveAs(result) {

    // 完成转换后关闭服务器
    httpServer.close();
    var converteriFrame = document.getElementById("ConverterFrame");
    converteriFrame.setAttribute('src', '#');

    // 将文件写入本地
    window.cep.fs.writeFile (outPutPath, result, "Base64");

    preview(outPutPath);
    outPutPath = undefined;


    // 删除资源文件
    var fs = require('fs')
    fs.readdirSync(CURRENT_SOURCE_PATH + '/images').forEach(function (file) {

        // CURRENT_SOURCE_PATH + '/images/' + file
        window.cep.fs.deleteFile(nodePath.join(CURRENT_SOURCE_PATH, 'images', file));
    });
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

    if (videoItem.videoSize.width > videoItem.videoSize.height){

        scale = (videoItem.videoSize.height / videoItem.videoSize.width);
        moveY = ((400 - 400 * scale)) / 2;

    }else{

        scale = (videoItem.videoSize.width / videoItem.videoSize.height);
        moveX = ((400 - 400 * scale)) / 2;
    }

    player.setVideoItem(videoItem);
    player._stageLayer.setTransform(moveX, moveY, scale, scale);

    player.startAnimation();
}

function pngquantImage(inImgPath, outImgPath) {

    var program;

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
}