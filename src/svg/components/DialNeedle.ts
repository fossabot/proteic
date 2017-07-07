import { arc as d3arc, range as d3range, scaleLinear } from 'd3';
import { deg2rad } from '../../utils/functions';
import Component from './Component';

class DialNeedle extends Component {

    constructor() {
        super();
    }

    public render() {
        let invertColorScale = this.config.get('invertColorScale');
        let colorScale = this.config.get('colorScale');
        let width = this.config.get('width');
        let height = this.config.get('height');
        let ringWidth = this.config.get('ringWidth');
        let ringMargin = this.config.get('ringMargin');
        let ticks = this.config.get('ticks');
        let minAngle = this.config.get('minAngle');
        let maxAngle = this.config.get('maxAngle');
        let minLevel = this.config.get('minLevel');
        let maxLevel = this.config.get('maxLevel');
        let labelInset = this.config.get('labelInset');
        let needleNutRadius = this.config.get('needleNutRadius');
        let needleLenghtRatio = this.config.get('needleLenghtRatio');
        let scale = scaleLinear()
            .domain([minLevel, maxLevel])
            .range([0, 1]);
        let scaleMarkers = scale.ticks(ticks);

        let range = maxAngle - minAngle;
        let r = ((width > height) ?
            height : width
        ) / 2;
        let needleLen = needleLenghtRatio * (r);

        let translation = (() => 'translate(' + r + ',' + r + ')');

        let angleScale = scaleLinear()
            .domain([minLevel, maxLevel])
            .range([minAngle + 90, maxAngle + 90]);

        // Update the needle
        this.svg.append('path')
            .attr('class', 'needle')
            .datum(0)
            .attr('transform', (d) => `translate(${r}, ${r}) rotate(${angleScale(d) - 90})`)
            .attr('d', `M ${0 - needleNutRadius} ${0} L ${0} ${0 - needleLen} L ${needleNutRadius} ${0}`)
            .style('fill', '#666666');

        // Append needle nut
        this.svg.append('circle')
            .attr('class', 'needle')
            .attr('transform', translation)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', needleNutRadius)
            .style('fill', '#666666');
    }

    public update(data: [any]) {
        let datum = data[data.length - 1];
        let width = this.config.get('width');
        let height = this.config.get('height');
        let needleNutRadius = this.config.get('needleNutRadius');
        let needleLenghtRatio = this.config.get('needleLenghtRatio');
        let propertyValue = this.config.get('propertyValue');
        let minAngle = this.config.get('minAngle');
        let maxAngle = this.config.get('maxAngle');
        let minLevel = this.config.get('minLevel');
        let maxLevel = this.config.get('maxLevel');
        let r = ((width > height) ?
            height : width
        ) / 2;
        let needleLen = needleLenghtRatio * (r);
        let angleScale = scaleLinear()
            .domain([minLevel, maxLevel])
            .range([minAngle + 90, maxAngle + 90]);

        this.svg.select('.needle')
            .attr('transform', (d) => `translate(${r}, ${r}) rotate(${angleScale(datum[propertyValue]) - 90})`)
            .attr('d', `M ${0 - needleNutRadius} ${0} L ${0} ${0 - needleLen} L ${needleNutRadius} ${0}`);
    }

    public clear() {
        console.warn('TODO: Not yet implemented');
    }

    public transition() {
        // console.warn('transition not yet implemented for dialneedle');
    }

}

export default DialNeedle;
