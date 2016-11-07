
import Config from '../../Config';
import SvgChart from '../base/SvgChart';
import { sortByField } from '../../utils/dataSorting';
import { convertByXYFormat } from '../../utils/dataTransformation';
import Dial from '../components/Dial';
import DialNeedle from '../components/DialNeedle';

class SvgStrategyGauge extends SvgChart {

    private dial: Dial;
    private dialNeedle: DialNeedle;


    constructor() {
        super();
        this.dial = new Dial();
        this.dialNeedle = new DialNeedle();
    }

    public draw(data: [{}]) {
        this.container.updateComponents(data);
    }


    public initialize(): void {
        super.initialize();
        this.container.add(this.dial).add(this.dialNeedle);
    }
}

export default SvgStrategyGauge;