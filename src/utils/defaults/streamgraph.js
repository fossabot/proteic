import * as Colors from '../colors';

export const defaults =  {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: Colors.category2(),
    axis:{
        x:{
            type:'time',
            format:'%y/%m/%d'
        },
        y:{
            type: 'categorical',
            format :'%s'
        }
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    margin: {
        top: 20,
        right: 250,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 300,
    ticks: 5, // ticks for y dial.
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
};