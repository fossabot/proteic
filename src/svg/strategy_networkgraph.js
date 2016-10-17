import {SvgContainer} from './components/svgContainer';
import {defaults} from '../utils/defaults/networkgraph';
import {calculateWidth} from '../utils/screen';
import {Nodeset} from './components/nodeset';

export class SvgNetworkgraphStrategy {

  constructor(context) {
   
    this.nodeset = new Nodeset(this.config);

    //Include components in the chart container
    this.svgContainer
      .add(this.nodeset);
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    let svg = this.svgContainer.svg,
      config = this.config,
      width = config.width,
      height = config.height;

    this.nodeset.update(svg, config, data);
  }

  /**
   * This method adds config options to the chart context.
   * @param  {Object} config Config object
   */
  _loadConfig(config) {
    this.config = {};
    this.config.margin = config.margin || defaults.margin;
    this.config.selector = config.selector || defaults.selector;
    this.config.width = config.width ? calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
      : calculateWidth(defaults.width, this.config.selector) - this.config.margin.left - this.config.margin.right;
    this.config.height = config.height || defaults.height;

  }
}