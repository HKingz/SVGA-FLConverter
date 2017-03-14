module.exports = class SVGAPathHelper {

    graphics = null;

    constructor(graphics) {
        this.graphics = graphics;
    }

    requestPath = (offset = {x: 0.0, y: 0.0}) => {
        let instructions = this.graphics.getInstructions();
        let d = "";
        for (let index = 0; index < instructions.length; index++) {
            let element = instructions[index];
            if (element instanceof createjs.Graphics.BeginPath) {}
            else if (element instanceof createjs.Graphics.MoveTo) {
                d += "M " + (element.x + offset.x).toFixed(3) + " " + (element.y + offset.y).toFixed(3) + " ";
            }
            else if (element instanceof createjs.Graphics.LineTo) {
                d += "L " + (element.x + offset.x).toFixed(3) + " " + (element.y + offset.y).toFixed(3) + " ";
            }
            else if (element instanceof createjs.Graphics.BezierCurveTo) {
                d += "C " + (element.cp1x + offset.x).toFixed(3) + " " + (element.cp1y + offset.y).toFixed(3) + " " + (element.cp2x + offset.x).toFixed(3) + " " + (element.cp2y + offset.y).toFixed(3) + " " + (element.x + offset.x).toFixed(3) + " " + (element.y + offset.y).toFixed(3) + " ";
            }
            else if (element instanceof createjs.Graphics.QuadraticCurveTo) {
                d += "Q " + (element.cpx + offset.x).toFixed(3) + " " + (element.cpy + offset.y).toFixed(3) + " " + (element.x + offset.x).toFixed(3) + " " + (element.y + offset.y).toFixed(3) + " ";
            }
            else if (element instanceof createjs.Graphics.ClosePath) {
                d += "Z ";
            }
        }
        return d;
    }

}