module.exports = class SVGALayerFrameEntity {

    layerOrder = 0;

    imageKey = undefined;

    alpha = 0.0;

    transform = {
        a: 1.0,
        b: 0.0,
        c: 0.0,
        d: 1.0,
        tx: 0.0,
        ty: 0.0,
    };

    layout = {
        x: 0.0,
        y: 0.0,
        width: 0.0,
        height: 0.0,
    };

    clipPath = undefined;

    shapes = [];

}