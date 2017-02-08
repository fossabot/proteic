import { Dispatch } from "d3";
import { Observable } from 'rxjs';
import { inject } from '../Injector';
import Config from '../Config';

/**
 *
 * A Datasource is the name given to the connection set up to a data endpoint. This class defines the common methods for the datasources,
 * such as start() and stop().
 *
 * @export Default export: Datasource class
 *
 * @class Datasource The Datasource class
 *
 */
class Datasource {
    /**
     * Creates an instance of Datasource.
     *
     *
     * @memberOf Datasource

     */
    protected dispatcher: Dispatch<HTMLElement> = null;
    protected source: any = null;
    protected config : Config = null;
    protected isWaitingForData: boolean = true;
    protected unwindValueNames: string[] = Array();
    protected discardValueNames: string[] = Array();
    protected transformFunction: Function = (d: any) => d = d;


    @inject('onVisibilityChange')
    protected visibilityChangeSource: Observable<any>;

    constructor() {

    }

    /**
     * Starts the stream of data
     *
     *
     * @memberOf Datasource
     */
    start() {
    }

    /**
     *
     * If started, this method stops the stream of data
     *
     * @memberOf Datasource

     */
    stop() {
        //window.console.log('Stopping datasource');
    }


    onMessage(datum: any) {
        if (datum.constructor.name === 'Array') {
            for (let d of datum) {
                this.onMessage(d);
            }
        } else {
            this.transformFunction(datum);
        }

    }
    configure(dispatcher: any, config : Config) {
        this.dispatcher = dispatcher;
        this.config = config;
    }

    unwind(valueNames: string[]) {
        this.unwindValueNames = valueNames;
        return this;
    }

    discard(valueNames: string[]) {
        this.discardValueNames = valueNames;
        return this;
    }

    transform(fn: Function) {
        this.transformFunction = fn;

    }
}

export default Datasource;