module.exports = class SVGAResourceHelper {

    resource = {};

    constructor(resource) {
        this.resource = resource;
    }

    copyToZIP = (zip, callback) => {
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
                        var compressedData = pngquant(data, { quality: "0-100", speed: "2" }, console.log)
                        let compressedBlob = new Blob([compressedData.data.buffer]);
                        zip.file(zipFilename, compressedBlob);
                        imageLoaded++;
                        result[imageKey] = zipFilename;
                        if (imageLoaded >= Object.keys(self.resource).length) {
                            callback(result);
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