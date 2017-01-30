import Chart from "./Chart";
import {defaults} from "../utils/defaults/heatmap";
import SvgStrategyHeatmap from "../svg/strategies/SvgStrategyHeatmap";

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
        // TODO implement
    }

}

export default Heatmap;