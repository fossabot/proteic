
import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Config from '../../Config';
import Globals from '../../Globals';


import {
    line,
    nest,
    easeLinear,
    CurveFactory,
    Line
} from 'd3';

class Lineset extends Component {

    private x: XAxis;
    private y: YAxis;
    private lineGenerator: Line<any>;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }


    public render(): void {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let curve: CurveFactory = this.config.get('curve');

        this.lineGenerator = line()
            .curve(curve)
            .x((d) => this.x.xAxis.scale()(d[propertyX]))
            .y((d) => this.y.yAxis.scale()(d[propertyY]));
    }

    public update(data: [any]): void {
        let propertyKey = this.config.get('propertyKey');
        let propertyX = this.config.get('propertyX');
        let dataSeries = nest().key((d: any) => d[propertyKey]).entries(data);
        let series = this.svg.selectAll('g.lineSeries');
        let colorScale = this.config.get('colorScale');

        // console.log(data[1][propertyX]);
        // console.log(data[data.length - 1][propertyX]);

        // update x domain
        // this.x.xAxis.scale().domain(data[1][propertyX], data[data.length - 1][propertyX]);

        //Update new lines
        // let lines =
        series.data(dataSeries, (d: any) => d[propertyKey])
            .enter()
            .append('g')
            .attr('clip-path', 'url(#proteic-clip-path)')
            .attr('class', 'lineSeries')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey])
            .attr('stroke', (d: any) => colorScale(d[propertyKey]))
            .append('svg:path')
            .style('stroke', (d: any) => colorScale(d[propertyKey]))
            .style('stroke-width', 1.9)
            .style('fill', 'none')
            // .attr('d', (d: any) => this.lineGenerator(d.values))
            .attr('class', 'line')
            ;

        let lines = this.svg.selectAll('.line');
        let slideDistance =
            this.x.xAxis.scale()(dataSeries[0].values[dataSeries[0].values.length - 2][propertyX])
            - this.x.xAxis.scale()(dataSeries[0].values[dataSeries[0].values.length - 1][propertyX]);

            // this.x.xAxis.scale()(data[data.length - 2][propertyX]) - this.x.xAxis.scale()(data[data.length - 1][propertyX]);
        window.dataseries = dataSeries;
        //update existing lines
        lines.data(dataSeries, (d: any) => d[propertyKey])
            .attr('d', (d: any) => this.lineGenerator(d.values))
            .attr('transform', null)
            .transition()
            .duration(Globals.SLIDE_TRANSITION_TIME)
            .ease(easeLinear)
            .attr('transform', `translate(${slideDistance})`)
        ;



    }

}

export default Lineset;