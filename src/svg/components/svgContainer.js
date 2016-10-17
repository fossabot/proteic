export class SvgContainer {

  constructor(config) {
    this._config = config;
    this.svg = this._initializeSvgContainer(config);
    this.components = Array();
  }

  _initializeSvgContainer(config) {
      let selector = config.selector,
      width = config.width + config.marginLeft + config.marginRight,
      height = config.height + config.marginTop + config.marginBottom,
      svg = null;

    svg = d3
      .select(selector)
      .append('svg:svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('class', 'chartContainer')
      .attr('transform', 'translate(' + config.marginLeft + ',' + config.marginTop + ')');

    return svg;
  }


  add(component, render = true) {
    this.components.push(component);

    if (render) {
      component.render(this.svg, this._config);
    }
    return this;
  }

  transform(translation) {
    this.svg.attr('transform', translation);

  }
}