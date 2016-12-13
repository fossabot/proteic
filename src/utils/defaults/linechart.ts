import * as Colors from '../colors';

export const defaults : any = {
    selector: '#chart',
    colorScale: Colors.category7(),
    //Area
    areaOpacity: 0,
    //Axes
    xAxisType: 'linear',
    xAxisFormat: '',
    xAxisLabel: null,
    xAxisGrid: true,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: true,
    yAxisGrid: true,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //markers
    markerShape: 'dot',
    markerSize: 5,
    markerOutlineWidth: 2,
    //Width & height
    width: '100%', // %, auto, or numeric
    height: 250,
    legend: true,
    propertyX: 'x',
    propertyY: 'y',
    propertyKey: 'key',
    //Events
    onDown(d) {
    },
    onHover(d) {
    },
    onLeave(d) {
    },
    onClick(d) {
    },
    onUp(d) {
    },
    maxNumberOfElements: 100, // used by keepDrawing method to reduce the number of elements in the current chart
};