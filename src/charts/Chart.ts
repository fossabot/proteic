import { SvgContext } from '../svg/strategies/SvgStrategy'
import SvgChart from '../svg/base/SvgChart';
import Config from '../Config';
import { copy } from '../utils/functions';
import Datasource from '../datasources/Datasource';

import {dispatch} from 'd3';

abstract class Chart {

    private context: SvgContext;
    protected config: Config;
    protected data: [{}];
    private ds: Datasource = null;
    private dispatcher: any = dispatch('onmessage', 'onopen', 'onerror');


    constructor(strategy: SvgChart, data: any, userConfig: any) {
        this.config = this.loadConfigFromUser(userConfig);
        this.context = new SvgContext(strategy, this.config);
        this.data = data;
    }

    public draw(data: [{}] = this.data) { //TODO: SPLIT DATA INTO SMALL CHUNKS (stream-like). 
        this.context.draw(copy(data));
        this.data = data;
    }

    /**
     * 
     * Configure a datasources for the current instance. Datasources allows data to be catached from many sources, such as websockets endpoints, HTTP urls, etc.
     * @param {Datasource} ds A datasource
     * 
     * @memberOf Chart
    
     */
    public datasource(ds: Datasource) {
        this.ds = ds;

        this.ds.configure(this.dispatcher);

        this.dispatcher.on('onmessage', (data) => this.keepDrawing(data));

        this.dispatcher.on('onopen', (event) => {
            console.log('onopen', event);
        });

        this.dispatcher.on('onerror', (error) => {
            console.log('onerror', error);
        });

    }

    protected abstract loadConfigFromUser(userData: { [key: string]: any; }): Config;

    protected abstract keepDrawing(datum: any);

}

export default Chart;