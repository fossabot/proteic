
class Barset {
  constructor(xAxis, yAxis) {
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.lineGenerator = d3.line()
      .x((d) => xAxis.scale()(d.x))
      .y((d) => yAxis.scale()(d.y));
  }


  update(svg, config, data, method) {
    var bars = null
      , events = config.events;

    if (method === 'stacked') {
      this._updateStacked(svg, config, data);
    } else {
      this._updateGrouped(svg, config, data);
    }
    bars = svg.selectAll('g.serie rect');
    bars
      .on('mousedown.user', events.down)
      .on('mouseup.user', events.up)
      .on('mouseleave.user', events.leave)
      .on('mouseover.user', events.over)
      .on('click.user', events.click);

    this.interactiveElements = bars;
  }

  _updateStacked(svg, config, data) {
    this._cleanCurrentSeries(svg);

    var stack = d3.stack()
      , keys = this._getKeysFromData(data)
      , dataSeries = stack.keys(keys)(data)
      , colorScale = config.colorScale
      , layer = svg.selectAll('.serie').data(dataSeries)
      , layerEnter = layer.enter().append('g')
      , layerMerge = null
      , bar = null
      , barEnter = null
      , barMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale();

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie')
      .attr('fill', (d, i) => colorScale(i));

    bar = layerMerge.selectAll('rect')
      .data((d) => d);

    barEnter = bar.enter().append('rect');

    barMerge = bar.merge(barEnter)
      .attr("x", (d) => x(d.data.key))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());
  }


  _updateGrouped(svg, config, data) {
    this._cleanCurrentSeries(svg);

    var keys = this._getKeysFromData(data)
      , colorScale = config.colorScale
      , layer = svg.selectAll('.serie').data(data)
      , layerEnter = null
      , layerMerge = null
      , bar = null
      , barEnter = null
      , barMerge = null
      , x = this.xAxis.scale()
      , y = this.yAxis.scale()
      , xGroup = d3.scaleBand().domain(keys).range([0, x.bandwidth()])
      , height = config.height;

    //Transform data. TODO: move it
    data.forEach((d) => {
      d.categories = keys.map((category) => {
        return { category: category, value: +d[category] };
      });
    });

    layer = svg.selectAll('.serie').data(data);

    layerEnter = layer.enter().append('g')
      .attr('transform', (d) => 'translate(' + x(d.key) + ')');

    layerMerge = layer.merge(layerEnter)
      .attr('class', 'serie')
      .attr('transform', (d) => 'translate(' + x(d.key) + ')');

    bar = layerMerge.selectAll('rect')
      .data((d) => d.categories);

    barEnter = bar.enter().append('rect');

    barMerge = bar.merge(barEnter)
      .attr('width', xGroup.bandwidth())
      .attr("x", (d) => xGroup(d.category))
      .attr('fill', (d, i) => colorScale(i))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

  }

  _getKeysFromData(data) {
    var keys = [];
    for (let p in data[0]) {
      if (p !== 'total' && p !== 'key') {
        keys.push(p);
      }
    }
    return keys;

  }

  _cleanCurrentSeries(svg) {
    svg.selectAll('.serie').remove();
  }

  render(svg, config) {
    //Do nothing, since bars render only when new data is received.
  }
}