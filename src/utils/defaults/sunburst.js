import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category8(),
    marginTop: 20,
    marginRight: 20,
    marginBottom: 30,
    marginLeft: 50,
    width: '50%', // %, auto, or numeric
    height: 450,

    onDown() {
        d3.select(this).classed('hover', false);
    },
    onOver() {
        console.log(this);
        d3.select(this)
            .transition()
            .duration(50)
            .attr('r', 7)
            ;
    },
    onLeave() {
        d3.select(this)
            .transition()
            .duration(50)
            .attr('r', 5)
            .style('stroke-width', 2);
    },
    onClick(d, i) {
        console.log(d, i);
    },
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};