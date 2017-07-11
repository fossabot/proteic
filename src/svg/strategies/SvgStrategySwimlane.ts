import { Data } from './../../data/Data';
import Config from '../../Config';
import { sortByField } from '../../utils/data/sorting';
import { convertPropretiesToTimeFormat } from '../../utils/data/transforming';
import SvgStrategy from '../base/SvgStrategy';
import ColorLegend from '../components/ColorLegend';
import Legend from '../components/Legend';
import TimeBoxset from '../components/Timeboxset';
import XYAxes from '../components/XYAxes';

class SvgStrategySwimlane extends SvgStrategy {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategySwimlane
     */
    private axes: XYAxes;

    private boxes: TimeBoxset;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.boxes = new TimeBoxset(this.axes);
    }

    public draw(data: Data) {
        let xAxisFormat = this.config.get('xAxisFormat');
        let propertyStart = this.config.get('propertyStart');
        let propertyEnd = this.config.get('propertyEnd');
        let xAxisType = this.config.get('xAxisType');
        
        sortByField(data.originalDatum, propertyStart);
        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let markerSize = this.config.get('markerSize');
        let areaOpacity = this.config.get('areaOpacity');
        let legend = this.config.get('legend');
        let colorScaleType = this.config.get('colorScaleType');

        this.container.add(this.axes).add(this.boxes);

        if (legend) {
            switch (colorScaleType) {
                case 'categorical': 
                    this.container.add(new Legend());
                    break;
                case 'sequential':
                    this.container.add(new ColorLegend());
                    break;
            }
            
        }
    }
}

export default SvgStrategySwimlane;
