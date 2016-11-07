import XYAxes from '../components/XYAxes';
import Pointset from '../components/Pointset';
import Legend from '../components/Legend';

import Config from '../../Config';
import SvgChart from '../base/SvgChart';
import { sortByField } from '../../utils/dataSorting';
import { convertByXYFormat } from '../../utils/dataTransformation';

class SvgStrategyScatterplot extends SvgChart {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategyScatterplot
     */
    private axes: XYAxes;

    /**
     * 
     * Set of points
     * 
     * @private
     * @type {Pointset}
     * @memberOf SvgStrategyScatterplot
     */
    private markers: Pointset;

    private legend: Legend;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.markers = new Pointset(this.axes.x, this.axes.y);
    }

    public draw(data: [{}]) {
        let xAxisFormat = this.config.get('xAxisFormat'),
            xAxisType = this.config.get('xAxisType'),
            yAxisFormat = this.config.get('yAxisFormat'),
            yAxisType = this.config.get('yAxisType');

        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType);
        sortByField(data, 'x');

        this.container.updateComponents(data);
    }


    public initialize(): void {
        super.initialize();
        let legend = this.config.get('legend');

        this.container.add(this.axes).add(this.markers);

        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    }
}

export default SvgStrategyScatterplot;