import {isEven} from '../../utils/functions';
import {select, scaleTime, scaleLinear, scaleBand, axisBottom, format as d3Format} from 'd3';

export class XAxis {
  constructor(xAxisType, config) {
    if (config === null) {
      throw new Error('No chart context specified for XAxis');
    }

    this.xAxis = this._initializeXAxis(xAxisType, config);
  }


  rescale(width, height) {
    this.xAxis.scale().range([0, width]);
  }

  _initializeXAxis(xAxisType = 'linear', config) {
    let x = null,
      axis = null;

    // switch (xAxisType) {
    //   case 'time':
    //     x = scaleTime().range([0, config.width]);
    //     break;
    //   case 'linear':
    //     x = scaleLinear().range([0, config.width]);
    //     break;
    //   case 'categorical':
    //     x = scaleBand().rangeRound([0, config.width])
    //       .padding(0.1)
    //       .align(0.5);
    //     break;
    //   default:
    //     throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
    // }

    switch (xAxisType) {
      case 'time':
        x = scaleTime().range([0, config.width]);
        axis = axisBottom(x);
        break;
      case 'linear':
        x = scaleLinear().range([0, config.width]);
        axis = axisBottom(x).tickFormat(d3Format(config.xAxisFormat));
        break;
      case 'categorical':
        x = scaleBand().rangeRound([0, config.width])
          .padding(0.1)
          .align(0.5);
        axis = axisBottom(x);
        break;
      default:
        throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
    }

    return axisBottom(x);
  }

  transition(svg, time = 200) {
    svg.selectAll('.x.axis').transition().duration(time).call(this.xAxis).on('end', this.xStyle);
  }

  xStyle() {
    select(this).selectAll('g.tick text')
      .style('font', '1.4em Montserrat, sans-serif')
      .style('fill', (d, i) => !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('fill', (d) => '#1a2127')


    select(this).selectAll(['path', 'line'])
      .attr('stroke', 'gray')
      .attr('stroke-width', .3);

  }

  /**
   * This function is used when both x and y dial update their domains by x and y max/min values, respectively.
   */
  updateDomainByBBox(b) {
    let x = this.xAxis.scale();
    x.domain([b[0], b[1]]);
  }

  /**
   * Used when x domain is caterogial (a set of keys) and y domain is linear.
   */
  updateDomainByKeys(keys, yBbox) {
    let x = this.xAxis.scale();
    x.domain(keys);
  }

  render(svg, config) {
    let xAxis = this.xAxis,
      width = config.width,
      height = config.height;
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + config.height + ')')
      .call(xAxis);

    svg
      .append('text')
      .attr('class', 'xaxis-title')
      .attr("text-anchor", "middle")
      .attr('x', width / 2)
      .attr('y', height + 40)
      .text(config.xAxisLabel)
      .style('font', '0.8em Montserrat, sans-serif');

    this.svg = svg;
  }
}