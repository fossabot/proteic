import {SvgContext} from '../svg/strategies/SvgStrategy'
import SvgChart from '../svg/base/SvgChart';
import Config from '../Config';

abstract class Chart {

    private context: SvgContext;
    private config: Config;

    constructor(strategy: SvgChart) {
        this.config = this.loadConfigFromUser({}); // TODO : RECOGER PARAMETROS REALES        
        this.context = new SvgContext(strategy, this.config);
    }

    public draw(data: [{}]) {
        this.context.draw(data);
    }

    protected abstract loadConfigFromUser(userData: { [key: string]: any; }): Config;

}

export default Chart;