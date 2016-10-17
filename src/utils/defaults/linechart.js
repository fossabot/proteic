import * as Colors from '../colors';

export const defaults = {
    selector: '#chart',
    colorScale: Colors.category7(),
    //Area
    areaOpacity: 0.4,

    //Axes
    xAxisType: 'linear',
    xAxisFormat: '%m/%d/%y',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '%d',
    yAxisLabel: null,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //markers
    markerShape: 'circle',
    markerSize: 5,
    markerOutlineWidth: 2,
    //Width & height
    width: '100%', // %, auto, or numeric 
    height: 250,
    //Events
    onDown(d) {
    },
    onHover(d) {
    },
    onLeave(d) {
    },
    onClick(d) {
    },

    maxNumberOfElements: 100, // used by keepDrawing method to reduce the number of elements in the current chart
};