import Chart from './Chart';
import SvgStrategyLinechart from '../svg/strategies/SvgStrategyLinechart';

class Linechart extends Chart {

    constructor() {
        super(new SvgStrategyLinechart());
    }

}

export default Linechart;