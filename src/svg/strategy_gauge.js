import {defaults} from '../utils/defaults/gauge';
import {SvgContainer} from './components/svgContainer';
import {Dial} from './components/dial';
import {DialNeedle} from './components/dialNeedle';
import {TextIndicator} from './components/textIndicator';
import {calculateWidth} from '../utils/screen';

export class SvgGaugeStrategy {
  constructor(chartContext) {
    this._loadConfigOnContext(chartContext.config);

    var config = this.config;

    this.svgContainer = new SvgContainer(config);
    this.dial = new Dial('linear', config);
    this.needle = new DialNeedle('linear', config);

    this.svgContainer
      .add(this.dial)
      .add(this.needle);

    if (config.numericIndicator) {
      let r = (
          (config.width > config.height)
            ? config.height
            : config.width
        ) / 2;
      let indicatorOffset = r + 75;
      config.textIndicatorTranslation = 'translate(' + r + ',' + indicatorOffset + ')';
      this.textIndicator = new TextIndicator(config);
      this.svgContainer.add(this.textIndicator);
    }
  }

	/**
	 * Renders a gauge chart based on data object
	 * @param  {Object} data Data Object. Contains a numeric value.
	 *
	 */
  draw(data) {
    let datum = data[data.length - 1];
    var svg = this.svgContainer.svg,
      config = this.config;

    this.needle.update(svg, config, data);
    if (config.numericIndicator) {
      this.textIndicator.update(svg, datum.x, config.label);
    }
  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    this.config = {};
    this.config.cType = this.constructor.name;
    this.config.selector = config.selector || defaults.selector;
    this.config.margin = config.margin || defaults.margin;
    this.config.width = config.width ? calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
      : calculateWidth(defaults.width, this.config.selector) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults.height;
    this.config.ticks = config.ticks || defaults.ticks;
    this.config.tickLabel = config.tickLabel || defaults.tickLabel;
    this.config.transitionDuration = config.transitionDuration || defaults.transitionDuration;
    this.config.tip = config.tooltip || defaults.tooltip;
    this.config._sortData = config.sortData || defaults.sortData;
    this.config.style = config.style || defaults.style;
    this.config.colorScale = config.colorScale || defaults.colorScale;
    this.config.x = {};

    this.config.minLevel = config.minLevel || defaults.minLevel;
    this.config.maxLevel = config.maxLevel || defaults.maxLevel;
    this.config.minAngle = config.minAngle || defaults.minAngle;
    this.config.maxAngle = config.maxAngle || defaults.maxAngle;
    this.config.ticks = config.ticks || defaults.ticks;
    this.config.ringWidth = config.ringWidth || defaults.ringWidth;
    this.config.ringMargin = config.ringMargin || defaults.ringMargin;
    this.config.labelInset = config.labelInset || defaults.labelInset;
    this.config.needleNutRadius = config.needleNutRadius || defaults.needleNutRadius;
    this.config.needleLenghtRatio = config.needleLenghtRatio || defaults.needleLenghtRatio;
    this.config.invertColorScale = typeof (config.invertColorScale) === 'undefined' ? defaults.invertColorScale : config.invertColorScale;
    this.config.numericIndicator = typeof (config.numericIndicator) === 'undefined' ? defaults.numericIndicator : config.numericIndicator;
    this.config.label = config.label || defaults.label;
    //Just for testing purposes
    return this;
  }

}