import { arc as d3arc, range as d3range, scaleLinear } from 'd3';
import { Arc } from 'd3-shape';
import { deg2rad } from '../../utils/functions';
import Component from './Component';

class Dial extends Component {

    constructor() {
        super();
    }

    public render() {
        let labels = null;
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
        let scale = scaleLinear()
                .domain([minLevel, maxLevel])
                .range([0, 1]);
        let scaleMarkers = scale.ticks(ticks);

        let range = maxAngle - minAngle;
        let r = ((width > height) ?
                height : width
            ) / 2;
        let translation = (() => 'translate(' + r + ',' + r + ')');
        let tickData = d3range(ticks).map(() => 1 / ticks);
        let arc: Arc<any, any> = d3arc()
                .innerRadius(r - ringWidth - ringMargin)
                .outerRadius(r - ringMargin)
                .startAngle((d: any, i) => deg2rad(minAngle + ((d * i) * range)))
                .endAngle((d: any, i) => deg2rad(minAngle + ((d * (i + 1)) * range)));

        colorScale.domain([0, 1]);

        // Append the ring
        let arcs = this.svg.append('g')
            .attr('class', 'arc')
            .attr('transform', translation);

        // Append the ring sectors
        let arcPaths = arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            // ID for textPath linking
            .attr('id', (d, i) => 'sector-' + i)
            .attr('d', arc);

        // Fill colors
        arcPaths.attr('fill', (d: number, i: number) => colorScale(invertColorScale
            ? (1 - d * i)
            : (d * i))
        );

        // Apend the scale labels
        labels = this.svg.append('g')
            .attr('class', 'labels')
            .attr('transform', translation);

        // // Append scale marker labels
        labels.selectAll('text')
            .data(scaleMarkers)
            .enter().append('text')
            .attr('transform', (d) => {
                let ratio = scale(d);
                let newAngle = minAngle + (ratio * range);

                return 'rotate(' + newAngle + ') translate(0,' + (labelInset - r) + ')';
            })
            .text((d) => d)
            .style('text-anchor', 'middle')
            .style('font', '18px Montserrat, sans-serif');
    }

    public update() {

    }

    public clear() {
        console.warn('TODO: Not yet implemented');
    }

    public transition() {
        // console.warn('No transition effects for dial');
    }

}

export default Dial;
