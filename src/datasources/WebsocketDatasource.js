import Datasource from './Datasource';
/**
 * 
 * This datasource set up a connection to a websocket server. 
 * @export
 * @class WebsocketDatasource
 * @extends {Datasource}

 */
export default class WebsocketDatasource extends Datasource {

    /**
     * Creates an instance of WebsocketDatasource.
     * 
     * @param {any} source Example of source: <br/> 
     * <pre class="prettyprint">
     *    &lt;script&gt;
     *    var source = {
     *      endpoint: 'ws://192.168.3.32:3000/pathToWebsocketEndpoint';
     *    };
     *    &lt;/script&gt;
     *   </pre>
     *  
     * @memberOf WebsocketDatasource
    
     */
    constructor(source) {
        super();
        this.source = source;
    }
    
    configure(dispatcher) {
        this.dispatcher = dispatcher;
    }

    start() {
        super.start();
        this.ws = new WebSocket(this.source.endpoint);

        this.ws.onopen = (e) => {
            this.dispatcher.call('onopen', this, e);
        };
        this.ws.onerror = (e) => {
            this.dispatcher.call('onerror', this, e);
        };
        this.ws.onmessage = (e) => {
            var data = JSON.parse(e.data);
            this.dispatcher.call('onmessage', this, data);
        };
    }

    stop() {
        super.stop();
        if (this.ws) {
            this.ws.close();
        }
    }
}