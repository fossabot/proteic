import Config from '../../Config';
import { sortByField } from '../../utils/data/sorting';
import { convertByXYFormat } from '../../utils/data/transforming';
import SvgStrategy from '../base/SvgStrategy';
import Barset from '../components/Barset';
import Legend from '../components/Legend';
import XYAxes from '../components/XYAxes';

class SvgStrategyBarchart extends SvgStrategy {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategyBarchart
     */
    private axes: XYAxes;

    /**
     * 
     * Set of bars. The numbers of bars depends on data. Every draw() call lines are automatically updated.
     * @private
     * @type {Lineset}
     * @memberOf SvgStrategyBarchart
     */
    private bars: Barset;
    private legend: Legend;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.bars = new Barset(this.axes.x, this.axes.y);
    }

    public draw(data: [{}]) {
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType, propertyX, propertyY);
        sortByField(data, propertyX);

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let legend = this.config.get('legend');
        this.container.add(this.axes).add(this.bars);

        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    }
}

export default SvgStrategyBarchart;
