import SVGAPathHelper from './SVGAPathHelper'

module.exports = class SVGAMaskHelper {

    layer = null;

    constructor(layer) {
        this.layer = layer;
    }

    requestMaskPath() {
        let hasMask = false;
        let d = "";
        if (this.layer.mask != null && this.layer.mask != undefined) {
            d += (new SVGAPathHelper(this.layer.mask.graphics)).requestPath({ x: 0.0, y: 0.0 });
            hasMask = true;
        }
        let offsetX = this.layer.x - this.layer.regX;
        let offsetY = this.layer.y - this.layer.regY;
        let scaleX = this.layer.scaleX;
        let scaleY = this.layer.scaleY;
        let regX = this.layer.regX;
        let regY = this.layer.regY;
        let rotation = this.layer.rotation;
        let parents = []
        let currentLayer = this.layer.parent;
        while (currentLayer != null && currentLayer != undefined) {
            parents.push(currentLayer);
            currentLayer = currentLayer.parent;
        }
        for (let index = 0; index < parents.length; index++) {
            let element = parents[index];
            offsetX += element.x - element.regX;
            offsetY += element.y - element.regY;
            scaleX *= element.scaleX;
            scaleY *= element.scaleY;
            regX += element.regX;
            regY += element.regY;
            rotation += element.rotation;
            if (element.mask != null && element.mask != undefined) {
                d += (new SVGAPathHelper(element.mask.graphics)).requestPath({ x: -(offsetX - element.mask.x), y: -(offsetY - element.mask.y) }, { x: 1.0 / scaleX, y: 1.0 / scaleY }, { x: regX, y: regY }, -(rotation - element.mask.rotation));
                hasMask = true;
                break;
            }
        }
        if (hasMask) {
            return d;
        }
        else {
            return undefined;
        }
    }

}