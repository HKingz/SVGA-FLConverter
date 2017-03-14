
module.exports = class Writer {

    exporter = null;

    constructor(exporter) {
        this.exporter = exporter;
    }

    createZIPPackage() {
        let zip = new JSZip();
        zip.file("movie.spec", JSON.stringify(this.createSpec()));
        let createPackage = () => {
            zip.generateAsync({type: "blob", compression: "DEFLATE"}).then((blob) => {
                saveAs(blob, document.title + ".svga");
            }, (err) => {
                console.log(err);
            });
        }
        let imageLoaded = 0;
        for (let imageKey in this.exporter.resources) {
            if (this.exporter.resources.hasOwnProperty(imageKey)) {
                let filename = this.exporter.resources[imageKey];
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('GET', './images/' + filename, true);
                xhr.onload = () => {
                    zip.file(filename, xhr.response);
                    imageLoaded++;
                    if (imageLoaded >= Object.keys(this.exporter.resources).length) {
                        createPackage()
                    }
                }
                xhr.send();
            }
        }
    }

    createSpec() {
        let sprites = this.exporter.combined();
        let spritesOutput = [];
        for (var aKey in sprites) {
            if (sprites.hasOwnProperty(aKey)) {
                var element = sprites[aKey];
                spritesOutput.push({
                    imageKey: element[0].imageKey,
                    frames: element.map(function(item) {
                        return {
                            alpha: item.alpha,
                            layout: item.layout,
                            transform: item.transform,
                        };
                    }),
                });
            }
        }
        let spec = {
            ver: "1.1.0",
            movie: {
                viewBox: {
                    width: this.exporter.movie.viewBox.width,
                    height: this.exporter.movie.viewBox.height,
                },
                fps: this.exporter.movie.fps,
                frames: this.exporter.movie.frameCount,
            },
            images: this.exporter.resources,
            sprites: spritesOutput,
        }
        return spec;
    }

}