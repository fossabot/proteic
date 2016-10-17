import { defaults } from '../utils/defaults/stackedArea';
import { SvgContainer } from './components/svgContainer';
import { SvgAxis } from './base/svgAxis';
import { XYAxes } from './components/xyAxes';
import { Streamset } from './components/streamset';
import { Legend } from './components/legend';
import { simple2stacked } from '../utils/dataTransformation';
import { calculateWidth } from '../utils/screen';
import { convertPropretiesToTimeFormat } from '../utils/dataTransformation';
import { sortByField } from '../utils/dataSorting';

export class SvgStackedAreaStrategy extends SvgAxis {

    constructor(context) {
        super(context);

        this.axes = new XYAxes('time', 'linear', this.config);

        this.streams = new Streamset(this.axes.x.xAxis, this.axes.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.axes)
            .add(this.legend)
            .add(this.streams);
    }


    draw(data) {
        let svg = this.svgContainer.svg,
            config = this.config,
            bbox = null,
            keys = d3.map(data, (d) => d.key).keys(),
            data4stack = simple2stacked(data),
            xDataFormat = this.config.xAxisFormat,
            stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffNone),
            dataSeries = stack(data4stack),
            needRescaling = this.config.needRescaling;

        //rescale, if needed.
        if (needRescaling) {
            this.rescale();
        }

        convertPropretiesToTimeFormat(data, ['x'], xDataFormat);

        //Sort data
        sortByField(data, 'x');

        bbox = this._getDomainBBox(data, dataSeries);

        this.axes.updateDomainByBBox(bbox);
        this.axes.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }


    _getDomainBBox(data, dataSeries) {
        let minX = d3.min(data, (d) => (d.x)),
            maxX = d3.max(data, (d) => (d.x)),
            minY = d3.min(dataSeries, (serie) => d3.min(serie, (d) => d[0])),
            maxY = d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
    }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
    _loadConfigOnContext(config) {
        super._loadConfigOnContext(config,defaults);
    }
}