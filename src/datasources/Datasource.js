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
export default class Datasource {
    /**
     * Creates an instance of Datasource.
     * 
     * 
     * @memberOf Datasource
    
     */
    constructor() {
        this.filters = [];
    }

    /**
     * Starts the stream of data
     * 
     * 
     * @memberOf Datasource
     */
    start() {
        console.log('Starting datasource');
    }

    /**
     * 
     * If started, this method stops the stream of data
     * 
     * @memberOf Datasource
    
     */
    stop() {
        console.log('Stopping datasource');
    }

    /**
     * Filters the incoming messages. Each data record that do not comply the filter condition will be discarded
     * 
     * @param {any} filter A filter condition
     * @returns this Datasource instance
     * 
     * @memberOf Datasource
     */
    filter(filter) {
        return this;
    }
}