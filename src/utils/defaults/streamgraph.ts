import * as Colors from '../colors';

export const defaults =  {
    selector: '#chart',
    colorScale: Colors.category4(),
    //Axes
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: null,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //Width & height
    width: '100%', // %, auto, or numeric 
    height: 250,
    legend:true,
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
        
    },
    maxNumberOfElements: 100, // used by keepDrawing method to reduce the number of elements in the current chart
};