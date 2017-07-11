import { Data } from './../data/Data';
import { select } from 'd3-selection';
import { Observable, Subscription } from 'rxjs';
import Config from '../Config';
import Datasource from '../datasources/Datasource';
import WebsocketDatasource from '../datasources/WebsocketDatasource';
import GlobalInjector from '../GlobalInjector';
import Globals from '../Globals';
import Injector from '../Injector';
import { SvgContext } from '../svg/base/SvgContext';
import SvgStrategy from '../svg/base/SvgStrategy';
import Annotations from '../svg/components/Annotations';
import { throwError } from '../utils/error';
import { copy, filterKeys, hasValuesWithKeys, isValuesInObjectKeys, melt } from '../utils/functions';
import { calculateWidth } from '../utils/screen';
import StreamingStrategy from './enums/StreamingStrategy';

/**
 * 
 * Chart class. This class is a high-level representation for any visualization in this library. Each new visualization 
 * created should extend this class.
 * 
 * @abstract
 * @class Chart
 */
abstract class Chart {

    /**
     * A SVG context where the visualization is rendered.
     * @private
     * @type {SvgContext}
     * @memberof Chart
     */
    private context: SvgContext;  // TODO: In the future this should be renamed to 'Context',
    // since two different kind of contexts can be used (SVG / Canvas)

    /**
     * A key/value map that contains the chart options. By default this contains the default options for the current
     * visualization @see(src/utils/defaults/). When a user creates an instance of a specific charts, default options
     * can be overwritten through the config parameter
     * @protected
     * @type {Config}
     * @memberof Chart
     */
    protected config: Config;

    /**
     * Chart data
     * @protected
     * @type {*}
     * @memberof Chart
     */
    protected data: any;

    /**
     * 
     * Annotation config. 
     * 
     * @private
     * @type {*}
     * @memberof Chart
     */
    private annotationsConfig: any; // TODO: We should remove this property in the future,
    // since the rest of configuration options are specified through the config attr
    // TODO: We should create a type for annotations

    /**
     * Events
     * 
     * @private
     * @type {Map<string, any>}
     * @memberof Chart
     */
    private events: Map<string, any>;
    // TODO: We should remove this property in the future,
    // since the rest of configuration options are specified through the config attr

    /**
     * A map containing chart subscriptions
     * 
     * @private
     * @type {Map<string, Subscription>}
     * @memberof Chart
     */
    private subscriptions: Map<string, Subscription> = new Map<string, Subscription>();

    /**
     * An injector that instantiate the SvgContext class and pass it the config and the strategy parameters
     * 
     * @private
     * @type {Injector}
     * @memberof Chart
     */
    private injector: Injector = new Injector();

    /**
     * 
     * A strategy class that takes responsability for drawing an specific visualization
     * 
     * @private
     * @type {SvgStrategy}
     * @memberof Chart
     */
    private strategy: SvgStrategy;
    // TODO: In the future this should be renamed to 'DrawStrategy',
    // since two different kind of 'strategies' should be allowed (SVG / Canvas)

    private streamingIntervalIdentifier: number = null;

    // TODO: Inject with annotations?
    private visibilityObservable: Observable<any> = GlobalInjector.getRegistered('onVisibilityChange');

    /**
     * Creates an instance of Chart.
     * 
     * @param {function} clazz - Reference to a specific strategy
     * @param {*} data - Initial data. It can be [] or a filled array.
     * @param {*} userConfig - A customized configuration for the current chart. It overrides the default configuration.
     * @param {*} defaults - Default option values for the current chart.
     * @memberof Chart
     * @returns {void}
     */
    constructor(clazz: { new (...args: Array<any>): SvgStrategy }, data: any, userConfig: any, defaults: any) {
        this.config = this.loadConfigFromUser(userConfig, defaults);
        this.config.put('proteicID', 'proteic-' + Date.now());
        this.injector = new Injector();

        this.instantiateInjections(clazz);

        this.data = data;
        this.events = new Map();
        this.config.put('pivotVars', []);

        this.visibilityObservable.subscribe((event: any) => {
            this.stopDrawing();
            if (!event.hidden) {
                this.streamingIntervalIdentifier = setInterval(() => this.draw(copy(this.data)), Globals.DRAW_INTERVAL);
            }
        });
    }

    private instantiateInjections(clazz: { new (...args: Array<any>): SvgStrategy }) {
        this.injector.mapValue('Config', this.config);

        this.strategy = this.injector.instantiate(clazz);
        this.strategy.initialize();

        this.injector.mapValue('Strategy', this.strategy);

        this.context = this.injector.instantiate(SvgContext);
    }

    public annotations(annotations: any) {
        this.config.put('annotations', annotations);
        this.annotationsConfig = annotations;
        this.strategy.addComponent(Annotations, annotations);

        return this;
    }

    public draw(data: [{}] = this.data, events: Map<string, any> = this.events) {
        // TODO: SPLIT DATA INTO SMALL CHUNKS (stream-like). 
        let d = new Data(copy(data), this.config);
        d.performCalculations();
        this.context.draw(d, this.events);

        //this.context.draw(copy(data), this.events);
        this.data = data;
    }

