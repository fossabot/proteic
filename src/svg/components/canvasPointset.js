import {select, nest} from 'd3';
import {symbol, symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye} from 'd3';

export class CanvasPointset {
  constructor(x, y, config) {
    this.xAxis = x.xAxis;
    this.yAxis = y.yAxis;
    this.canvas = select(config.selector).append('canvas')
      .attr('id', 'point-set-canvas')
      .attr('width', config.width)
      .attr('height', config.height)
      .style('position', 'absolute')
      .style('z-index', 2)
      .style('transform', `translate(${config.marginLeft}px, ${config.marginTop}px)`);
  }

  update(svg, config, data) {
    let markerShape = config.markerShape,
      markerSize = config.markerSize,
      colorScale = config.colorScale,
      points = null,
      series = null,
      dataContainer = null;

    let canvasCtx = this.canvas.node().getContext('2d');

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
    dataContainer = svg.append('proteic');
    series = dataContainer.selectAll('proteic.g.points');

    series
      .data(data, (d) => d.key)
      .enter()
      .call((s) => {
        let self = this;
        s.each(function (d) {
          canvasCtx.save();
          canvasCtx.translate(self.xAxis.scale()(d.x), self.yAxis.scale()(d.y));
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

  render(svg, config) {
    //Do nothing, since points render only when new data is received.
  }
}