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

    public draw(data: [{}]) {
        let xAxisFormat = this.config.get('xAxisFormat'),
            propertyStart = this.config.get('propertyStart'),
            propertyEnd = this.config.get('propertyEnd'),
            xAxisType = this.config.get('xAxisType');
        
        if (xAxisType === 'time') {
            convertPropretiesToTimeFormat(data, [propertyStart, propertyEnd], xAxisFormat);
        }

        sortByField(data, propertyStart);

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let markerSize = this.config.get('markerSize'),
            areaOpacity = this.config.get('areaOpacity'),
            legend = this.config.get('legend'),
            colorScaleType = this.config.get('colorScaleType');

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
