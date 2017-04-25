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
            d += (new SVGAPathHelper(this.layer.mask.graphics)).requestPath({x: 0.0, y: 0.0});
            hasMask = true;
        }
        let offsetX = this.layer.x - this.layer.regX;
        let offsetY = this.layer.y - this.layer.regY;
        let parents = []
        let currentLayer = this.layer.parent;
        while (currentLayer != null && currentLayer != undefined) {
            parents.push(currentLayer);
            currentLayer = currentLayer.parent;
        }
        for (let index = parents.length - 1; index >= 0; index--) {
            let element = parents[index];
            offsetX += element.x - element.regX;
            offsetY += element.y - element.regY;
            if (element.mask != null && element.mask != undefined) {
                console.log(element.mask)
                d += (new SVGAPathHelper(element.mask.graphics)).requestPath({x: -(offsetX - element.mask.x), y: -(offsetY - element.mask.y)});
                hasMask = true;
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