import { Data } from './../../data/Data';

import {
    extent,
    format,
    line,
    map,
    max as d3Max,
    min as d3Min,
    nest,
    scaleBand,
    scaleLinear
} from 'd3';
import Config from '../../Config';
import Globals from '../../Globals';
import { simple2nested } from '../../utils/data/transforming';
import Component from './Component';
import XYAxes from './XYAxes';

class Timeboxset extends Component {

    private xyAxes: XYAxes;

    constructor(xyAxes: XYAxes) {
        super();
        this.xyAxes = xyAxes;
    }

    public render(): void { }

    public update(data: Data): void {
        let propertyKey = this.config.get('propertyKey');
        let propertyStart = this.config.get('propertyStart');
        let propertyEnd = this.config.get('propertyEnd');
        let propertyZ = this.config.get('propertyZ');

        let filteredData = data.originalDatum.filter((d) => propertyEnd in d || propertyStart in d);

        let colorScale = this.config.get('colorScale');
        let colorScaleType = this.config.get('colorScaleType');
        let height = this.config.get('height');
        let onDown = this.config.get('onDown');
        let onUp = this.config.get('onUp');
        let onLeave = this.config.get('onLeave');
        let onHover = this.config.get('onHover');
        let onClick = this.config.get('onClick');
        let displayValues = this.config.get('displayValues');
        let valuesFormat = this.config.get('valuesFormat');
        let keys = map(filteredData, (d) => d[propertyKey]).keys();
        let layer = this.svg.selectAll('.serie').data(filteredData);
        let layerEnter = null;
        let layerMerge = null;
        let box = null;
        let boxEnter = null;
        let boxExit = null;
        let boxMerge = null;
        let extLanes = null;
        let yLanes: any = null;
        let yLanesBand = scaleBand().range([0, keys.length + 1]).domain(keys);
        let x = this.xyAxes.x.xAxis.scale();
        let y = this.xyAxes.y.yAxis.scale();

        if (colorScaleType === 'sequential') {
            let min = (d3Min(filteredData, (d: any) => +d[propertyZ]));
            let max = (d3Max(filteredData, (d: any) => +d[propertyZ]));
            colorScale.domain([min, max]);
        }

        filteredData = simple2nested(filteredData, propertyKey);

        extLanes = extent(filteredData, (d, i) => i);
        yLanes = scaleLinear().domain([extLanes[0], extLanes[1] + 1]).range([0, height]);

        layer = this.svg.selectAll('.serie').data(filteredData);

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
            .attr('height', () => yLanes(1) * 0.8)
            .style('fill', (d: any) => colorScaleType === 'sequential'
                ? colorScale(d[propertyZ])
                : colorScale(d[propertyKey])
            );

        if (displayValues) {
            boxEnter.append('text')
                .attr('x', (d: any) => x(d[propertyStart]) + (x(d[propertyEnd]) - x(d[propertyStart])) / 2)
                .attr('y', (d: any) => y(d[propertyKey]) + yLanes(1) * 0.8 / 2)
                .attr('dy', '3')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text((d: any) => format(valuesFormat)(d[propertyZ]));
        }

        boxMerge = box.merge(boxEnter);

        boxMerge.select('rect')
            .attr('width', (d: any) => x(d[propertyEnd]) - x(d[propertyStart]))
            .attr('x', (d: any) => x(d[propertyStart]))
            .attr('y', (d: any) => y(d[propertyKey]))
            .attr('height', () => yLanes(1) * 0.8)
            .style('fill', (d: any) => colorScaleType === 'sequential'
                ? colorScale(d[propertyZ])
                : colorScale(d[propertyKey])
            );

        if (displayValues) {
            boxMerge.select('text')
                .attr('x', (d: any) => x(d[propertyStart]) + (x(d[propertyEnd]) - x(d[propertyStart])) / 2)
                .attr('y', (d: any) => y(d[propertyKey]) + yLanes(1) * 0.8 / 2)
                .attr('dy', '3')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle');
        }

        box = this.svg.selectAll('g.serie rect');

        box
            .on('mousedown.user', onDown)
            .on('mouseup.user', onUp)
            .on('mouseleave.user', onLeave)
            .on('mouseover.user', onHover)
            .on('click.user', onClick);
    }

    public clear() {
        this.update(Data.empty(this.config));
    }

    public transition() { }
}

export default Timeboxset;
