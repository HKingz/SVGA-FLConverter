module.exports = class SVGAResourceHelper {

    resource = {};

    constructor(resource) {
        this.resource = resource;
    }

    copyToZIP = (zip, callback) => {
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
                    zip.file(zipFilename, xhr.response);
                    imageLoaded++;
                    result[imageKey] = zipFilename;
                    if (imageLoaded >= Object.keys(this.resource).length) {
                        callback(result);
                    }
                }
                xhr.send();
            }
        }
    }

}