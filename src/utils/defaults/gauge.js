var _default = _default || {};

_default.Gauge = {
    selector: '#chart',
    colorScale: Colors.diverging_red_blue(),
    invertColorScale: true,
    minLevel: 0,
    maxLevel: 100,
    minAngle: -90,
    maxAngle: 90,
    ringWidth: 50,
    ringMargin: 20,
    labelInset: 10,
    needleNutRadius: 25,
    needleLenghtRatio: 0.8,
    numericIndicator: true,
    xaxis: {
        label: 'X'
    },
    yaxis: {
        label: 'Y'
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '50%', // %, auto, or numeric
    height: 250,
    style: {
        '.labels': {
            'font': '18px sans-serif',
            'text-anchor': 'middle'
        },
        '.text-indicator': {
            'font': '48px sans-serif',
            'text-anchor': 'middle'
        },
        '.needle': {
            'fill': '#666666'
        }
    },
    ticks: 10, // ticks for y dial.
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
    maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};