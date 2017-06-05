import * as Colors from '../colors';
import Interpolation from '../../svg/Interpolation';
import StreamingStrategy from '../../charts/enums/StreamingStrategy';

export const defaults: any = {
    selector: '#chart',
    colorScale: Colors.category7(),
    curve: Interpolation.CURVE_MONOTONE_X,
    //Area
    areaOpacity: 0,
    //Axes
    xAxisType: 'linear',
    xAxisFormat: '',
    xAxisLabel: null,
    xAxisGrid: true,
    xTicksTextRotation: 65,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: null,
    yAxisShow: true,
    yAxisGrid: true,
    //margins
    marginTop: 50,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 150,
    //markers
    markerShape: 'dot',
    markerSize: 0,
    markerOutlineWidth: 2,
    //Width & height
    width: '100%', // %, auto, or numeric
    height: 250,
    legend: true,
    legendPosition: 'right',
    propertyX: 'x',
    propertyY: 'y',
    propertyKey: 'key',
    nullValues: ['NULL', 'NUL', '\\N', NaN, null, 'NaN'],
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
    streamingStrategy: StreamingStrategy.ADD,
    maxNumberOfElements: 100, // used by keepDrawing method to reduce the number of elements in the current chart
};