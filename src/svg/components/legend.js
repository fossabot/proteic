
class Legend {
  constructor() {

  }

  update(svg, config, data) {
    var dataSeries = d3.nest()
        .key((d) => d.key)
        .entries(data)
      , legend = null
      , entries = null
      , entries = null
      , colorScale = config.colorScale
      , height = config.height
      , width = config.width;

      
    svg.selectAll('g.legend').remove();
    
    legend = svg.append('g').attr('class', 'legend');
    entries = legend.selectAll('.legend-entry')
      .data(dataSeries, (d) => d.key)
      .enter()
      .append('g')
      .attr('class', 'legend-entry');


    entries.append('rect')
      .attr('x', width + 10)
      .attr('y', (d, i) => i * 25)
      .attr('height', 20)
      .attr('width', 20)
      .attr('fill', (d, i) => colorScale(i))
      .style('opacity', 0.8);

    entries.append('text')
      .attr("x", width + 25 + 10)
      .attr("y", (d, i) => i * 25 + 7)
      .attr("dy", "0.55em")
      .text((d) => d.key)
      .style('font', '14px sans-serif');

  }

  render(svg, config) {
    //Do nothing, since legend render only when new data is received.
  }
}