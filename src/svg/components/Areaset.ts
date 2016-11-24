import Component from './Component';
import Config from '../../Config';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Globals from '../../Globals';

import {
    area,
    selection,
    nest,
    easeLinear
} from 'd3';


class Areaset extends Component {

    private x: XAxis;
    private y: YAxis;
    private areaGenerator: any;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public render() {
        let height = this.config.get('height');

        this.areaGenerator = area()
            .x((d: any) => this.x.xAxis.scale()(d.x))
            .y0(height)
            .y1((d: any) => this.y.yAxis.scale()(d.y));
    }

    public update(data: [any]) {

        let dataSeries = nest().key((d: any) => d.key).entries(data);

        let areas = this.svg.selectAll('g.area');
        let colorScale = this.config.get('colorScale');
        let height = this.config.get('height');
        let areaOpacity = this.config.get('areaOpacity');

        areas = areas.data(dataSeries, (d: any) => d.key)
            .enter()
            .append('g')
            .attr('class', 'area')
            .attr('data-key', (d: any) => d.key)
            .append('svg:path')
            .style('fill', (d: any) => colorScale(d.key))
            .style('fill-opacity', areaOpacity)
            .attr('d', (d: any) => this.areaGenerator(d.values))
            .attr('class', 'areaPath');

        //update existing paths
        this.svg.selectAll('.areaPath')
            .data(dataSeries, (d: any) => d.key)
            .transition()
            //.duration(Globals.COMPONENT_TRANSITION_TIME)
            //.ease(easeLinear)
            .attr('d', (d: any) => this.areaGenerator(d.values));

    }

}

export default Areaset;