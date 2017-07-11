import {
    format,
    nest,
    selection
} from 'd3';
import { legendColor } from 'd3-svg-legend';
import Config from '../../Config';
import Globals from '../../Globals';
import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';

class ColorLegend extends Component {

    private x: XAxis;
    private y: YAxis;

    constructor(x?: XAxis, y?: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public render() {
        this.svg.append('g').attr('class', 'legend');
    }

    public update(data: any) {
        let propertyKey: string = this.config.get('propertyKey');

        // Exclude those values that do not contain a 'key'.
        let legend = null;
        let entries = null;
        let legendTitle = this.config.get('legendTitle');
        let propertyZ = this.config.get('propertyZ');
        let colorScale = this.config.get('colorScale');
        let height = this.config.get('height');
        let width = this.config.get('width');
        let legendCells = this.config.get('legendCells');
        let valuesFormat = this.config.get('valuesFormat');

        this.svg.select('.legend').remove();
        legend = this.svg.append('g').attr('class', 'legend');

        let min = data.getCalculationOnProperty('min', propertyZ);
        let max = data.getCalculationOnProperty('max', propertyZ);

        if (data.length <= 1 || min === max) {
            legendCells = 2;
        } else if (data.length <= legendCells) {
            legendCells = data.length;
        }

        colorScale.domain([min, max]);

        let colorLegend: any = legendColor()
            .title(legendTitle)
            .labelDelimiter('–')
            .labelFormat(format(valuesFormat));
        if (legendCells) {
            colorLegend.cells(legendCells);
        }
        colorLegend.scale(colorScale);

        legend.call(colorLegend);

        legend.attr('transform', `translate(${width + 10}, 0)`);
    }

    public clear() {
    }

    public transition() { }

}

export default ColorLegend;
