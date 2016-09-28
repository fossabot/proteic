import {SvgChart} from './svg'
import {defaults} from '../utils/defaults/streamgraph'
import {SvgContainer} from './components/svgContainer'
import {XYAxes} from './components/xyAxes'
import {Streamset} from './components/streamset'
import {Legend} from './components/legend'
import {simple2stacked} from '../utils/dataTransformation'

export class SvgStackedAreaStrategy extends SvgChart {

    constructor(chartContext) {
        super(chartContext);
        var config = this.config;

        this.svgContainer = new SvgContainer(config);
        this.axes = new XYAxes('time', 'linear', config);

        this.streams = new Streamset(this.axes.x.xAxis, this.axes.y.yAxis);

        this.legend = new Legend();

        //Include components in the chart container
        this.svgContainer
            .add(this.axes)
            .add(this.legend)
            .add(this.streams);
    }

    draw(data) {
        var svg = this.svgContainer.svg
            , config = this.config
            , bbox = null
            , keys = d3.map(data, (d) => d.key).keys()
            , data4stack = simple2stacked(data)
            , stack = d3.stack()
                .keys(keys)
                .value((d, k) => d.value[k])
                .order(d3.stackOrderInsideOut)
                .offset(d3.stackOffNone)
            , dataSeries = stack(data4stack);

        bbox = this._getDomainBBox(data, dataSeries);

        this.axes.updateDomainByBBox(bbox);
        this.axes.transition(svg, 200);

        // Update legend
        this.legend.update(svg, config, data);

        // Update streams
        this.streams.update(svg, config, dataSeries);
    }


    _getDomainBBox(data, dataSeries) {
        var minX = d3.min(data, (d) => new Date(d.x))
            , maxX = d3.max(data, (d) => new Date(d.x))
            , minY = d3.min(dataSeries, (serie) => d3.min(serie, (d) => d[0]))
            , maxY = d3.max(dataSeries, (serie) => d3.max(serie, (d) => d[1]));

        return [minX, maxX, minY, maxY];
    }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
    _loadConfigOnContext(config) {
        config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
        if (!config.events) {
            config.events = {};
        }
        if (!config.markers) {
            config.markers = {};
        }
        if (!config.xaxis) {
            config.xaxis = {};
        }
        if (!config.yaxis) {
            config.yaxis = {};
        }
        if (!config.x) {
            config.x = {};
        }
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || defaults.selector;
        this.config.margin = config.margin || defaults.margin;
        this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
            : this._calculateWidth(defaults.width) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || defaults.height;
        this.config.ticks = config.ticks || defaults.ticks;
        this.config.xticks = config.xaxis.ticks || defaults.xaxis.ticks;
        this.config.yticks = config.yaxis.ticks || defaults.yaxis.ticks;
        this.config.tickLabel = config.tickLabel || defaults.tickLabel;
        this.config.transitionDuration = config.transitionDuration || defaults.transitionDuration;
        this.config.tip = config.tooltip || defaults.tooltip;
        this.config.events = {};
        this.config.events.down = config.events.down || defaults.events.down;
        this.config.events.up = config.events.up || defaults.events.up;
        this.config.events.over = config.events.over || defaults.events.over;
        this.config.events.click = config.events.click || defaults.events.click;
        this.config.events.leave = config.events.leave || defaults.events.leave;
        this.config._sortData = config.sortData || defaults.sortData;
        this.config.style = config.style || defaults.style;
        this.config.colorScale = config.colorScale || defaults.colorScale;
        this.config.xAxisLabel = config.xaxis.label || defaults.xaxis.label;
        this.config.yAxisLabel = config.yaxis.label || defaults.yaxis.label;
        this.config.colorScale = config.colorScale || defaults.colorScale;
        this.config.xDateformat = config.xDateFormat || defaults.xDateFormat;
    }
}