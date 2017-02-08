import Chart from "./Chart";
import {defaults} from "../utils/defaults/heatmap";
import SvgStrategyHeatmap from "../svg/strategies/SvgStrategyHeatmap";
import {copy} from "../utils/functions";

class Heatmap extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyHeatmap(),
            data,
            userConfig,
            defaults
        );
    }

    public keepDrawing(datum: any): void {
        let datumType = datum.constructor;

        if(datumType === Array) {
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

export default Heatmap;