var doc = fl.getDocumentDOM();
var lib = doc.library;

function CherkForPureColorVectorgraphWithTimeline(timeline) {
	try {
		timeline.layers.length;
	} catch (e) {
		return;
	}

	for (var i in timeline.layers) {
		var curLayer = timeline.layers[i];

		fl.trace("LayerName --- " + curLayer.name + " curLayer.visible --- " + curLayer.visible);
		if (!curLayer.visible) continue;
		if (!curLayer.frames) continue;
		if (curLayer.layerType == "mask") continue;
		curLayer.locked = false;
		var keyFrameArray = [];
		var index = 0;
		while (index < curLayer.frames.length) {
			curFrame = curLayer.frames[index]
			keyFrameArray.push(curFrame);
			index += curFrame.duration;
		}

		for (var keyIndex in keyFrameArray) {
			var keyFrame = keyFrameArray[keyIndex];

			timeline.currentFrame = keyFrame.startFrame;
			if (keyFrame.tweenType == "shape") {
				fl.trace("Shape Tween");
			} else {
				if (keyFrame.elements) {
					for (var k in keyFrame.elements) {
						var curElement = keyFrame.elements[k];
						curElement.locked = false;
						if (curElement.elementType == "shape") {
							doc.selectNone();
							doc.selection = [curElement];

							var flag = doc.convertSelectionToBitmap();
							fl.trace("element is shape --- convert：" + flag);
						} else if (curElement.elementType == "instance") {
							if (curElement.instanceType == "symbol") {
								var curItem = curElement.libraryItem;

								if (!(curItem.name.indexOf('\u200B\u200B\u200B') > 0)) {
									curItem.name = curItem.name + '\u200B\u200B\u200B';

									var convertAll = true;
									for (var layerIndex in curItem.timeline.layers) {
										curItem.timeline.layers[layerIndex].locked = false;
										if (curItem.timeline.layers[layerIndex].frames.length != 1) {
											convertAll = false;
											break;
										}
									}

									fl.trace("begin " + curItem.name + " timeline");
									lib.editItem(curItem.name);
									if (convertAll) {
										if (curItem.timeline.layers.length == 1) {
											convertAll = false;
											var curFrame = curItem.timeline.layers[0].frames[0];
											for (var eleIndex in curFrame.elements) {
												var subElement = curFrame.elements[eleIndex];
												if (subElement.elementType != "instance") {
													convertAll = true;
													break;
												} else {
													if (subElement.instanceType != "bitmap") {
														convertAll = true;
														break;
													}
												}
											}
										}
										if (convertAll) {
											doc.selectAll();
											var flag = doc.convertSelectionToBitmap();
											fl.trace("layer is shape --- convert：" + flag);
										}
									} else {
										CherkForPureColorVectorgraphWithTimeline(curItem.timeline);
									}
									doc.exitEditMode();
								}
							}
						}
					}
				}
			}
		}
	}
	fl.trace("end timeline");
}

function CherkForPureColorVectorgraph() {

	fl.trace("begin main timeline");
	CherkForPureColorVectorgraphWithTimeline(doc.getTimeline());
}