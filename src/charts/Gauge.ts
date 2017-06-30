import SvgStrategyGauge from '../svg/strategies/SvgStrategyGauge';
import { defaults } from '../utils/defaults/gauge';
import Chart from './Chart';

class Gauge extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyGauge,
            data,
            userConfig,
            defaults
        );
    }

    public keepDrawing(datum: any) {
        this.data = [datum[0]];
        super.draw();
    }
}

export default Gauge;
