import XYAxes from '../components/XYAxes';
import Lineset from '../components/Lineset';

import Config from '../../Config';
import SvgChart from '../base/SvgChart';

class SvgStrategyLinechart extends SvgChart {
    /**
     * 
     * XY Axes. Horizontal and vertical references
     * 
     * @private
     * @type {XYAxes}
     * @memberOf SvgStrategyLinechart
     */
    private axes: XYAxes;

    /**
     * 
     * Set of lines. The numbers of lines depends on data. Every draw() call lines are automatically updated.
     * @private
     * @type {Lineset}
     * @memberOf SvgStrategyLinechart
    
     */
    private lines: Lineset;

    constructor() {
        super();

        this.axes = new XYAxes();
        this.lines = new Lineset(this.axes);
    }

    public draw(data: [{}]) {
        this.container.updateComponents(data);
    }


    public initialize(): void {
        super.initialize();
        this.container.add(this.axes).add(this.lines);
    }
}

export default SvgStrategyLinechart;