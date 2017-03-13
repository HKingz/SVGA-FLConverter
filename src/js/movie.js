
module.exports = class Movie {

    viewBox = {
        width: 0.0,
        height: 0.0,
    }

    fps = 20;

    frameCount = 0;

    constructor() {
        this.viewBox.width = lib.properties.width;
        this.viewBox.height = lib.properties.height;
        this.fps = lib.properties.fps;
        this.frameCount = exportRoot.totalFrames;
    }

}