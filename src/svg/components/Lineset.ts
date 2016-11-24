
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
        this.lineGenerator = line()
            .x((d) => this.xyAxes.x.xAxis.scale()(d.x))
            .y((d) => this.xyAxes.y.yAxis.scale()(d.y));
    }


    public render(): void {
        //Do nothing, since lines render only when new data is received.
    }

    public update(data: [any]): void {
        let dataSeries = nest().key((d: any) => d.key).entries(data);
        let series = this.svg.selectAll('g.serie');
        let colorScale = this.config.get('colorScale');

        //Update new lines
        let lines = series.data(dataSeries, (d: any) => d.key)
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr('data-key', (d: any) => d.key)
            .attr('stroke', (d: any) => colorScale(d.key))
            .append('svg:path')
            .style('stroke', (d: any) => colorScale(d.key))
            .style('stroke-width', 1.9)
            .style('fill', 'none')
            .attr('d', (d: any) => this.lineGenerator(d.values))
            .attr('class', 'line');

        //update existing lines
        this.svg.selectAll('.line')
            .data(dataSeries, (d: any) => d.key)
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME)
            .ease(easeLinear)
            .attr('d', (d: any) => this.lineGenerator(d.values));
    }

}

export default Lineset;