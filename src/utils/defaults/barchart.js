import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category5(),
    //Stacked
    stacked: true,
    //Axes
    xAxisType: 'linear',
    xAxisFormat: '%d',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '%d',
    yAxisLabel: null,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 30,
    marginLeft: 50,
    //width & height
    width: '100%',
    height: 350,
    //Events
    onDown(d) {
    },
    onHover(d) {
    },
    onLeave(d) {
    },
    onClick(d) {
    }
};