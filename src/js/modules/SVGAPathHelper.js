module.exports = class SVGAPathHelper {

    graphics = null;

    constructor(graphics) {
        this.graphics = graphics;
    }

    requestPoint = (value = 0.0, offset = 0.0, scale = 1.0, reg = 0.0) => {
        return (((value + offset) - reg) * scale + reg).toFixed(6)
    }

    requestPath = (offset = {x: 0.0, y: 0.0}, scale = {x: 1.0, y: 1.0}, reg = {x: 0.0, y: 0.0}) => {
        let instructions = this.graphics.getInstructions();
        let d = "";
        for (let index = 0; index < instructions.length; index++) {
            let element = instructions[index];
            if (element instanceof createjs.Graphics.BeginPath) {}
            else if (element instanceof createjs.Graphics.MoveTo) {
                d += "M " + this.requestPoint(element.x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.y, offset.y, scale.y, reg.y) + " ";
            }
            else if (element instanceof createjs.Graphics.LineTo) {
                d += "L " + this.requestPoint(element.x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.y, offset.y, scale.y, reg.y) + " ";
            }
            else if (element instanceof createjs.Graphics.BezierCurveTo) {
                d += "C " + this.requestPoint(element.cp1x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.cp1y, offset.y, scale.y, reg.y) + " " + this.requestPoint(element.cp2x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.cp2y, offset.y, scale.y, reg.y) + " " + this.requestPoint(element.x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.y, offset.y, scale.y, reg.y) + " ";
            }
            else if (element instanceof createjs.Graphics.QuadraticCurveTo) {
                d += "Q " + this.requestPoint(element.cpx, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.cpy, offset.y, scale.y, reg.y) + " " + this.requestPoint(element.x, offset.x, scale.x, reg.x) + " " + this.requestPoint(element.y, offset.y, scale.y, reg.y) + " ";
            }
            else if (element instanceof createjs.Graphics.ClosePath) {
                d += "Z ";
            }
        }
        return d;
    }

}