import Chart from "./Chart";
import SvgStrategyLinechart from "../svg/strategies/SvgStrategyLinechart";
import {defaults} from "../utils/defaults/linechart";
import {copy, isValuesInObjectKeys} from "../utils/functions";

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
        let nullValues = this.config.get('nullValues');
        let maxNumberOfElements: number = this.config.get('maxNumberOfElements'),
            numberOfElements = this.data.length,
            datumType = datum.constructor,
            keys = [
                this.config.get('propertyX'),
                this.config.get('propertyY'),
                this.config.get('propertyKey')
            ];


        if (datumType === Array) {
            let filteredDatum = datum.filter(isValuesInObjectKeys(nullValues, keys));
            console.log(datum);
            console.log(filteredDatum);
            console.log('---------------');
            this.data = this.data.concat(filteredDatum);
        }
        else {
                                        let add = true;

            for (let i of nullValues) {

                if (i == datum[this.config.get('propertyX')] ||
                 i == datum[this.config.get('propertyY')]) {
                        console.log('null');
                     add = false;
                 }
                  }
                 if (add) {
                    //  console.log(datum);
                     this.data.push(datum);
                
            }
            
        }
        //Detect excess of elements given a maxNumberOfElements property
        if (numberOfElements > maxNumberOfElements) {
            let position = numberOfElements - maxNumberOfElements;
            this.data = this.data.slice(position);
        }

        this.draw(copy(this.data));
    }
}

export default Linechart;