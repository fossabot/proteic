import { Data } from './../../data/Data';
import Config from '../../Config';
import { sortByField } from '../../utils/data/sorting';
import { convertByXYFormat } from '../../utils/data/transforming';
import SvgStrategy from '../base/SvgStrategy';
import HistogramBarset from '../components/HistogramBarset';
import Legend from '../components/Legend';
import XYAxes from '../components/XYAxes';

class SvgStrategyHistogram extends SvgStrategy {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategyHistogram
     */
    private axes: XYAxes;

    /**
     * 
     * Set of bars. The numbers of bars depends on data. Every draw() call lines are automatically updated.
     * @private
     * @type {Lineset}
     * @memberOf SvgStrategyHistogram
     */
    private bars: HistogramBarset;

    private legend: Legend;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.bars = new HistogramBarset(this.axes.x, this.axes.y);
    }

    public draw(data: Data) {
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        this.container.add(this.axes).add(this.bars);
    }
}

export default SvgStrategyHistogram;
