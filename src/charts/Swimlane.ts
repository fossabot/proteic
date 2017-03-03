import Chart from "./Chart";
import SvgStrategySwimlane from "../svg/strategies/SvgStrategySwimlane";
import {defaults} from "../utils/defaults/swimlane";
import {copy} from "../utils/functions";

class Swimlane extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(SvgStrategySwimlane, userConfig, data, defaults);
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

export default Swimlane;