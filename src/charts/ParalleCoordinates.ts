import Chart from './Chart';
import SvgStrategyParallelCoordinates from '../svg/strategies/SvgStrategyParallelCoordinates';
import { defaults } from '../utils/defaults/linechart';
import { copy, isValuesInObjectKeys } from '../utils/functions';

class parallelCoordinates extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            SvgStrategyParallelCoordinates,
            data,
            userConfig,
            defaults
        );
    }
}

export default parallelCoordinates;
