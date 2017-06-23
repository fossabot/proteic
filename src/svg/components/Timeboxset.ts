
import Component from './Component';
import XYAxes from './XYAxes';
import Config from '../../Config';
import { simple2nested } from '../../utils/data/transforming';
import Globals from '../../Globals';

import {
    extent,
    line,
    nest,
    scaleBand,
    scaleLinear,
    map,
} from 'd3';

class Timeboxset extends Component {

    private xyAxes: XYAxes;

    constructor(xyAxes: XYAxes) {
        super();
        this.xyAxes = xyAxes;
    }


    public render(): void {
        //Do nothing, since lines render only when new data is received.
    }

    public update(data: any[]): void {
        let propertyKey = this.config.get('propertyKey');
        let propertyStart = this.config.get('propertyStart');
        let propertyEnd = this.config.get('propertyEnd')
        let propertyZ = this.config.get('propertyZ');
        
        data = data.filter((d) => propertyEnd in d || propertyStart in d);

        let colorScale = this.config.get('colorScale'),
            height = this.config.get('height'),
            onDown = this.config.get('onDown'),
            onUp = this.config.get('onUp'),
            onLeave = this.config.get('onLeave'),
            onHover = this.config.get('onHover'),
            onClick = this.config.get('onClick'),
            keys = map(data, (d) => d[propertyKey]).keys(),
            layer = this.svg.selectAll('.serie').data(data),
            layerEnter = null,
            layerMerge = null,
            box = null,
            boxEnter = null,
            boxExit = null,
            boxMerge = null,
            extLanes = null,
            yLanes: any = null,
            yLanesBand = scaleBand().range([0, keys.length + 1]).domain(keys),
            x = this.xyAxes.x.xAxis.scale(),
            y = this.xyAxes.y.yAxis.scale();

        data = simple2nested(data, propertyKey);
        
        extLanes = extent(data, (d, i) => i);
        yLanes = scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, height]);

        layer = this.svg.selectAll('.serie').data(data);
        // NOTE: d.key instead of d[propertyKey] because data is d3.Nest
        layerEnter = layer.enter()
            .append('g')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key);

        layerMerge = layer.merge(layerEnter)
            .attr('class', 'serie');
            
            
        box = layerMerge.selectAll('.box')
            .data((d: any) => d.values);
            
        boxExit = layer.exit().remove();

        boxEnter = box.enter()
            .append('g')
            .attr('class', 'box');

        boxEnter.append('rect')
            .attr('data-proteic-element', 'timeBox')
            .attr('width', (d: any) => x(d[propertyEnd]) - x(d[propertyStart]))
            .attr('x', (d: any) => x(d[propertyStart]))
            .attr('y', (d: any) => y(d[propertyKey]))
            .attr('height', () => 0.8 * yLanes(1))
            .style('fill', (d: any) => colorScale(d[propertyKey]));
        boxEnter.append('text')
            .attr('x', (d: any) => x(d[propertyStart]))
            .attr('y', (d: any) => y(d[propertyKey]))
            .text((d: any) => d[propertyZ]);

        boxMerge = box.merge(boxEnter);

        boxMerge.select('rect')
            .attr('width', (d: any) => x(d[propertyEnd]) - x(d[propertyStart]))
            .attr('x', (d: any) => x(d[propertyStart]))
            .attr('y', (d: any) => y(d[propertyKey]))
            .attr('height', () => 0.8 * yLanes(1));

        boxMerge.select('text')
            .attr('x', (d: any) => x(d[propertyStart]) + (x(d[propertyEnd]) - x(d[propertyStart])) / 2)
            .attr('y', (d: any) => y(d[propertyKey]) + 0.8 * yLanes(1) / 2)
            .attr('dy', '3')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle');
        
        box = this.svg.selectAll('g.serie rect');

        box
            .on('mousedown.user', onDown)
            .on('mouseup.user', onUp)
            .on('mouseleave.user', onLeave)
            .on('mouseover.user', onHover)
            .on('click.user', onClick);
    }

    public clear() {
        this.update([]);
    }

    public transition(){
        console.warn('no transition implemented for timeboxset');
    }
}

export default Timeboxset;