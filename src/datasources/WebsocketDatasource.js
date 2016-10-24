import Datasource from './Datasource';
import WebSocket from 'socket.io';

/**
 * 
 * This datasource set up a connection to a websocket server. 
 * @export
 * @class WebsocketDatasource
 * @extends {Datasource}

 */
export default class WebsocketDatasource extends Datasource {

    /**
     * Creates an instance of WebsocketDatasource. This datasource will try to connect to the speficied websocket endpoint.
     * <pre class="prettyprint">
     *    var source = {
     *      endpoint: 'ws://192.168.3.32:3000/pathToWebsocketEndpoint';
     *    };
     * 
     *    linechart = new proteic.Linechart(new proteic.WebsocketDatasource(source));
     * </pre>
     * 
     * If new data is available, this datasource will forward the data records to the chart, which automatically repaint the chart with these new records. 
     * @param {any} source A websocket endpoint. If invalid, this class will throw an Error. 
     *  
     * @memberOf WebsocketDatasource
    
     */
    constructor(source) {
        super();
        this.source = source;
    }
    
    /**
     * Configure a dispatcher for this datasource.
     * 
     * @param {any} dispatcher A d3 dispatcher. This dispatcher is in charge of receiving and sending events.
     * 
     * @memberOf WebsocketDatasource
     */
    configure(dispatcher) {
        this.dispatcher = dispatcher;
    }

    /**
     * 
     * Initialize a websocket connection
     * 
     * @memberOf WebsocketDatasource
    
     */
    start() {
        super.start();
        this.ws = new WebSocket(this.source.endpoint);

        this.ws.onopen = (e) => {
            this.dispatcher.call('onopen', this, e);
        };
        this.ws.onerror = (e) => {
            throw new Error('An error occurred trying to reach the websocket server' + e);
            //this.dispatcher.call('onerror', this, e);
        };
        this.ws.onmessage = (e) => {
            var data = JSON.parse(e.data);
            this.dispatcher.call('onmessage', this, data);
        };
    }
    /**
     * If started, this method close the websocket connection.
     * 
     * @memberOf WebsocketDatasource
    * */
    stop() {
        super.stop();
        if (this.ws) {
            this.ws.close();
        }
    }
}