var _default = _default || {};

_default.Linechart = {
    selector: '#chart',
    xaxis: {
        label: 'X',
        ticks: 5
    },
    yaxis: {
        label: 'Y',
        ticks: 5
    },
    colorScale: Colors.category7(),
    area: false,
    areaOpacity: 0.4,
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 250,
    style: {
        '.line': {
            'stroke-width': 2,
            'fill': 'none'
        },
        '.area': {
            'stroke-width': 0
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
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
        descending: true,
        prop: 'x'
    }
};