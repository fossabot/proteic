
class Tooltip {
  /**
  constructor() {

  }

  render(svg, config) {
    this.tooltip = d3.select(config.selector + ' g.chartContainer')
      .append('div')
      .text('tooltip')
      .attr('class', 'tooltip');

    this.tooltip.style('opacity', 0);

    console.log('tooltip rendered');
  }

  enter() {
    //we need svg!!!!!. d3.select is d4ng3rous
    var mouse = d3.mouse(this)
    , tooltip = null;

    tooltip = d3.select('.tooltip')
      .style('opacity', 1)
      .style('top', mouse[0] + 'px')
      .style('left', mouse[1] + 'px')
      .style('height', 150)
      .style('width', 400);

    console.log('Entering tooltip', this, d3.mouse(this));

  }

  exit() {
    console.log('Exiting tooltip');
  }

  bind(elements) {
    elements.on('mouseover.tooltip', this.enter);
    elements.on('mouseleave.tooltip', this.exit);
  }
  **/
}