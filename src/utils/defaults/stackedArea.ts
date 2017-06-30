import {
    stack as d3Stack,
    stackOffsetNone,
    stackOrderInsideOut
} from 'd3';
import StreamingStrategy from '../../charts/enums/StreamingStrategy';
import * as Colors from '../colors';

export const defaults: any = {
    selector: '#chart',
    colorScale: Colors.category2(),
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: '',
    xAxisGrid: true,
    xTicksTextRotation: 65,
    yAxisType: 'linear',
    yAxisFormat: '',
    yAxisLabel: '',
    yAxisShow: true,
    yAxisGrid: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 130,
    marginLeft: 70,
    width: '100%', // %, auto, or numeric 
    height: 250,
    legend: true,
    legendPosition: 'right',
    propertyX: 'x',
    propertyY: 'y',
    propertyKey: 'key',
    nullValues: ['NULL', 'NUL', '\\N', NaN, null, undefined],
    stacked: true,
    stack: d3Stack().value((d: any, k: any) => d.value[k]).order(stackOrderInsideOut).offset(stackOffsetNone),
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
