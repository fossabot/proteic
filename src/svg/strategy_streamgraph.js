import {defaults} from '../utils/defaults/streamgraph';
import {SvgAxis} from './base/svgAxis';
import {XAxis} from './components/xAxis';
import {YAxis} from './components/yAxis';
import {Streamset} from './components/streamset';
import {Legend} from './components/legend';
import {simple2stacked} from '../utils/dataTransformation';
import {convertPropretiesToTimeFormat} from '../utils/dataTransformation';
import {sortByField} from '../utils/dataSorting';
import {min, max, map, stack as d3Stack, stackOrderInsideOut, stackOffsetWiggle} from 'd3';

export class SvgStreamgraphStrategy extends SvgAxis {

    constructor(context) {
        super(context);

        this.x = new XAxis('time', this.config);
        this.y = new YAxis('linear', this.config);

        this.streams = new Streamset(this.x.xAxis, this.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.x)
            .add(this.y, false) //No render y Axis
            .add(this.legend)
            .add(this.streams);
    }
    draw(data) {
        let svg = this.svgContainer.svg,
            config = this.config,
            bbox = null,
            keys = map(data, (d) => d.key).keys(),
            xDataFormat = this.config.xAxisFormat,
            data4stack = simple2stacked(data),
            stack = d3Stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(stackOrderInsideOut)
                .offset(stackOffsetWiggle),
            dataSeries = stack(data4stack),
            needRescaling = this.config.needRescaling;
       
       convertPropretiesToTimeFormat(data, ['x'], xDataFormat);
        
        //Sort data
        sortByField(data, 'x');
        
        //rescale, if needed.
        if (needRescaling) {
           this.rescale();
        }
        
        bbox = this._getDomainBBox(data, dataSeries);

        this.x.updateDomainByBBox([bbox[0], bbox[1]]);
        this.y.updateDomainByBBox([bbox[2], bbox[3]]);
        this.x.transition(svg, 200);
        this.y.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }
  
    _getDomainBBox(data, dataSeries) {
        let minX = min(data, (d) => new Date(d.x)),
            maxX = max(data, (d) => new Date(d.x)),
            minY = min(dataSeries, (serie) => min(serie, (d) => d[0])),
            maxY = max(dataSeries, (serie) => max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
    }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
    _loadConfig(config) {
        super._loadConfig(config,defaults);
        return this;
    }
}