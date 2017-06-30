import SvgStrategyHeatmap from '../svg/strategies/SvgStrategyHeatmap';
import { defaults } from '../utils/defaults/heatmap';
import { copy, isValuesInObjectKeys } from '../utils/functions';
import Chart from './Chart';

class Heatmap extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyHeatmap,
            data,
            userConfig,
            defaults
        );
    }
}

export default Heatmap;
