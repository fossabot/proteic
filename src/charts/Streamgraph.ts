import Chart from "./Chart";
import SvgStrategyStreamgraph from "../svg/strategies/SvgStrategyStreamgraph";
import {defaults} from "../utils/defaults/streamgraph";
import {copy} from "../utils/functions";

class Streamgraph extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyStreamgraph(),
            data,
            userConfig,
            defaults
        );
    }

    public keepDrawing(datum: any) {
        let datumType = datum.constructor;

        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }
}

export default Streamgraph;