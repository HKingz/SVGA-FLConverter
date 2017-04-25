import SVGAMovieEntity from './SVGAMovieEntity'
import SVGALayerFrameEntity from './SVGALayerFrameEntity'
import Matrix from './transformation-matrix'
import SVGAPathHelper from './SVGAPathHelper'
import SVGAShapeHelper from './SVGAShapeHelper'
import SVGAMaskHelper from './SVGAMaskHelper'

module.exports = class SVGATimeline {

    _movie = null;
    _frames = [];
    _resources = {};

    constructor() {
        this._movie = new SVGAMovieEntity();
    }

    readFrame = (idx) => {
        this._orderCurrent = 0;
        let layerFrames = this.findLayerFrames(stage);
        this._frames.push(layerFrames);
    };

    resetOrders = () => {
        let orderedKeys = [];
        let keys = this._frames.map((spriteLayers) => {
            return spriteLayers.map((spriteLayer) => {
                return spriteLayer.imageKey;
            });
        });
        for (let index = 0; index < keys.length; index++) {
            orderedKeys = this.combineString(orderedKeys, keys[index]);
        }
        for (let frameIdx = 0; frameIdx < this._frames.length; frameIdx++) {
            let spriteLayers = this._frames[frameIdx];
            let cIndexes = orderedKeys.map((item) => {
                return {
                    aKey: item,
                    used: false,
                }
            });
            for (let layerIdx = 0; layerIdx < spriteLayers.length; layerIdx++) {
                let spriteLayer = spriteLayers[layerIdx];
                for (var index = 0; index < cIndexes.length; index++) {
                    var element = cIndexes[index];
                    if (element.used === false && element.aKey === spriteLayer.imageKey) {
                        element.used = true;
                        spriteLayer.layerOrder = index;
                        for (let mIndex = 0; mIndex < index; mIndex++) {
                            cIndexes[mIndex].used = true;
                        }
                        break;
                    }
                }
            }
        }
    }

    combineString(arr1, arr2) {
        if (arr1.length == 0) {
            return arr2;
        }
        else if (arr2.length == 0) {
            return arr1;
        }
        var matchRanges = [];
        function findRanges() {
            for (var index2 = 0; index2 < arr2.length; index2++) {
                var range = {
                    location: index2,
                    length: 0,
                    aLocation: -1,
                    aLength: 0,
                };
                var used = {};
                for (var index2_2 = index2; index2_2 < arr2.length; index2_2++) {
                    var element2_2 = arr2[index2_2];
                    var found = false;
                    for (var index1 = 0; index1 < arr1.length; index1++) {
                        var element1 = arr1[index1];
                        if (element1 === element2_2 && used[index1] !== true) {
                            for (var i = 0; i <= index1; i++) {
                                used[i] = true;
                            }
                            found = true;
                            range.length = index2_2 - index2 + 1;
                            if (range.aLocation < 0) {
                                range.aLocation = index1;
                            }
                            range.aLength = index1 - range.aLocation + 1;
                            break;
                        }
                    }
                    if (!found) {
                        break;
                    }
                }
                if (range.length > 0) {
                    matchRanges.push(range);
                }
            }
        }
        function trimRanges() {
            var found = false;
            for (var aIndex = 0; aIndex < matchRanges.length; aIndex++) {
                var a = matchRanges[aIndex];
                for (var bIndex = 0; bIndex < matchRanges.length; bIndex++) {
                    var b = matchRanges[bIndex];
                    if (aIndex === bIndex) {
                        continue;
                    }
                    if (a.location <= b.location && a.location + a.length >= b.location + b.length) {
                        matchRanges.splice(bIndex, 1);
                        found = true;
                        break;
                    }
                    else if (b.location <= a.location && b.location + b.length >= a.location + a.length) {
                        matchRanges.splice(aIndex, 1);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
            return found;
        }
        function createArray() {
            var newArray = [];
            if (matchRanges.length == 0) {
                for (var index = 0; index < arr1.length; index++) {
                    newArray.push(arr1[index]);
                }
                for (var index = 0; index < arr2.length; index++) {
                    newArray.push(arr2[index]);
                }
                return newArray;
            }
            matchRanges.sort((a, b) => { return a.location > b.location ? 1 : -1 });
            var aLeft = 0;
            var bLeft = 0;
            for (var matchIndex = 0; matchIndex < matchRanges.length; matchIndex++) {
                var matchRange = matchRanges[matchIndex];
                var aLeftValues = arr1.slice(aLeft, matchRange.aLocation);
                var bLeftValues = arr2.slice(bLeft, matchRange.location);
                var aMidValues = arr1.slice(matchRange.aLocation, matchRange.aLocation + matchRange.aLength);
                for (var index = 0; index < aLeftValues.length; index++) {
                    newArray.push(aLeftValues[index]);
                }
                for (var index = 0; index < bLeftValues.length; index++) {
                    newArray.push(bLeftValues[index]);
                }
                for (var index = 0; index < aMidValues.length; index++) {
                    newArray.push(aMidValues[index]);
                }
                if (matchIndex == matchRanges.length - 1) {
                    var aRightValues = arr1.slice(matchRange.aLocation + matchRange.aLength, arr1.length);
                    var bRightValues = arr2.slice(matchRange.location + matchRange.length, arr2.length);
                    for (var index = 0; index < aRightValues.length; index++) {
                        newArray.push(aRightValues[index]);
                    }
                    for (var index = 0; index < bRightValues.length; index++) {
                        newArray.push(bRightValues[index]);
                    }
                }
                else {
                    aLeft = matchRange.aLocation + matchRange.aLength;
                    bLeft = matchRange.location + matchRange.length;
                }
            }
            return newArray;
        }
        findRanges();
        while (trimRanges());
        return createArray();
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
        let layerFrame = new SVGALayerFrameEntity();
        if (layer.image instanceof Node) {
            let imageKey = layer.image.src.toString().split('/').pop().replace('.png', '').split('?')[0];
            if (imageKey.match(/[^a-zA-Z0-9\.\-\_]/) !== null) {
                imageKey = md5(imageKey);
            }
            let image = {
                imageKey: imageKey,
                dataPath: layer.image.src.toString(),
            }
            layerFrame.imageKey = image.imageKey;
            if (this._resources[image.imageKey] === undefined) {
                this._resources[image.imageKey] = image;
            }
            layerFrame.layout.x = layer.getBounds().x;
            layerFrame.layout.y = layer.getBounds().y;
            layerFrame.layout.width = layer.getBounds().width;
            layerFrame.layout.height = layer.getBounds().height;
        }
        else if (layer.graphics !== undefined && layer.graphics !== null) {
            layerFrame.imageKey = layer.id + ".vector";
            let shape = {
                type: "shape",
                args: {
                    d: (new SVGAPathHelper(layer.graphics)).requestPath(),
                },
                styles: (new SVGAShapeHelper(layer.graphics)).requestStyle(),
            }
            layerFrame.shapes.push(shape);
        }

        if (true) {
            layerFrame.alpha = layer.alpha;
            let currentParent = layer.parent;
            while (currentParent != null && currentParent != undefined) {
                layerFrame.alpha = layerFrame.alpha * currentParent.alpha;
                currentParent = currentParent.parent;
            }
        }
        if (true) {
            let matrix = new createjs.Matrix2D();
            matrix = matrix.appendMatrix(new createjs.Matrix2D(layer._props.matrix.a, layer._props.matrix.b, layer._props.matrix.c, layer._props.matrix.d, layer._props.matrix.tx, layer._props.matrix.ty))
            let currentParent = layer.parent;
            while (currentParent != null && currentParent != undefined) {
                matrix = new createjs.Matrix2D(currentParent._props.matrix.a, currentParent._props.matrix.b, currentParent._props.matrix.c, currentParent._props.matrix.d, currentParent._props.matrix.tx, currentParent._props.matrix.ty).appendMatrix(matrix)
                currentParent = currentParent.parent;
            }
            layerFrame.transform.a = matrix.a;
            layerFrame.transform.b = matrix.b;
            layerFrame.transform.c = matrix.c;
            layerFrame.transform.d = matrix.d;
            layerFrame.transform.tx = matrix.tx;
            layerFrame.transform.ty = matrix.ty;
        }
        layerFrame.clipPath = (new SVGAMaskHelper(layer)).requestMaskPath();
        return layerFrame;
    }

    combined = () => {
        let sprites = {};
        for (let frameIdx = 0; frameIdx < this._frames.length; frameIdx++) {
            let frameSprites = this._frames[frameIdx];
            for (let layerIdx = 0; layerIdx < frameSprites.length; layerIdx++) {
                let frameSprite = frameSprites[layerIdx];
                if (sprites[frameSprite.layerOrder] === undefined) {
                    sprites[frameSprite.layerOrder] = [];
                    for (let index = 0; index < frameIdx; index++) {
                        sprites[frameSprite.layerOrder].push({});
                    }
                }
                sprites[frameSprite.layerOrder].push(frameSprite);
                if (frameSprite.imageKey) {
                    sprites[frameSprite.layerOrder].imageKey = frameSprite.imageKey;
                }
            }
            for (let key in sprites) {
                if (sprites.hasOwnProperty(key)) {
                    let element = sprites[key];
                    if (element[frameIdx] === undefined) {
                        sprites[key].push({});
                    }
                }
            }
        }
        trim = (sprites) => {
            let hasTrimmed = false;
            let targetA = null;
            let targetB = null;
            for (let aKey in sprites) {
                if (sprites.hasOwnProperty(aKey)) {
                    let element = sprites[aKey];
                    if (hasTrimmed) {
                        break;
                    }
                    if (targetA === null) {
                        targetA = element;
                    }
                    else {
                        if (targetA.imageKey === element.imageKey || 
                            (targetA.imageKey && targetA.imageKey.indexOf(".vector") > 0 && element.imageKey && element.imageKey.indexOf(".vector") > 0)) {
                            targetB = element;
                            for (let index = 0; index < this._movie.frameCount; index++) {
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
                            for (let index = 0; index < this._movie.frameCount; index++) {
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
        while (trim(sprites)) { }
        return sprites;
    }

}