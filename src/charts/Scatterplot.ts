import SvgStrategyScatterplot from '../svg/strategies/SvgStrategyScatterplot';
import { defaults } from '../utils/defaults/scatterplot';
import { copy, isValuesInObjectKeys } from '../utils/functions';
import Chart from './Chart';

class Scatterplot extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyScatterplot,
            data,
            userConfig,
            defaults
        );
    }
}

export default Scatterplot;
