
class Tooltip {
  constructor() {

  }

  render(svg, config) {
    this.tooltip = d3.selectAll(config.selector + 'g').append('div').text('tooltip').attr('class', 'tooltip');
    this.tooltip.style('opacity', 0);
  }

  enter(){
    console.log('Entering tooltip');

  }

  exit(){
    console.log('Exiting tooltip');
  }
}