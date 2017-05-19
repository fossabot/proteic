import { SvgContext } from "../svg/base/SvgContext";
import { copy, isValuesInObjectKeys, hasValuesWithKeys, filterKeys, melt } from "../utils/functions";
import { throwError } from "../utils/error";
import { Subscription } from 'rxjs';
import { calculateWidth } from "../utils/screen";

import StreamingStrategy from './enums/StreamingStrategy';
import Injector from '../MyInjector';
import Datasource from "../datasources/Datasource";
import WebsocketDatasource from "../datasources/WebsocketDatasource";
import Config from "../Config";
import SvgStrategy from "../svg/base/SvgStrategy";
import Globals from '../Globals';

abstract class Chart {

    private context: SvgContext;
    protected config: Config;
    protected data: any;
    private events: Map<string, any>;
    private subscription: Subscription;
    private _injector: Injector = new Injector();
    private strategy: SvgStrategy;

    protected streamingStrategy: StreamingStrategy;

    constructor(Class: { new (...args: any[]): SvgStrategy }, data: any, userConfig: any, defaults: any) {

        this.config = this.loadConfigFromUser(userConfig, defaults);
        this._injector = new Injector();

        this._instantiateInjections(Class);

        this.data = data;
        this.events = new Map();
    }

    private _instantiateInjections(Class: { new (...args: any[]): SvgStrategy }) {
        this._injector.mapValue('Config', this.config);

        //Instantiate SvgStrategy
        this.strategy = this._injector.instantiate(Class);
        this.strategy.initialize();

        this._injector.mapValue('Strategy', this.strategy);
        //Instantiate SvgContext
        this.context = this._injector.instantiate(SvgContext);
    }

    public annotations(annotations: any): Chart {
        this.config.put('annotations', annotations);
        return this;
    }

    public draw(data: [{}] = this.data, events: Map<string, any> = this.events) { //TODO: SPLIT DATA INTO SMALL CHUNKS (stream-like). 
        this.context.draw(copy(data), this.events);
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
        let annotations = this.config.get('annotations'),
            eventKeys: Array<string> = [];

        if (annotations) {
            annotations.forEach((a: any) => eventKeys.push(a.event))
        }

        let subscription: Subscription = ds.subscription().subscribe(
            (data: any) => {
                // Event detection
                for (let e of eventKeys) {
                    if (e in data) {
                        this.events.set(e, data[e]);
                        return;
                    }
                }
                // Wide data to narrow and draw
                let pivotVars = this.config.get('pivotVars');
                let keys = Object.keys(data);
                let varsInDatum = keys.filter((k) => pivotVars.indexOf(k) != -1);
                let ids = keys.filter((k) => pivotVars.indexOf(k) == -1);
                
                if(varsInDatum.length < 2) {
                    this.keepDrawing(data);
                } else {
                    this.keepDrawing(melt(
                        data, 
                        varsInDatum, 
                        ids, 
                        this.config.get('propertyKey'),
                        'value'
                    ));
                }
            },
            (e: any) => throwError(e),
            () => console.log('Completed subject')
        );

        this.subscription = subscription;
        setInterval(() => this.draw(copy(this.data)), Globals.DRAW_INTERVAL);

        return this;
    }

    /**
     * Pivot wide format data coming from the Datasource to narrow format.
     * 
     * Incoming data may contain mixed narrow and wide formats that will be
     * treated appropriately.
     */
    public pivot(vars: Array<string>): Chart {
        this.config.put('pivotVars', vars);
        return this;
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

    private cleanDatum(datum: any, dataKeys: Array<any>) {
        let cleanDatum = [],
            datumType = datum.constructor,
            nullValues = this.config.get('nullValues'),
            filteredDatum = filterKeys(datum, dataKeys);

        if (datumType === Array) {
            cleanDatum = datum.filter(isValuesInObjectKeys(nullValues, dataKeys));
        } else {
            if (!hasValuesWithKeys(filteredDatum, nullValues, dataKeys)) {
                cleanDatum.push(filteredDatum);
            }
        }

        return cleanDatum;
    }

    protected keepDrawing(datum: any): void {
        console.log(datum);
        let streamingStrategy = this.config.get('streamingStrategy'),
            maxNumberOfElements: number = this.config.get('maxNumberOfElements'),
            numberOfElements = this.data.length,
            propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            propertyZ = this.config.get('propertyZ'),
            propertyKey = this.config.get('propertyKey');

        let dataKeys = [
            propertyX,
            propertyY,
            propertyZ,
            propertyKey
        ].filter((p) => p !== undefined);

        let cleanDatum = this.cleanDatum(datum, dataKeys);

        switch (streamingStrategy) {
            case StreamingStrategy.ADD:
                this.data = this.data.concat(cleanDatum);
                break;
            case StreamingStrategy.REPLACE:
                this.data = cleanDatum;
                break;
            case StreamingStrategy.NONE:
                break;
            default:
        }

        //Detect excess of elements given a maxNumberOfElements property
        if (numberOfElements > maxNumberOfElements) {
            let position = numberOfElements - maxNumberOfElements;
            this.data = this.data.slice(position);
        }
    }
}

export default Chart;