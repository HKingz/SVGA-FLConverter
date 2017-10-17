var doc = fl.getDocumentDOM();
var lib = doc.library;

function CherkForPureColorVectorgraphWithTimeline(timeline) {

    try {fl.trace(timeline.layers.length);}catch (e){return;}

    for (var i in timeline.layers) {
        var curLayer = timeline.layers[i];

        if (!curLayer.frames) continue;
        for (var j in curLayer.frames) {

            timeline.currentFrame = j;
            var curFrame = curLayer.frames[j];

            if (!curFrame.elements) continue;
            for (var k in curFrame.elements) {
                var curElement = curFrame.elements[k];
                curElement.locked = false;
                doc.selection = [curElement];

                if (curElement.elementType == 'shape') {
                    var fillStyle = doc.getCustomFill("selection").style;
                    if (fillStyle == 'linearGradient' || fillStyle == 'radialGradient') {

                        doc.selectNone();
                        doc.selection = [curElement];

                        var flag = doc.convertSelectionToBitmap();
                        fl.trace(flag + "----" + fillStyle + "get...");
                    }
                }
            }
        }
    }
}

function CherkForPureColorVectorgraph() {

    var itemArray = lib.items.concat();
    for (var l in itemArray){
        var curItem = itemArray[l];

        if (curItem.symbolType != undefined){

            lib.editItem(curItem.name);
            CherkForPureColorVectorgraphWithTimeline(curItem.timeline);
            doc.exitEditMode();
        }
    }

    fl.trace("main timeline");
    CherkForPureColorVectorgraphWithTimeline(doc.getTimeline());
}
