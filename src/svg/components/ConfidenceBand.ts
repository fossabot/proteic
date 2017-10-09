import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Globals from '../../Globals';
import { area, nest, CurveFactory, Area, easeLinear } from 'd3';


class ConfidenceBand extends Component {

    private x: XAxis;
    private y: YAxis;
    private areaGenerator: Area<any>;
    private confidenceContainer: any;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public render() {
        let height = this.config.get('height'),
            propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            curve: CurveFactory = this.config.get('curve'),
            propertyError = this.config.get('propertyError'),
            confidenceModifier = this.config.get('confidenceModifier');

        this.confidenceContainer = this.svg.append('g')
            .attr('class', 'confidenceSet');

        this.areaGenerator = area()
            .curve(curve)
            .x((d: any) => this.x.xAxis.scale()(d[propertyX]))
            .y0((d: any) => this.y.yAxis.scale()(d[propertyY] - confidenceModifier(d[propertyError])))
            .y1((d: any) => this.y.yAxis.scale()(d[propertyY] + confidenceModifier(d[propertyError])));
    }

    public update(data: [any]) {
        let propertyKey = this.config.get('propertyKey'),
            colorScale = this.config.get('colorScale'),
            confidenceBandOpacity = this.config.get('confidenceBandOpacity');

        let dataSeries = nest().key((d: any) => d[propertyKey]).entries(data);

        let series = this.confidenceContainer.selectAll('g.confidenceSeries');
        let confidences = series.data(dataSeries, (d: any) => d[propertyKey]);

        this.elementEnter = confidences.enter()
            .append('g')
            .attr('class', 'confidenceSeries')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey])
            .append('svg:path')
            .attr('data-proteic-element', 'confidence')
            .style('fill', (d: any) => colorScale(d[propertyKey]))
            .style('fill-opacity', confidenceBandOpacity)
            .attr('d', (d: any) => this.areaGenerator(d.values))
            .attr('class', 'confidence');

        this.elementExit = confidences.exit().remove();

        this.elementUpdate = this.svg.selectAll('.confidence')
            .data(dataSeries, (d: any) => d[propertyKey])
            .attr('d', (d: any) => this.areaGenerator(d.values));
    }

    public transition() {
        this.elementUpdate
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME)
            .ease(easeLinear);

        this.elementEnter
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME);

        this.elementExit
            .transition()
            .duration(Globals.COMPONENT_TRANSITION_TIME);
    }

    public clear() {
        this.svg.selectAll(`*[data-proteic-element='confidence']`).remove();
    }

}

export default ConfidenceBand;
