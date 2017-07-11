import { Data } from './../../data/Data';
import Config from '../../Config';
import { sortByField } from '../../utils/data/sorting';
import { convertPropretiesToTimeFormat } from '../../utils/data/transforming';
import SvgStrategy from '../base/SvgStrategy';
import Legend from '../components/Legend';
import Streamset from '../components/Streamset';
import XYAxes from '../components/XYAxes';

class SvgStrategyStreamgraph extends SvgStrategy {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategyStreamgraph
     */
    private axes: XYAxes;

    private legend: Legend;

    private streams: Streamset;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.streams = new Streamset(this.axes);
    }

    public draw(data: Data) {
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        sortByField(data.originalDatum, propertyX);

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let markerSize = this.config.get('markerSize');
        let areaOpacity = this.config.get('areaOpacity');
        let legend = this.config.get('legend');

        this.container.add(this.axes).add(this.streams);

        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    }
}

export default SvgStrategyStreamgraph;
