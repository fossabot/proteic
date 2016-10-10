import {isEven} from '../../utils/functions'

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
    var x = null
      , xAxis = null;

    switch (xAxisType) {
      case 'time':
        x = d3.scaleTime().range([0, config.width]);
        break;
      case 'linear':
        x = d3.scaleLinear().range([0, config.width]);
        break;
      case 'categorical':
        x = d3.scaleBand().rangeRound([0, config.width])
          .padding(0.1)
          .align(0.5);
        break;
      default:
        throw new Error('Not allowed type for XAxis. Only allowed "time",  "linear" or "categorical". Got: ' + xAxisType);
    }

    return d3.axisBottom(x);
  }

  transition(svg, time = 200) {
    svg.selectAll('.x.axis').transition().duration(time).call(this.xAxis).on('end', this.xStyle);
  }

  xStyle() {
    d3.select(this).selectAll('g.tick text')
      .style('font', '1.4em Montserrat, sans-serif')
      .style('fill', (d, i) => !isEven(i) || i === 0 ? '#5e6b70' : '#1a2127')
      .style('fill', (d) => '#1a2127')


    d3.select(this).selectAll(['path', 'line'])
      .attr('stroke', 'gray')
      .attr('stroke-width', .3)

  }

  /**
   * This function is used when both x and y dial update their domains by x and y max/min values, respectively.
   */
  updateDomainByBBox(b) {
    var x = this.xAxis.scale();
    x.domain([b[0], b[1]]);
  }

  /**
   * Used when x domain is caterogial (a set of keys) and y domain is linear.
   */
  updateDomainByKeys(keys, yBbox) {
    var x = this.xAxis.scale();
    x.domain(keys);
  }

  render(svg, config) {
    var xAxis = this.xAxis
      , xAxisLabel = config.xAxisLabel
      , width = config.width
      , height = config.height
      , margin = config.margin;

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + config.height + ')')
      .call(xAxis)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('class', 'tickLabel')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom).text(xAxisLabel);
      
     this.svg = svg;
  }
}