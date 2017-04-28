import Component from './Component';
import Config from '../../Config';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Globals from '../../Globals';

import {
    selection,
    nest,
    symbol,
    symbolCircle,
    symbolCross,
    symbolDiamond,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    symbolWye,
    easeLinear
} from 'd3';

class Pointset extends Component {

    private x: XAxis;
    private y: YAxis;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }



    public render() {
        //Do nothing, since points render only when new data is received.

    }

    public update(data: [any]) {
        let propertyKey = this.config.get('propertyKey');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        
        let dataSeries = nest()
            .key((d: any) => d[propertyKey])
            .entries(data),
            markers: any = null,
            markerShape = this.config.get('markerShape'),
            markerSize = this.config.get('markerSize'),
            markerOutlineWidth = this.config.get('markerOutlineWidth'),
            colorScale = this.config.get('colorScale');

        let shape = symbol().size(markerSize);

        // series = this.svg.selectAll('g.points');

        switch (markerShape) {
            case 'dot':
                shape.type(symbolCircle);
                break;
            case 'ring':
                shape.type(symbolCircle);
                break;
            case 'cross':
                shape.type(symbolCross);
                break;
            case 'diamond':
                shape.type(symbolDiamond);
                break;
            case 'square':
                shape.type(symbolSquare);
                break;
            case 'star':
                shape.type(symbolStar);
                break;
            case 'triangle':
                shape.type(symbolTriangle);
                break;
            case 'wye':
                shape.type(symbolWye);
                break;
            case 'circle':
                shape.type(symbolCircle);
                break;
            default:
                shape.type(symbolCircle);
        }

        // JOIN series
        let serie = this.svg.selectAll(`.${Globals.SELECTOR_SERIE}`)
        .data(dataSeries);

        // UPDATE series
        // NOTE: d.key instead of d[propertyKey] because dataSeries is d3.Nest
        serie.attr('class', Globals.SELECTOR_SERIE)
        .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key);

        // ENTER + UPDATE series
        serie = serie.enter().append('g')
        .attr('class', Globals.SELECTOR_SERIE)
        .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.key)
        .merge(serie);

        // EXIT series
        serie.exit().remove();

        // JOIN points
        let points = serie.selectAll(`.${Globals.SELECTOR_ELEMENT}`)
        .data((d: any) => d.values, (d: any) => d[propertyX]);

        // UPDATE points
        points.attr('class', Globals.SELECTOR_ELEMENT)
        .transition()
        .duration(Globals.COMPONENT_TRANSITION_TIME)
        .ease(easeLinear)
        .attr('transform', (d: any) => `translate(${this.x.xAxis.scale()(d[propertyX])}, ${this.y.yAxis.scale()(d[propertyY])})`);


        // ENTER points
        points.enter().append('path')
        .attr('class', Globals.SELECTOR_ELEMENT)
        .attr('d', shape) 
        .style('stroke', (d: any) => colorScale(d[propertyKey]))
        .style('fill', (d: any) => markerShape !== 'ring' ? colorScale(d[propertyKey]) : 'transparent')
        .attr('transform', (d: any) => `translate(${this.x.xAxis.scale()(d[propertyX])}, ${this.y.yAxis.scale()(d[propertyY])})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .transition()
        .duration(Globals.COMPONENT_ANIMATION_TIME)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);
        // .merge(points)
        // .attr('d', shape) 
        // .style('stroke', (d: any) => colorScale(d[propertyKey]))
        // .style('fill', (d: any) => markerShape !== 'ring' ? colorScale(d[propertyKey]) : 'transparent')
        // .transition()
        // .duration(Globals.COMPONENT_TRANSITION_TIME)
        // .ease(easeLinear)
        // .attr('transform', (d: any) => `translate(${this.x.xAxis.scale()(d[propertyX])}, ${this.y.yAxis.scale()(d[propertyY])})`);

        // EXIT points
        points.exit().remove();

        points
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));
    }

}

export default Pointset;