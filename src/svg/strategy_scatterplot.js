import { defaults } from '../utils/defaults/scatterplot';
import { SvgAxis } from './base/svgAxis';
import { XYAxes } from './components/xyAxes';
import { Lineset } from './components/lineset';
import { Legend } from './components/legend';
import { Areaset } from './components/areaset';
import { Pointset } from './components/pointset';
import { convertByXYFormat } from '../utils/dataTransformation';
import { sortByField } from '../utils/dataSorting';
import {min, max} from 'd3';

export class SvgScatterplotStrategy extends SvgAxis {

  constructor(context) {
    super(context);
    this.axes = new XYAxes(this.config.xAxisType, 'linear', this.config);
    this.points = new Pointset(this.axes.x, this.axes.y);
    this.legend = new Legend();
    //Include components in the chart container
    this.svgContainer
      .add(this.axes)
      .add(this.legend)
      .add(this.points);
  }

	/**
	 * Renders a scatterplot based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    let svg = this.svgContainer.svg,
      config = this.config,
      needRescaling = this.config.needRescaling,
      bbox = null;

    // //Transform data, if needed
    convertByXYFormat(data, config);

    //Sort data
    sortByField(data, 'x');

    //rescale, if needed.
    if (needRescaling) {
      this.rescale();
    }

    bbox = this._getDomainBBox(data);

    this.axes.updateDomainByBBox(bbox);

    //Create a transition effect for dial rescaling
    this.axes.transition(svg, 200);

    // Update legend
    this.legend.update(svg, config, data);

    // Update points
    this.points.update(svg, config, data);
  }

  _getDomainBBox(data) {
    var minX = min(data, (d) => d.x),
      maxX = max(data, (d) => d.x),
      minY = min(data, (d) => d.y),
      maxY = max(data, (d) => d.y);
    return [minX, maxX, minY, maxY];
  }

  _checkMarkers(config) {
    return config.markerSize > 0;
  }
  _checkArea(config) {
    return config.areaOpacity > 0;
  }

  /**
   * This method adds config options to the chart context.
   * @param  {Object} config Config object
   */
  _loadConfig(config) {
    super._loadConfig(config, defaults);
    //Markers
    this.config.markerOutlineWidth = config.markerOutlineWidth || defaults.markerOutlineWidth;
    this.config.markerShape = config.markerShape || defaults.markerShape;
    this.config.markerSize = (typeof config.markerSize === 'undefined' || config.markerSize < 0) ? defaults.markerSize : config.markerSize;
    //Area
    this.config.areaOpacity = (typeof config.areaOpacity === 'undefined' || config.markerSize < 0) ? defaults.areaOpacity : config.areaOpacity;
    return this;
  }
}