module.exports = class SVGAResourceHelper {

    resource = {};

    constructor(resource) {
        this.resource = resource;
    }

    copyToBinary = (fileMapping, callback) => {
        if (Object.keys(this.resource).length == 0) {
            callback({});
            return;
        }
        let storageCounter = 0;
        let self = this;
        let imageLoaded = 0;
        let result = {};
        let imgID = 0;
        for (let imageKey in this.resource) {
            if (this.resource.hasOwnProperty(imageKey)) {
                imgID++;
                let filename = this.resource[imageKey].imageKey;
                let zipFilename = imageKey + ".png";
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('GET', this.resource[imageKey].dataPath, true);
                xhr.onload = () => {
                    var reader = new window.FileReader();
                    reader.readAsArrayBuffer(xhr.response);
                    reader.onloadend = function () {
                        fileMapping[imageKey] = reader.result;
                        imageLoaded++;
                        result[imageKey] = imageKey;

                        var data = new Uint8Array(reader.result);
                        var width = data[18]*256+data[19];
                        var height = data[22]*256+data[23];
                        storageCounter += (width*height*4);

                        if (imageLoaded >= Object.keys(self.resource).length) {
                            callback(result, storageCounter);
                        }
                    }
                }
                xhr.send();
            }
        }
    }

    copyToZIP = (zip, callback) => {
        if (Object.keys(this.resource).length == 0) {
            callback({});
            return;
        }
        let storageCounter = 0;
        let self = this;
        let imageLoaded = 0;
        let result = {};
        let imgID = 0;
        for (let imageKey in this.resource) {
            if (this.resource.hasOwnProperty(imageKey)) {
                imgID++;
                let filename = this.resource[imageKey].imageKey;
                let zipFilename = imageKey + ".png";
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('GET', this.resource[imageKey].dataPath, true);
                xhr.onload = () => {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(xhr.response);
                    reader.onloadend = function () {
                        var base64data = reader.result;
                        var data = self.dataURLtoUint8(base64data);

                        var width = data[18]*256+data[19];
                        var height = data[22]*256+data[23];
                        storageCounter += (width*height*4);

                        if (window.cep !== undefined) {
                            let compressedBlob = new Blob([data]);
                            zip.file(zipFilename, compressedBlob);
                        }
                        else {
                            var compressedData = pngquant(data, { quality: "0-100", speed: "2" }, console.log)
                            let compressedBlob = new Blob([compressedData.data.buffer]);
                            zip.file(zipFilename, compressedBlob);
                        }
                        imageLoaded++;
                        result[imageKey] = imageKey;
                        if (imageLoaded >= Object.keys(self.resource).length) {
                            callback(result, storageCounter);
                        }
                    }
                }
                xhr.send();
            }
        }
    }

    dataURLtoUint8(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return u8arr;
    }
}