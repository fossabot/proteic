import Component from './Component';
import Config from '../../Config';
import XAxis from './XAxis';
import YAxis from './YAxis';

import {
  selection,
  nest
} from 'd3';

class Pointset extends Component {

  private x: XAxis;
  private y: YAxis;

  constructor(x: XAxis, y: YAxis) {
    super();
    this.x = x;
    this.y = y;
  }



  public render() {
    //Do nothing, since points render only when new data is received.

  }

  public update(data: [any]) {
    let dataSeries = nest()
      .key((d) => d.key)
      .entries(data),
      markers = null,
      markerShape = this.config.get('markerShape'),
      markerSize = this.config.get('markerSize'),
      markerOutlineWidth = this.config.get('markerOutlineWidth'),
      colorScale = this.config.get('colorScale'),
      points = null,
      series = null;

    this.svg.selectAll('g.points').remove();

    series = this.svg.selectAll('g.points');

    switch (markerShape) {
      case 'dot':
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('fill', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.x.xAxis.scale()(d.x))
          .attr('cy', (d) => this.y.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'marker');
        break;
      case 'ring':
        window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.x.xAxis.scale()(d.x))
          .attr('cy', (d) => this.y.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'marker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
        break;
      // Deprecated circle option
      case 'circle':
        window.console.warn('Deprecated "circle" marker shape: use "dot" or "ring" instead');
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.x.xAxis.scale()(d.x))
          .attr('cy', (d) => this.y.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'lineMarker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
        break;
      default:
        points = series
          .data(dataSeries, (d) => d.key)
          .enter()
          .append('g')
          .attr('class', 'points')
          .style('stroke', (d, i) => colorScale(i))
          .selectAll('circle')
          .data((d, i) => d.values)
          .enter()
          .append('circle')
          .attr('cx', (d) => this.x.xAxis.scale()(d.x))
          .attr('cy', (d) => this.y.yAxis.scale()(d.y))
          .attr('r', markerSize)
          .attr('class', 'lineMarker')
          .style('fill', 'white')
          .style('stroke-width', markerOutlineWidth);
    }

    markers = this.svg.selectAll('g.points circle');
    markers
      .on('mousedown.user', this.config.get('onDown'))
      .on('mouseup.user', this.config.get('onUp'))
      .on('mouseleave.user', this.config.get('onLeave'))
      .on('mouseover.user', this.config.get('onHover'))
      .on('click.user', this.config.get('onClick'));
  }

}

export default Pointset;