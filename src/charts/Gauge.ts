import Chart from './Chart';
import SvgStrategyGauge from '../svg/strategies/SvgStrategyGauge';
import { defaults } from '../utils/defaults/gauge';

class Gauge extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyGauge,
            data,
            userConfig,
            defaults
        );

        this.storedData = [];
    }

    private storedData: any[]; // TODO move to Chart.ts

    public keepDrawing(datum: any) {
        let pause: boolean = this.config.get('pause');

         if (!pause) {
             if (this.storedData.length == 0) {
                 this.data = [datum[0]];
                 super.draw();
             } else {
                this.storedData.push(datum[0]); // To store incoming data when drawing paused data

                for (let i = 0; i < this.storedData.length; i++) {
                    this.data = [this.storedData.shift()];
                    super.draw();
                }
            }
        } else {
            this.storedData.push(datum[0]);
        }

    }
}

export default Gauge;
