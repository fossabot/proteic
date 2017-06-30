import StreamingStrategy from '../../charts/enums/StreamingStrategy';
import * as Colors from '../colors';

export const defaults: any = {
    selector: '#chart',
    colorScale: Colors.category3(),
    legendCells: 5,
    colorScaleType: 'categorical',
    xAxisType: 'time',
    xAxisFormat: '%y/%m/%d',
    xAxisLabel: '',
    xAxisGrid: true,
    xTicksTextRotation: 0,
    yAxisType: 'categorical',
    yAxisFormat: 's',
    yAxisLabel: '',
    yAxisShow: true,
    yAxisGrid: true,
    marginTop: 20,
    marginRight: 250,
    marginBottom: 30,
    marginLeft: 70,
    width: '100%', // %, auto, or numeric 
    height: 250,
    legend: true,
    legendPosition: 'right',
    legendTitle: '',
    propertyStart: 'start',
    propertyEnd: 'end',
    propertyY: 'key',
    propertyKey: 'key',
    propertyZ: 'value',
    displayValues: false,
    valuesFormat: '.2',
    streamingStrategy: StreamingStrategy.ADD,
    nullValues: ['NULL', 'NUL', '\\N', NaN, null, 'NaN'],
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
