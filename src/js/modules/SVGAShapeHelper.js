module.exports = class SVGAShapeHelper {

    graphics = null;

    constructor(graphics) {
        this.graphics = graphics;
    }

    requestStyle = () => {
        let styles = {};
        if (this.graphics._fill) {
            styles.fill = this.requestColorArray(this.graphics._fill.style);
        }
        if (this.graphics._stroke) {
            styles.stroke = this.requestColorArray(this.graphics._stroke.style);
            if (this.graphics._strokeStyle) {
                styles.strokeWidth = this.graphics._strokeStyle.width;
                if (this.graphics._strokeStyle.caps === 0) {
                    styles.lineCap = "butt";
                }
                else if (this.graphics._strokeStyle.caps === 1) {
                    styles.lineCap = "round";
                }
                else if (this.graphics._strokeStyle.caps === 2) {
                    styles.lineCap = "square";
                }
                if (this.graphics._strokeStyle.joints === 0) {
                    styles.lineJoin = "miter";
                }
                else if (this.graphics._strokeStyle.joints === 1) {
                    styles.lineJoin = "round";
                }
                else if (this.graphics._strokeStyle.joints === 2) {
                    styles.lineJoin = "bevel";
                }
                styles.miterLimit = this.graphics._strokeStyle.miterLimit;
            }
        }
        return styles;
    }

    requestColorArray = (stringValue) => {
        if (!(stringValue instanceof String)) {
            return [0.0, 0.0, 0.0, 1.0];
        }
        let sValue = stringValue.replace('#', '');
        if (sValue.length == 6) {
            let rStr = sValue.substr(0, 2)
            let gStr = sValue.substr(2, 2)
            let bStr = sValue.substr(4, 2)
            return [parseInt("0x" + rStr) / 255.0, parseInt("0x" + gStr) / 255.0, parseInt("0x" + bStr) / 255.0, 1.0];
        }
        return [0.0, 0.0, 0.0, 1.0];
    }

}