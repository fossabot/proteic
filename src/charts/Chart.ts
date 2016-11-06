import { SvgContext } from '../svg/strategies/SvgStrategy'
import SvgChart from '../svg/base/SvgChart';
import Config from '../Config';
import { copy } from '../utils/functions';

abstract class Chart {

    private context: SvgContext;
    protected config: Config;
    private data: [{}];

    constructor(strategy: SvgChart, data: any, userConfig: any) {
        this.config = this.loadConfigFromUser(userConfig);
        this.context = new SvgContext(strategy, this.config);
        this.data = data;
    }

    public draw(data: [{}] = this.data) {
        //TODO: SPLIT DATA INTO SMALL CHUNKS (stream-like). 
        this.context.draw(copy(data));
        this.data = data;
    }

    protected abstract loadConfigFromUser(userData: { [key: string]: any; }): Config;

}

export default Chart;