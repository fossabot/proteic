
import Component from './Component';
import XYAxes from './XYAxes';
import Config from '../../Config';
import {line, nest} from 'd3';

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
        
        let dataSeries = nest().key((d) => d.key).entries(data),
            series = null,
            lines = null,
            colorScale = this.config.get('colorScale');

        this.svg.selectAll('g.serie').remove();       
        
        
        console.log('dataseries', dataSeries);
        
        
        series = this.svg.selectAll('g.serie');
        lines = series
            .data(dataSeries, (d) => d.key)
            .enter()
            .append('g')
            .attr('class', 'serie')
            .attr('stroke', (d, i) => colorScale(i))
            .append('svg:path')
            .style('stroke', (d, i) => colorScale(i))
            .style('stroke-width', 1.3)
            .style('fill', 'none')
            .attr('d', (d) => this.lineGenerator(d.values))
            .attr('class', 'line');
    }

}

export default Lineset;