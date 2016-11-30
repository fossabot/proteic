
import Component from './Component';
import XYAxes from './XYAxes';
import Config from '../../Config';
import Globals from '../../Globals';


import { line, nest, easeLinear } from 'd3';

class Lineset extends Component {

    private xyAxes: XYAxes;
    private lineGenerator: any;

    constructor(xyAxes: XYAxes) {
        super();
        this.xyAxes = xyAxes;

    }


    public render(): void {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        this.lineGenerator = line()
            .x((d) => this.xyAxes.x.xAxis.scale()(d[propertyX]))
            .y((d) => this.xyAxes.y.yAxis.scale()(d[propertyY]));
    }

    public update(data: [any]): void {
        let propertyKey = this.config.get('propertyKey');
        let dataSeries = nest().key((d: any) => d[propertyKey]).entries(data);
        let series = this.svg.selectAll('g.serie');
        let colorScale = this.config.get('colorScale');

        //Update new lines
        let lines = series.data(dataSeries, (d: any) => d[propertyKey])
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey])
            .attr('stroke', (d: any) => colorScale(d[propertyKey]))
            .append('svg:path')
            .style('stroke', (d: any) => colorScale(d[propertyKey]))
            .style('stroke-width', 1.9)
            .style('fill', 'none')
            .attr('d', (d: any) => this.lineGenerator(d.values))
            .attr('class', 'line');

        //update existing lines
        this.svg.selectAll('.line')
            .data(dataSeries, (d: any) => d[propertyKey])
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME)
            .ease(easeLinear)
            .attr('d', (d: any) => this.lineGenerator(d.values));
    }

}

export default Lineset;