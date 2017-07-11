import Config from '../Config';
import { nest, timeParse } from 'd3';

export class Data {

    private _originalDatum: Array<any>;

    private config: Config;

    private calculations: any = {};


    constructor(datum: Array<any>, config: Config) {
        this._originalDatum = datum;
        this.config = config;
    }

    public static empty(config: Config): Data {
        return new Data([], config)
    }

    public performCalculations() {
        console.time('calculations');

        if (!this._originalDatum || this._originalDatum == null) {
            throw Error(`You cannot perform calculations on data since your data is null`);
        }

        this.calculations.min = {};
        this.calculations.max = {};
        let pX = this.config.get('propertyX');
        let pY = this.config.get('propertyY');
        let pZ = this.config.get('propertyZ');

        let pStart = this.config.get('propertyStart');
        let pEnd = this.config.get('propertyEnd');

        let xAxisType = this.config.get('xAxisType');
        let xAxisFormat = this.config.get('xAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');

        if (pStart) {
            this.calculations.max[pStart] = Number.MIN_VALUE;
            this.calculations.min[pStart] = Number.MAX_VALUE;
        }
        if (pEnd) {
            this.calculations.max[pEnd] = Number.MIN_VALUE;
            this.calculations.min[pEnd] = Number.MAX_VALUE;
        }
        if (pX) {
            this.calculations.min[pX] = Number.MAX_VALUE;
            this.calculations.max[pX] = Number.MIN_VALUE;
        }
        if (pY) {
            this.calculations.min[pY] = Number.MAX_VALUE;
            this.calculations.max[pY] = Number.MIN_VALUE;
        }

        if (pZ) {
            this.calculations.min[pZ] = Number.MAX_VALUE;
            this.calculations.max[pZ] = Number.MIN_VALUE;
        }


        for (let i = 0; i < this._originalDatum.length; i++) {
            let datum = this._originalDatum[i];

            if (xAxisType === 'time') {
                if (pX) {
                    datum[pX] = timeParse(xAxisFormat)(datum[pX]);
                }
                if (pStart) {
                    datum[pStart] = timeParse(xAxisFormat)(datum[pStart]);
                }
                if (pEnd) {
                    datum[pEnd] = timeParse(xAxisFormat)(datum[pEnd]);
                }
            }
            else if (xAxisType === 'linear') {
                if (pX) {
                    datum[pX] = +datum[pX];
                }
                if (pStart) {
                    datum[pStart] = +datum[pStart];
                }
                if (pEnd) {
                    datum[pEnd] = +datum[pEnd];
                }
            }
            if (yAxisType === 'time') {
                if (pY) {
                    datum[pY] = timeParse(yAxisFormat)(datum[pY]);
                }
            }
            else if (yAxisType === 'linear') {
                if (pY) {
                    datum[pY] = +datum[pY];
                }
            }

            // Max and Mins
            if (datum[pY]) {
                if (datum[pY] > this.calculations.max[pY]) {
                    this.calculations.max[pY] = datum[pY];
                }
                if (datum[pY] < this.calculations.min[pY]) {
                    this.calculations.min[pY] = datum[pY];
                }
            }

            if (datum[pX]) {
                if (datum[pX] > this.calculations.max[pX]) {
                    this.calculations.max[pX] = datum[pX];
                }
                if (datum[pX] < this.calculations.min[pX]) {
                    this.calculations.min[pX] = datum[pX];
                }
            }

            if (datum[pStart]) {
                if (datum[pStart] < this.calculations.min[pStart]) {
                    this.calculations.min[pStart] = datum[pStart];
                }
                if (datum[pStart] > this.calculations.max[pStart]) {
                    this.calculations.max[pStart] = datum[pStart];
                }
            }

            if (datum[pEnd]) {
                if (datum[pEnd] < this.calculations.min[pEnd]) {
                    this.calculations.min[pEnd] = datum[pEnd];
                }

                if (datum[pEnd] > this.calculations.max[pEnd]) {
                    this.calculations.max[pEnd] = datum[pEnd];
                }
            }

            if (datum[pZ]) {
                if (datum[pZ] < this.calculations.min[pZ]) {
                    this.calculations.min[pZ] = datum[pZ];
                }

                if (datum[pZ] > this.calculations.max[pZ]) {
                    this.calculations.max[pZ] = datum[pZ];
                }
            }
            ////// SORT FUNCTIONS /////

            //console.log(datum);

        }


        console.timeEnd("calculations");

    }

    public get originalDatum() {
        return this._originalDatum;
    }

    public getCalculationOnProperty(calc: string, property: string) {
        if (this.calculations.hasOwnProperty(calc)) {
            if (this.calculations[calc].hasOwnProperty(property)) {
                return this.calculations[calc][property];
            }
        }
    }
}