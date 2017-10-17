var alertMessage = function (message) {
    alert(message);
}

var confirmMessage = function (message) {
    return confirm(message);
}

var getActiveInfo = function () {

    var doc = fl.getDocumentDOM();
    if ( !doc ) {
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

    for (fileURI in files) {
        fl.trace(fileURI = inFolder + '/' + files[fileURI]);

        var doc = fl.openDocument(fileURI);

        if (doc.type == 'Flash') {

            fl.runScript(asssetURI + 'ConvertToCanvasDocument.jsfl', "startConvertCanvas", currentTempFoldURI);
            fl.runScript(asssetURI + 'CherkForPureColorVectorgraph.jsfl', 'CherkForPureColorVectorgraph');

            doc.close(false);
            doc = fl.getDocumentDOM();
        }

        doc.importPublishProfile(asssetURI + 'SVGA-FLConveter.apr');

        doc.publish();
        doc.close(false);
    }

};