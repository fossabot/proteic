import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category5(),
    //Stacked
    stacked: true,
    //Axes
    xAxisType: 'categorical',
    xAxisFormat: '',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: true,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //width & height
    width: '100%',
    height: 350,
    legend: true,
    //Events
    onDown(d) {
    },
    onHover(d) {
    },
    onLeave(d) {
    },
    onClick(d) {
    },
    onUp(d){
    }
};