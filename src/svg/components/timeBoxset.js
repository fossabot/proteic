class TimeBoxset {

  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;

  }
  update(svg, config, data) {
    var colorScale = config.colorScale
      , layer = svg.selectAll('.serie').data(data)
      , layerEnter = null
      , layerMerge = null
      , box = null
      , boxEnter = null
      , boxMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale()
      , height = config.height
      , extLanes = null
      , yLanes = null;

    data = utils.dataTransformation.simple2nested(data);
    extLanes = d3.extent(data, (d, i) => i)
    yLanes = d3.scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, config.height]);
    
    layer = svg.selectAll('.serie').data(data);
    layerEnter = layer.enter().append('g');

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie');


    box = layerMerge.selectAll('rect')
      .data((d) => d.values);

    boxEnter = box.enter().append('rect');

    console.log(x.domain());

    boxMerge = box.merge(boxEnter)
      .attr('width', (d) => x(new Date(d.y)) - x(new Date(d.x)))
      .attr('x', (d) => x(new Date(d.x)))
      .attr('y', (d) => y(d.key))
      
      .attr('fill', (d, i) => "green")
      .attr("height", (d) => .8 * yLanes(1));

  }

  render(svg, config) {
    //Do nothing, since lines render only when new data is received.
  }
}