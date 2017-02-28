import Chart from "./Chart";
import {defaults} from "../utils/defaults/heatmap";
import SvgStrategyHeatmap from "../svg/strategies/SvgStrategyHeatmap";
import {copy, isValuesInObjectKeys} from "../utils/functions";

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
        let datumType = datum.constructor,
            nullValues = this.config.get('nullValues'),
            keys = [
                this.config.get('propertyX'),
                this.config.get('propertyY'),
                this.config.get('propertyKey')
            ];

        if(datumType === Array) {
            let filteredDatum = datum.filter(isValuesInObjectKeys(nullValues, keys));
            console.log(datum);
            console.log(filteredDatum);
            console.log('-----------');
            if (this.data) {
                this.data = this.data.concat(filteredDatum);
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