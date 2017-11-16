var alertMessage = function (message) {
    alert(message);
}

var confirmMessage = function (message) {
    return confirm(message);
}

var getActiveInfo = function () {

    var doc = fl.getDocumentDOM();
    if (!doc) {
        return null;
    }

    doc.save();

    var path = doc.path;

    return path.split('.fla')[0] + '_and_' + doc.type;
}

var startConvert = function (paths) {

    var pathsArr = paths.split('_and_');

    var currentTempFoldURI = pathsArr.pop();

    var asssetURI = pathsArr.pop();

    var inFolder = pathsArr[0];

    var files = FLfile.listFolder(inFolder + "/*.fla", "files");

    var fileURI;

    var legalFPS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

    for (fileURI in files) {
        fl.trace(fileURI = inFolder + '/' + files[fileURI]);

        var doc = fl.openDocument(fileURI);

        if (doc.type == 'Flash') {

            fl.runScript(asssetURI + 'ConvertToCanvasDocument.jsfl', "startConvertCanvas", currentTempFoldURI);
            fl.runScript(asssetURI + 'CherkForPureColorVectorgraph.jsfl', 'CherkForPureColorVectorgraph');

            doc.close(false);
            doc = fl.getDocumentDOM();
        }else{
            fl.runScript(asssetURI + 'CherkForPureColorVectorgraph.jsfl', 'CherkForPureColorVectorgraph');            
        }

        if (doc.frameRate < 60 && (60 % doc.frameRate) != 0) {
            for (var j = 1; j < legalFPS.length; j++) {
                if (legalFPS[j] > doc.frameRate) {
                    if (Math.abs(legalFPS[j - 1] - doc.frameRate) > Math.abs(legalFPS[j]) - doc.frameRate) {
                        doc.frameRate = legalFPS[j];
                    } else {
                        doc.frameRate = legalFPS[j - 1];
                    }
                    break;
                }
            }
        }
        doc.importPublishProfile(asssetURI + 'SVGA-FLConveter.apr');
        doc.publish();
        doc.close(false);
    }

};