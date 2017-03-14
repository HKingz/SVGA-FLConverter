
import Movie from './movie'
import LayerFrame from './layerFrame'
import Matrix from './transformation-matrix'

module.exports = class Exporter {

    movie = null;
    frames = [];
    resources = {};

    constructor() {
        this.movie = new Movie();
    }

    readFrame = (idx) => {
        this._orderCurrent = 0;
        this.resetOrders(stage);
        let layerFrames = this.findLayerFrames(stage);
        this.frames.push(layerFrames);
    };
    
    _orderUsed = {};
    _orderCurrent = 0;

    resetOrders = (layer) => {
        if (layer.children instanceof Array) {
            for (let index = 0; index < layer.children.length; index++) {
                this.resetOrders(layer.children[index]);
            }
        }
        else {
            if (this._order == null || this._order == undefined) {
                if (this._orderUsed[this._orderCurrent] === true) {
                    this._orderCurrent++;
                }
                layer._order = this._orderCurrent;
                this._orderUsed[this._orderCurrent] = true;
                this._orderCurrent += 1000;
            }
        }
    }

    findLayerFrames = (layer) => {
        let layers = [];
        if (layer.children instanceof Array) {
            for (let index = 0; index < layer.children.length; index++) {
                let elementLayers = this.findLayerFrames(layer.children[index]);
                for (let index = 0; index < elementLayers.length; index++) {
                    layers.push(elementLayers[index]);
                }
            }
        }
        else {
            layers.push(this.parseLayerFrame(layer));
        }
        return layers;
    }

    parseLayerFrame = (layer) => {
        let layerFrame = new LayerFrame();
        layerFrame.layerOrder = layer._order;
        if (layer.image instanceof Node) {
            layerFrame.imageKey = layer.image.src.toString().split('/').pop().replace('.png', '')
            if (this.resources[layerFrame.imageKey] === undefined) {
                this.resources[layerFrame.imageKey] = layer.image.src.toString().split('/').pop();
            }
        }
        layerFrame.alpha = layer.alpha;
        layerFrame.layout.x = layer.getBounds().x;
        layerFrame.layout.y = layer.getBounds().y;
        layerFrame.layout.width = layer.getBounds().width;
        layerFrame.layout.height = layer.getBounds().height;
        let matrix = new Matrix();
        matrix.translate(-layer.regX, -layer.regY).scale(layer.scaleX, layer.scaleY).rotate(-layer.rotation * Math.PI / 180);
        matrix.translate(layer.x, layer.y);
        let currentParnet = layer.parent;
        while (currentParnet != null && currentParnet != undefined) {
            matrix.translate(-currentParnet.regX, -currentParnet.regY).scale(currentParnet.scaleX, currentParnet.scaleY).rotate(-currentParnet.rotation * Math.PI / 180);
            matrix.translate(currentParnet.x, currentParnet.y);
            currentParnet = currentParnet.parent;
        }
        layerFrame.transform.a = matrix.props[0];
        layerFrame.transform.b = matrix.props[1];
        layerFrame.transform.c = matrix.props[4];
        layerFrame.transform.d = matrix.props[5];
        layerFrame.transform.tx = matrix.props[12];
        layerFrame.transform.ty = matrix.props[13];
        return layerFrame;
    }

    combined = () => {
        let sprites = {};
        for (let frameIdx = 0; frameIdx < this.frames.length; frameIdx++) {
            let frameSprites = this.frames[frameIdx];
            for (let layerIdx = 0; layerIdx < frameSprites.length; layerIdx++) {
                let frameSprite = frameSprites[layerIdx];
                if (sprites[frameSprite.layerOrder] === undefined) {
                    sprites[frameSprite.layerOrder] = [];
                    for (let index = 0; index < frameIdx; index++) {
                        sprites[frameSprite.layerOrder].push({});
                    }
                }
                if (frameSprite.alpha <= 0.0) {
                    sprites[frameSprite.layerOrder].push({});
                }
                else {
                    sprites[frameSprite.layerOrder].push(frameSprite);
                }
            }
            for (var spriteKey in sprites) {
                if (sprites.hasOwnProperty(spriteKey)) {
                    var element = sprites[spriteKey];
                    if (element.length - 1 < frameIdx) {
                        element.push({});
                    }
                }
            }
        }
        trim = (sprites) => {
            let hasTrimmed = false;
            let targetA = null;
            let targetB = null;
            for (var aKey in sprites) {
                if (sprites.hasOwnProperty(aKey)) {
                    var element = sprites[aKey];
                    if (hasTrimmed) {
                        return;
                    }
                    if (targetA === null) {
                        targetA = element;
                    }
                    else {
                        if (targetA.imageKey === element.imageKey) {
                            targetB = element;
                            for (let index = 0; index < this.movie.frameCount; index++) {
                                if (Object.keys(targetA[index]).length > 0 && Object.keys(targetB[index]).length > 0) {
                                    targetA = targetB;
                                    targetB = null;
                                    break;
                                }
                            }
                            // combine now
                            if (targetA == null || targetB == null) {
                                continue;
                            }
                            for (let index = 0; index < this.movie.frameCount; index++) {
                                if (Object.keys(targetB[index]).length > 0) {
                                    targetA[index] = targetB[index];
                                }
                            }
                            delete sprites[aKey];
                            hasTrimmed = true;
                            break;
                        }
                        else {
                            targetA = element;
                            targetB = null;
                        }
                    }
                }
            }
            return hasTrimmed
        }
        while(trim(sprites)) {}
        return sprites;
    }

}