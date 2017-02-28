import { SvgContext } from "../svg/strategies/SvgStrategy";
import SvgChart from "../svg/base/SvgChart";
import Config from "../Config";
import { copy } from "../utils/functions";
import { throwError } from "../utils/error";
import Datasource from "../datasources/Datasource";
import WebsocketDatasource from "../datasources/WebsocketDatasource";
import { Subscription } from 'rxjs';

import { calculateWidth } from "../utils/screen";
import StreamingStrategy from './enums/StreamingStrategy';

abstract class Chart {

    private context: SvgContext;
    protected config: Config;
    protected data: any;
    private subscription: Subscription;

    protected streamingStrategy: StreamingStrategy;

    constructor(strategy: SvgChart, data: any, userConfig: any, defaults: any) {
        this.config = this.loadConfigFromUser(userConfig, defaults);
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
    public datasource(ds: WebsocketDatasource) {
        let subscription: Subscription = ds.subscription().subscribe(
            (data: any) => this.keepDrawing(data),
            (e: any) => throwError(e),
            () => console.log('Completed subject')
        );

        this.subscription = subscription;
    }

    public removeDatasource() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    protected loadConfigFromUser(userData: any, defaults: any): Config {
        let config = new Config();
        for (let v in defaults) {
            config.put(v, (v in userData) ? userData[v] : defaults[v]);
        }
        let width = config.get('width');
        width = calculateWidth(width, config.get('selector')) - config.get('marginLeft') - config.get('marginRight')
        config.put('width', width);
        return config;
    }

    protected abstract keepDrawing(datum: any): void;
}

export default Chart;