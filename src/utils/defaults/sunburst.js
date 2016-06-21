var _default = _default || {};

_default.Sunburst = {
    selector: '#chart',
        colorScale: Colors.category8(),
        margin: {
        top: 20,
            right: 20,
            bottom: 30,
            left: 50
    },
    width: '50%', // %, auto, or numeric
        height: 450,
        style: {
        '.labels': {
            'font': '18px sans-serif',
                'text-anchor': 'middle'
        },
        'path': {
            'stroke': '#fff',
                'stroke-width': 2,
                'shape-rendering': 'crispEdge'
        },
        '.infobox': {
            'text-anchor': 'middle',
                'alignment-baseline': 'central',
                'fill': 'black'
        },
        '.infobox .name': {
            'font': '28px sans-serif'
        },
        '.infobox .value': {
            'font': '24px sans-serif',
                'transform': 'translate(0, 1.5em)'
        }
    },
    tooltip(data) {
        return data.name + ': ' + data.value;
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
        maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
        sortData: {
        descending: false,
            prop: 'x'
    }
};