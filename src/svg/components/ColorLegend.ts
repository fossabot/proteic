import { legendColor } from 'd3-svg-legend';
import Component from './Component';
import Config from '../../Config';
import Globals from '../../Globals';
import XAxis from './XAxis';
import YAxis from './YAxis';

import {
    selection,
    nest,
    min as d3min,
    max as d3max,
    format
} from 'd3';

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
        let legend = null,
            entries = null,
            legendTitle = this.config.get('legendTitle'),
            propertyZ = this.config.get('propertyZ'),
            colorScale = this.config.get('colorScale'),
            height = this.config.get('height'),
            width = this.config.get('width'),
            legendCells = this.config.get('legendCells'),
            valuesFormat = this.config.get('valuesFormat');

        this.svg.select('.legend').remove();
        legend = this.svg.append('g').attr('class', 'legend');

        let min = d3min(data, (d: any) => +d[propertyZ]),
            max = d3max(data, (d: any) => +d[propertyZ]);

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
        throw new Error('Not yet implemented');
    }
    
    public transition() {}

}

export default ColorLegend;
