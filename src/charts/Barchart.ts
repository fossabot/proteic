import SvgStrategyBarchart from '../svg/strategies/SvgStrategyBarchart';
import { defaults } from '../utils/defaults/barchart';
import { copy, isValuesInObjectKeys } from '../utils/functions';
import Chart from './Chart';

/**
 * A Bar chart visualization
 */
class Barchart extends Chart {

    /**
     * 
     * Create a Bar chart with the given data and configuration defined by the user.
     * 
     * @param {*} data - The data to be drawn in the chart.
     * @param {*} userConfig - The user defined configuration for the chart.
     * @returns {void}
     */
    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyBarchart,
            data,
            userConfig,
            defaults
        );
    }

    public fire(event: string, data: string) {
        if (event === 'transition') {
            if (data === 'grouped') {
                this.config.put('stacked', false);
            } else if (data === 'stacked') {
                this.config.put('stacked', true);
            }
            this.draw();
        }
    }
}

export default Barchart;
