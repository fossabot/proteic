import * as Colors from '../colors';
import StreamingStrategy from '../../charts/enums/StreamingStrategy';

export const defaults : any = {
    selector: '#chart',
    colorScale: Colors.category7(),

    //Axes
    xAxisType: 'linear',
    xAxisFormat: '.1f',
    xAxisLabel: '',
    xAxisGrid: true,
    xTicksTextRotation: 0,
    yAxisType: 'linear',
    yAxisFormat: '.1f',
    yAxisLabel: '',
    yAxisShow: true,
    yAxisGrid: true,
    //margins
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //markers
    markerShape: 'circle',
    markerSize: 15,
    //Width & height
    width: '100%', // %, auto, or numeric
    height: 250,
    legend: true,
    legendPosition: 'right',
    propertyX: 'x',
    propertyY: 'y',
    propertyKey: 'key',
    nullValues: ['NULL', 'NUL', '\\N', NaN, null],
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
    },
    maxNumberOfElements: 100, // used by keepDrawing method to reduce the number of elements in the current chart
    streamingStrategy: StreamingStrategy.ADD,
    canvas: false
};