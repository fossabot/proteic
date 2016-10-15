import {defaults} from '../utils/defaults/stackedArea';
import {SvgContainer} from './components/svgContainer';
import {SvgStrategy} from './strategy';
import {XYAxes} from './components/xyAxes';
import {Streamset} from './components/streamset';
import {Legend} from './components/legend';
import {simple2stacked} from '../utils/dataTransformation';
import {calculateWidth} from '../utils/screen';
import {convertPropretiesToTimeFormat} from '../utils/dataTransformation';
import {sortByField} from '../utils/dataSorting';

export class SvgStackedAreaStrategy extends SvgStrategy{

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
            xDataFormat = this.config.x.format,
            stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffNone),
            dataSeries = stack(data4stack),
            needAxisRescaling = this.config.needAxisRescaling;

        //rescale, if needed.
        if (needAxisRescaling) {
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
        config = config || { events: {}, x: {}, y: {} };
        if (!config.events) {
            config.events = {};
        }

        if (!config.x) {
            config.x = {};
        }
        
        if (!config.y) {
            config.y = {};
        }
        
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || defaults.selector;
        this.config.margin = config.margin || defaults.margin;
        this.config.width = config.width ? calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
            : calculateWidth(defaults.width, this.config.selector) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || defaults.height;
        this.config.events = {};
        this.config.events.down = config.events.down || defaults.events.down;
        this.config.events.up = config.events.up || defaults.events.up;
        this.config.events.over = config.events.over || defaults.events.over;
        this.config.events.click = config.events.click || defaults.events.click;
        this.config.events.leave = config.events.leave || defaults.events.leave;
        this.config.colorScale = config.colorScale || defaults.colorScale;
        
        this.config.x = {};
        this.config.x.type = config.x.type || defaults.axis.x.type;
        this.config.x.format = config.x.format || defaults.axis.x.format;
        this.config.y = {};
        this.config.y.type = config.y.type || defaults.axis.y.type;
        this.config.y.format = config.y.format || defaults.axis.x.format;
    }
}