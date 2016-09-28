import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category3(),

    margin: {
        top: 20,
        right: 100,
        bottom: 30,
        left: 100
    },
    width: '99%', // %, auto, or numeric
    height: 550,
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
        },
        up () {
            
        }
    },
};