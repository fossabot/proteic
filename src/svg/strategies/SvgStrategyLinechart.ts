import {SvgStrategy} from './SvgStrategy';
import XYAxes from '../components/XYAxes';
import Lineset from '../components/Lineset';

import Config from '../../Config';
import SvgChart from '../base/SvgChart';

class SvgStrategyLinechart extends SvgChart implements SvgStrategy {

    private axes: XYAxes;
    private lines: Lineset;
    private config: Config;

    constructor(config: Config) {
        super(config);

        this.axes = new XYAxes(this.config);

        this.lines = new Lineset(this.config, this.axes);

        this.container
            .add(this.axes)
            .add(this.lines);
    }

    public draw() {
        window.console.log('drawing linechart');
    }
}

export default SvgStrategyLinechart;