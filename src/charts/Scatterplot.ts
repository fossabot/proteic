import Chart from "./Chart";
import SvgStrategyScatterplot from "../svg/strategies/SvgStrategyScatterplot";
import {defaults} from "../utils/defaults/scatterplot";
import {copy, isValuesInObjectKeys} from "../utils/functions";

class Scatterplot extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(SvgStrategyScatterplot, userConfig, data, defaults);
    }

    public keepDrawing(datum: any) {
        let datumType = datum.constructor,
            nullValues = this.config.get('nullValues'),
            keys = [
                this.config.get('propertyX'),
                this.config.get('propertyY'),
                this.config.get('propertyKey')
            ];

        if (datumType === Array) {
            if (this.data) {
                let filteredDatum = datum.filter(isValuesInObjectKeys(nullValues, keys));
                this.data = this.data.concat(filteredDatum);
            } else {
                this.data = datum;
            }
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }
}

export default Scatterplot;