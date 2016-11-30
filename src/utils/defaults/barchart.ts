import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category5(),
    //Stacked
    stacked: false,
    //Axes
    xAxisType: 'categorical',
    xAxisFormat: '',
    xAxisLabel: '',
    xAxisGrid: false,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: '',
    yAxisShow: true,
    yAxisGrid: true,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //width & height
    width: '100%',
    height: 350,
    legend: true,
    propertyX: 'x',
    propertyY: 'y',
    propertyKey: 'key',
    //Events
    onDown(d: any) {
    },
    onHover(d: any) {
    },
    onLeave(d: any) {
    },
    onClick(d: any) {
    },
    onUp(d: any) {
    }
};