import Component from "./Component";
import YAxis from "./YAxis";
import XAxis from "./XAxis";
import {select,
    symbol,
    symbolCircle,
    symbolCross,
    symbolDiamond,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    symbolWye
} from "d3";

class CanvasPointset extends Component {

    private x: XAxis;
    private y: YAxis;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public update(data: [any]): void {
        let canvas = select(this.config.get('selector')).append('canvas')
            .attr('id', 'point-set-canvas')
            .attr('width', this.config.get('width'))
            .attr('height', this.config.get('height'))
            .style('position', 'absolute')
            .style('z-index', 2)
            .style('transform', `translate(${this.config.get('marginLeft')}px, ${this.config.get('marginTop')}px)`);

        let markerShape = this.config.get('markerShape'),
            markerSize = this.config.get('markerSize'),
            colorScale = this.config.get('colorScale'),
            points = null,
            series = null,
            dataContainer = null;

        let canvasCtx = canvas.node().getContext('2d');

        let shape = symbol()
            .size(markerSize)
            .context(canvasCtx);

        switch (markerShape) {
            case 'dot':
                shape.type(symbolCircle);
                break;
            case 'ring':
                shape.type(symbolCircle);
                break;
            case 'cross':
                shape.type(symbolCross);
                break;
            case 'diamond':
                shape.type(symbolDiamond);
                break;
            case 'square':
                shape.type(symbolSquare);
                break;
            case 'star':
                shape.type(symbolStar);
                break;
            case 'triangle':
                shape.type(symbolTriangle);
                break;
            case 'wye':
                shape.type(symbolWye);
                break;
            case 'circle':
                shape.type(symbolCircle);
                break;
            default:
                shape.type(symbolCircle);
        }

        // Custom DOM element, this won't be rendered
        dataContainer = this.svg.append('proteic');
        series = dataContainer.selectAll('proteic.g.points');

        series
            .data(data, (d) => d.key)
            .enter()
            .call((s) => {
                let self = this;
                console.log(s);
                s.each(function (d) {
                    canvasCtx.save();
                    canvasCtx.translate(self.x.xAxis.scale()(d.x), self.y.yAxis.scale()(d.y));
                    canvasCtx.beginPath();
                    canvasCtx.strokeStyle = colorScale(d.key);
                    canvasCtx.fillStyle = colorScale(d.key);
                    shape();
                    canvasCtx.closePath();
                    canvasCtx.stroke();
                    if (markerShape !== 'ring') {
                        canvasCtx.fill();
                    }
                    canvasCtx.restore();
                });
            });
    }

    public render(): void {
    }
}

export default CanvasPointset;
