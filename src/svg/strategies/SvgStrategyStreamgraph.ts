import XYAxes from '../components/XYAxes';
import Legend from '../components/Legend';
import Streamset from '../components/Streamset';
import PauseSet from '../components/PauseSet';

import Config from '../../Config';
import SvgStrategy from '../base/SvgStrategy';
import { sortByField } from '../../utils/data/sorting';
import { convertPropretiesToTimeFormat } from '../../utils/data/transforming';

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

    private pauseButton: PauseSet;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.streams = new Streamset(this.axes);
    }

    public draw(data: [{}]) {
        let xAxisFormat = this.config.get('xAxisFormat'),
            xAxisType = this.config.get('xAxisType'),
            yAxisFormat = this.config.get('yAxisFormat'),
            yAxisType = this.config.get('yAxisType'),
            propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY');

        convertPropretiesToTimeFormat(data, [propertyX], xAxisFormat);

        sortByField(data, propertyX);

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let markerSize = this.config.get('markerSize'),
            areaOpacity = this.config.get('areaOpacity'),
            legend = this.config.get('legend'),
            pauseButton = this.config.get('pauseButton');

        this.container.add(this.axes).add(this.streams);

        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }

        if (pauseButton) {
            this.pauseButton = new PauseSet();
            this.container.add(this.pauseButton);
        }
    }
}

export default SvgStrategyStreamgraph;
