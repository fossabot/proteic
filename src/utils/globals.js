/**
 * This object is used as a default one for those charts that do not have any user configuration.
 * @type {Object}
 */
const _default = {
  Barchart: {
    style: {
      '.axis': {
        'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdges'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    xaxis: {
      label: ''
    },
    yaxis: {
      label: 'Y'
    },
    // Set the color scale for the chart. You can use Proteus scales or any D3 scale
    colorScale: Colors.category7(),
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: '80%', // %, auto, or numeric 
    height: 350,
    ticks: 5, // ticks for y axis.
    tooltip(data) { // Allows HTML
      return 'Object info: ' + JSON.stringify(data);
    },
    tickLabel: '',
    selector: '#chart',
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 0.4);
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 1);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  Linechart: {
    selector: '#chart',
    xaxis: {
      label: 'X'
    },
    yaxis: {
      label: 'Y'
    },
    colorScale: Colors.category7(),
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    style: {
      'path': {
        'stroke': '#11D3BC',
        'stroke-width': 2,
        'fill': 'none'
      },
      '.axis': {
        'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdge'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    ticks: 5, // ticks for y axis.
    markers: {
      shape: 'circle',
      size: 5,
      color: '#FFFCCA',
      outlineColor: '#537780',
      outlineWidth: 2
    },
    tooltip(data) {
      return JSON.stringify(data);
    },
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(50)
          .attr('r', 7)
          ;
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(50)
          .attr('r', 5)
          .style('stroke-width', 2);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 10, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  Streamgraph: {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: Colors.category5(),
    xaxis: {
      label: ''
    },
    yaxis: {
      label: ''
    },
    style: {
      '.axis': {
        'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdges'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 900,
    height: 300,
    ticks: 5, // ticks for y axis.
    tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },
    tickLabel: '',
    events: {
      down() {
        d3.select(this).classed('hover', false);
      },
      over() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 0.4);
      },
      leave() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill-opacity', 1);
      },
      click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  }
};