    /**
     * Configure a datasources for the current instance.
     * Datasources allows data to be catached from many sources, such as websockets endpoints, HTTP urls, etc.
     * @param {Datasource} ds A datasource
     * @memberof Chart
     * @return {Chart} The chart object for which the datasource has been set.
     */
    public datasource(ds: WebsocketDatasource) {
        let subscription: Subscription = ds.subscription().subscribe(
            (data: any) => this.keepDrawing(data),
            (e: any) => throwError(e),
        );

        this.subscriptions.set('datasource', subscription);

        return this;
    }

    public alert(variable: string, condition: Function, callback?: Function, events?: any) {
        this.config.put('alertVariable', variable);
        this.config.put('alertFunction', condition);
        this.config.put('alertCallback', callback);
        this.config.put('alertEvents', events);

        return this;
    }

    /**
     * Reshape each incomming datum from wide format to narrow by unpivotting the specified variables.
     * @example 
     * 
     * chart.unpivot(['age', 'weight']);
     * 
     * // Incoming wide datum: { id: 1234, name: 'Bob', age: 32, weight: 86 }
     * 
     * // Unpivoted datum:
     * // [
     * //   { id: 1234, name: 'Bob', key: age, value: 32 },
     * //   { id: 1234, name: 'Bob', key: weight, value: 86 }
     * // ]
     * 
     * @param {Array<string>} vars - Variables to be unpivotted.
     * @memberof Chart
     * @returns {Chart} The chart object for which the pivot variables has been set.
     */
    public unpivot(vars: Array<string>) {
        this.config.put('pivotVars', vars);

        return this;
    }

    public removeSubscriptions() {
        this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
        this.subscriptions.clear();
    }

    public stopDrawing() {
        clearInterval(this.streamingIntervalIdentifier);
    }

    public erase() {
        this.stopDrawing();
        select(this.config.get('selector')).remove();
    }

    public clear() {
        this.data = [];
        this.context.clear();
    }

    protected loadConfigFromUser(userData: any, defaults: any): Config {
        let config = new Config();
        for (let v in defaults) {
            if (defaults.hasOwnProperty(v)) {
                config.put(v, (v in userData) ? userData[v] : defaults[v]);
            }
        }
        let width = config.get('width');
        width = calculateWidth(width, config.get('selector')) - config.get('marginLeft') - config.get('marginRight');
        config.put('width', width);

        return config;
    }

    private cleanDatum(datum: any, dataKeys: Array<any>) {
        let cleanDatum = [];
        let datumType = datum.constructor;
        let nullValues = this.config.get('nullValues');
        let filteredDatum = filterKeys(datum, dataKeys);

        if (datumType === Array) {
            cleanDatum = datum.filter(isValuesInObjectKeys(nullValues, dataKeys));
        } else {
            if (!hasValuesWithKeys(filteredDatum, nullValues, dataKeys)) {
                cleanDatum.push(filteredDatum);
            }
        }

        return cleanDatum;
    }

    public keepDrawing(datum: any): void {
        let streamingStrategy = this.config.get('streamingStrategy');
        let maxNumberOfElements: number = this.config.get('maxNumberOfElements');
        let numberOfElements = this.data.length;
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let propertyZ = this.config.get('propertyZ');
        let propertyKey = this.config.get('propertyKey');
        let propertyStart = this.config.get('propertyStart');
        let propertyEnd = this.config.get('propertyEnd');

        let dataKeys = [
            propertyX,
            propertyY,
            propertyZ,
            propertyKey,
            propertyStart,
            propertyEnd
        ].filter((p) => p !== undefined);

        if (!this.streamingIntervalIdentifier) {
            this.streamingIntervalIdentifier = setInterval(() => this.draw(copy(this.data)), Globals.DRAW_INTERVAL);
        }

        let eventKeys: Set<string> = new Set<string>();

        if (this.annotationsConfig) {
            this.annotationsConfig.forEach((a: any) => {
                eventKeys.add(a.variable);
                eventKeys.add(a.width);
            });
        }

        // Event detection
        eventKeys.forEach((e) => {
            if (e in datum) {
                this.events.set(e, datum[e]);
            }
        });

        // Wide data to narrow and draw
        let pivotVars = this.config.get('pivotVars');
        let keys = Object.keys(datum);
        let varsInDatum = keys.filter((k) => pivotVars.indexOf(k) !== -1);
        let ids = keys.filter((k) => pivotVars.indexOf(k) === -1);

        if (varsInDatum.length >= 1) {
            datum = melt(
                datum,
                varsInDatum,
                ids,
                this.config.get('propertyKey'),
                this.config.get('propertyY')
            );
        }

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

        // Detect excess of elements given a maxNumberOfElements property
        if (numberOfElements > maxNumberOfElements) {
            let position = numberOfElements - maxNumberOfElements;
            this.data = this.data.slice(position);
        }

    }
}

export default Chart;
