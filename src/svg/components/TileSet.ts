import { Data } from './../../data/Data';
import Globals from '../../Globals';
import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';

class TileSet extends Component {
    private x: XAxis;
    private y: YAxis;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public render() { }

    public update(data: Data) {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let propertyZ = this.config.get('propertyZ');
        let colorScale = this.config.get('colorScale');
        let xStep: number = this.config.get('xStep');
        let yStep: number = this.config.get('yStep');
        let yAxisType = this.config.get('yAxisType');
        let xAxisType = this.config.get('xAxisType');
        let x = this.x.xAxis.scale();
        let y = this.y.yAxis.scale();
        let width: number = 0;
        let heigth: number = 0;

        let minX = data.getCalculationOnProperty('min', propertyX);
        let minY = data.getCalculationOnProperty('min', propertyY);
        let minZ = data.getCalculationOnProperty('min', propertyZ);

        let maxX = data.getCalculationOnProperty('max', propertyX);
        let maxY = data.getCalculationOnProperty('max', propertyY);
        let maxZ = data.getCalculationOnProperty('max', propertyZ);

        colorScale.domain([minZ, maxZ]);

        if (xAxisType === 'linear') {
            this.x.updateDomainByMinMax(minX, maxX + xStep);
            this.x.transition();
            width = x(xStep) - x(0);
        } else if (xAxisType === 'categorical') {
            width = x.step();
        }
        if (yAxisType === 'linear') {
            this.y.updateDomainByMinMax(minY, maxY + yStep);
            this.y.transition();
            heigth = y(0) - y(yStep);
        } else if (yAxisType === 'categorical') {
            heigth = y.step();
        }

        // Data join
        let tiles = this.svg.selectAll('.tile')
            .data(data.originalDatum);

        // Update
        tiles.attr('class', 'tile')
            .attr('x', (d) => x(d[propertyX]))
            .attr('y', (d) => {
                if (yAxisType === 'linear') {
                    return y(+d[propertyY] + yStep);
                } else {
                    return y(d[propertyY]);
                }
            })
            .attr('width', width)
            .attr('height', heigth)
            .attr('fill-opacity', 1)
            .style('fill', (d) => colorScale(d[propertyZ]));

        // Enter
        let entering = tiles
            .enter().append('rect')
            .attr('class', 'tile')
            .attr('x', (d) => x(d[propertyX]))
            .attr('y', (d) => {
                if (yAxisType === 'linear') {
                    return y(+d[propertyY] + yStep);
                } else {
                    return y(d[propertyY]);
                }
            })
            .attr('width', width)
            .attr('height', heigth)
            .style('fill', (d) => colorScale(d[propertyZ]))
            .attr('fill-opacity', 0)
            .attr('fill-opacity', 1);

        // Exit
        tiles.exit().remove();

        tiles
            .on('mousedown.user', this.config.get('onDown'))
            .on('mouseup.user', this.config.get('onUp'))
            .on('mouseleave.user', this.config.get('onLeave'))
            .on('mouseover.user', this.config.get('onHover'))
            .on('click.user', this.config.get('onClick'));
    }

    public clear() {
        this.update(Data.empty(this.config));
    }

    public transition() { }

}

export default TileSet;
