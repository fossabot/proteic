import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category7(),
    area: false,
    areaOpacity: 0.4,
    margin: {
        top: 20,
        right: 250,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 250,
    markers: {
        shape: 'circle',
        size: 5,
        outlineWidth: 2
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
    maxNumberOfElements: 100, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: true,
        prop: 'x'
    }
};