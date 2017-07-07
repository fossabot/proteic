import Config from '../../Config';
import { sortByField } from '../../utils/data/sorting';
import { convertByXYFormat } from '../../utils/data/transforming';
import SvgStrategy from '../base/SvgStrategy';
import Annotations from '../components/Annotations';
import CanvasPointset from '../components/CanvasPointset';
import Legend from '../components/Legend';
import Pointset from '../components/Pointset';
import XYAxes from '../components/XYAxes';

class SvgStrategyScatterplot extends SvgStrategy {
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

    /**
     *
     * Set of points
     *
     * @private
     * @type {CanvasPointset}
     * @memberOf SvgStrategyScatterplot
     */
    private canvasMarkers: CanvasPointset;
    private legend: Legend;
    private annotations: any;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.markers = new Pointset(this.axes.x, this.axes.y);
        this.canvasMarkers = new CanvasPointset(this.axes.x, this.axes.y);
    }

    public draw(data: [{}], events: Map<string, any>) {
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        convertByXYFormat(data, xAxisFormat, xAxisType, yAxisFormat, yAxisType, propertyX, propertyY);
        sortByField(data, propertyX);

        this.container.updateComponents(data, events);
    }

    public initialize(): void {
        super.initialize();
        let legend = this.config.get('legend');

        this.container.add(this.axes);

        if (this.config.get('canvas')) {
            this.container.add(this.canvasMarkers);
        } else {
            this.container.add(this.markers);
        }

        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    }
}

export default SvgStrategyScatterplot;
