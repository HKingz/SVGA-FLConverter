module.exports = class SVGAPathHelper {

    graphics = null;

    constructor(graphics) {
        this.graphics = graphics;
    }

    requestPoint = (value = { x: 0.0, y: 0.0 }, offset = { x: 0.0, y: 0.0 }, scale = { x: 1.0, y: 1.0 }, reg = { x: 0.0, y: 0.0 }, rotation = 0) => {
        const aPoint = {
            x: (((value.x + offset.x) - reg.x) * scale.x + reg.x).toFixed(6),
            y: (((value.y + offset.y) - reg.y) * scale.y + reg.y).toFixed(6)
        }
        const bPoint = {
            x: aPoint.x - reg.x,
            y: aPoint.y - reg.y,
        }
        const cPoint = {
            x: bPoint.x * Math.cos(rotation * Math.PI / 180) - bPoint.y * Math.sin(rotation * Math.PI / 180),
            y: bPoint.y * Math.cos(rotation * Math.PI / 180) + bPoint.x * Math.sin(rotation * Math.PI / 180),
        }
        return {
            x: cPoint.x + reg.x,
            y: cPoint.y + reg.y,
        }
    }

    requestPath = (offset = { x: 0.0, y: 0.0 }, scale = { x: 1.0, y: 1.0 }, reg = { x: 0.0, y: 0.0 }, rotation = 0) => {
        let instructions = this.graphics.getInstructions();
        let d = "";
        for (let index = 0; index < instructions.length; index++) {
            let element = instructions[index];
            if (element instanceof createjs.Graphics.BeginPath) { }
            else if (element instanceof createjs.Graphics.MoveTo) {
                d += "M " + this.requestPoint(element, offset, scale, reg, rotation).x + " " + this.requestPoint(element, offset, scale, reg, rotation).y + " ";
            }
            else if (element instanceof createjs.Graphics.LineTo) {
                d += "L " + this.requestPoint(element, offset, scale, reg, rotation).x + " " + this.requestPoint(element, offset, scale, reg, rotation).y + " ";
            }
            else if (element instanceof createjs.Graphics.BezierCurveTo) {
                d += "C " + this.requestPoint({ x: element.cp1x, y: element.cp1y }, offset, scale, reg, rotation).x + " " + this.requestPoint({ x: element.cp1x, y: element.cp1y }, offset, scale, reg, rotation).y + " " + this.requestPoint({ x: element.cp2x, y: element.cp2y }, offset, scale, reg, rotation).x + " " + this.requestPoint({ x: element.cp2x, y: element.cp2y }, offset, scale, reg, rotation).y + " " + this.requestPoint(element, offset, scale, reg, rotation).x + " " + this.requestPoint(element, offset, scale, reg, rotation).y + " ";
            }
            else if (element instanceof createjs.Graphics.QuadraticCurveTo) {
                d += "Q " + this.requestPoint({ x: element.cpx, y: element.cpy }, offset, scale, reg, rotation).x + " " + this.requestPoint({ x: element.cpx, y: element.cpy }, offset, scale, reg, rotation).y + " " + this.requestPoint(element, offset, scale, reg, rotation).x + " " + this.requestPoint(element, offset, scale, reg, rotation).y + " ";
            }
            else if (element instanceof createjs.Graphics.ClosePath) {
                d += "Z ";
            }
        }
        return d;
    }

}