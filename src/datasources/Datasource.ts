import { dispatch } from 'd3';

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
    protected dispatcher: any = null;
    protected source: any = null;
    protected isWaitingForData: boolean = true;

    constructor() {
        // this.filters = [];
        // this.properties = [];
    }

    /**
     * Starts the stream of data
     * 
     * 
     * @memberOf Datasource
     */
    start() {
        //window.console.log('Starting datasource');
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


    configure(dispatcher: any) {
        this.dispatcher = dispatcher;
    }
}

export default Datasource;