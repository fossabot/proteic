import SvgStrategyPieChart from '../svg/strategies/SvgStrategyPieChart';
import { defaults } from '../utils/defaults/piechart';
import { copy } from '../utils/functions';
import Chart from './Chart';

class PieChart extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyPieChart,
            data,
            userConfig,
            defaults
        );
    }

    public keepDrawing(datum: any) {
        let datumType = datum.constructor;
        if (datumType === Array) {
            if (this.data) {
                this.data = this.data.concat(datum);
            } else {
                this.data = datum;
            }
        } else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }
}

export default PieChart;
