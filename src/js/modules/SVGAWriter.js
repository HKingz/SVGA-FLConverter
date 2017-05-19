import SVGAResourceHelper from './SVGAResourceHelper'

module.exports = class SVGAWriter {

    timeline = null;
    resources = {};

    constructor(timeline) {
        this.timeline = timeline;
    }

    createZIPPackage(callback) {
        let zip = new JSZip();
        let resourceHelper = new SVGAResourceHelper(this.timeline._resources);
        resourceHelper.copyToZIP(zip, (result) => {
            this.resources = result;
            zip.file("movie.spec", JSON.stringify(this.createSpec()));
            zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then((blob) => {
                callback(blob);
                document.querySelector('.downloadButton').onclick = () => {
                    if (window.cep !== undefined) {}
                    else if (navigator.userAgent.indexOf("Chrome") < 0) {
                        alert("请复制 URL， 然后使用 Chrome 浏览器打开此页面");
                    }
                    else {
                        saveAs(blob, document.title + "_" + (new Date()).toLocaleDateString() + ".svga");
                    }
                }
            }, (err) => {
                console.log(err);
            });
        });
    }

    createSpec() {
        let sprites = this.timeline.combined();
        let spritesOutput = [];
        for (let aKey in sprites) {
            if (sprites.hasOwnProperty(aKey)) {
                let element = sprites[aKey];
                let imageKey = () => {
                    for (let index = 0; index < element.length; index++) {
                        let itemElement = element[index];
                        if (itemElement.imageKey !== undefined) {
                            return itemElement.imageKey;
                        }
                    }
                }
                let r = {
                    imageKey: imageKey(),
                    frames: element.map(function (item) {
                        return {
                            alpha: item.alpha,
                            layout: item.layout,
                            transform: item.transform,
                            clipPath: item.clipPath,
                            shapes: item.shapes,
                        };
                    }),
                };
                let previousShape = "";
                for (let index = 0; index < r.frames.length; index++) {
                    let element = r.frames[index];
                    if (element.alpha <= 0.0) {
                        r.frames[index] = {};
                    }
                    else {
                        if (element.transform && element.transform.a == 1.0 && element.transform.b == 0.0 && element.transform.c == 0.0 && element.transform.d == 1.0 && element.transform.tx == 0.0 && element.transform.ty == 0.0) {
                            delete r.frames[index].transform
                        }
                        if (element.clipPath && element.clipPath.length == 0) {
                            delete r.frames[index].clipPath
                        }
                        if (element.shapes && element.shapes.length > 0) {
                            if (JSON.stringify(element.shapes) === previousShape) {
                                r.frames[index].shapes = [
                                    {
                                        type: "keep",
                                    }
                                ];
                            }
                            else {
                                previousShape = JSON.stringify(element.shapes);
                            }
                        }
                    }
                }
                spritesOutput.push(r);
            }
        }
        let spec = {
            ver: "1.1.0",
            movie: {
                viewBox: {
                    width: this.timeline._movie.viewBox.width,
                    height: this.timeline._movie.viewBox.height,
                },
                fps: this.timeline._movie.fps,
                frames: this.timeline._movie.frameCount,
            },
            images: this.resources,
            sprites: spritesOutput,
        }
        return spec;
    }

}