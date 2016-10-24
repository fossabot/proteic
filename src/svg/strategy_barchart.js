import {defaults} from '../utils/defaults/barchart';
import {SvgAxis} from './base/svgAxis';
import {XYAxes} from './components/xyAxes';
import {Barset} from './components/barset';
import {Legend} from './components/legend';
import {simple2stacked} from '../utils/dataTransformation';
import {map, stack as d3Stack, stackOrderNone, max} from 'd3';

export class SvgBarchartStrategy extends SvgAxis {

  constructor(context) {
    super(context);

    this.axes = new XYAxes('categorical', 'linear', this.config);
    this.bars = new Barset(this.axes.x.xAxis, this.axes.y.yAxis);

    this.legend = new Legend();

    this.svgContainer
      .add(this.axes)
      .add(this.bars)
      .add(this.legend);

  }


	/**
	 * Renders a barchart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data = this.data) { 
    let svg = this.svgContainer.svg,
      config = this.config,
      keys = map(data, (d) => d.key).keys(),
      data4stack = simple2stacked(data),
      data4render = null,
      isStacked = this.config.stacked,
      stack = d3Stack().keys(keys)
        .value((d, k) => d.value[k])
        .order(stackOrderNone),
      yMin = 0,
      yMax = 0,
      method = isStacked ? 'stacked' : 'grouped',
      dataSeries = stack(data4stack),
      needRescaling = this.config.needRescaling;

    //rescale, if needed.
    if (needRescaling) {
      this.rescale();
    }


    yMax = isStacked ?
      max(dataSeries, (serie) => max(serie, (d) => d[1])) :
      max(data, (d) => d.y);

    this.axes.updateDomainByKeysAndBBox(map(data, (d) => d.x).keys(), [yMin, yMax]);
    this.axes.transition(svg, 200);

    data4render = isStacked ? dataSeries : data;

    this.bars.update(svg, config, data4render, method);

    this.legend.update(svg, config, data);

    this.data = data; // TODO: ? 

  }


  transition2Stacked() {
    this.config.stacked = true;
  }

  transition2Grouped() {
    this.config.stacked = false;
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfig(config) {
    super._loadConfig(config, defaults);
    //Stacked
    this.config.stacked = typeof (config.stacked) === 'undefined' ? defaults.stacked : config.stacked;    return this;
  }
}