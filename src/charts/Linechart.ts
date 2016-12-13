import Chart from './Chart';
import SvgStrategyLinechart from '../svg/strategies/SvgStrategyLinechart';
import Config from '../Config';
import { defaults } from '../utils/defaults/linechart';
import { copy } from '../utils/functions';

class Linechart extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyLinechart(),
            data,
            userConfig,
            defaults
        );
    }

    public keepDrawing(datum: any) {
        var datumType = datum.constructor;

        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }

}

export default Linechart;