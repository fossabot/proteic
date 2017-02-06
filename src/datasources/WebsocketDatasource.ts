import Datasource from "./Datasource";
import { unwind } from '../utils/data/transforming';
import { discardProperties } from '../utils/data/filtering';
import StorageService from '../services/StorageService';
import { inject } from '../Injector';

/**
 *
 * This datasource set up a connection to a websocket server.
 * @export
 * @class WebsocketDatasource
 * @extends {Datasource}

 */
class WebsocketDatasource extends Datasource {

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
     * @param {source} A websocket endpoint. If invalid, this class will throw an Error.
     *
     * @memberOf WebsocketDatasource

     */
    private ws: WebSocket;

    @inject('sessionStorageService')
    private sessionStorage: StorageService;

    constructor(source: any) {
        super();
        this.source = source;
    }

    /**
     * Configure a dispatcher for this datasource.
     *
     * @param dispatcher A d3 dispatcher. This dispatcher is in charge of receiving and sending events.
     *
     * @memberOf WebsocketDatasource
     */
    configure(dispatcher: any) {
        this.dispatcher = dispatcher;

        this.visibilityChangeSource.subscribe((e: any) => {
            let hidden = e.hidden;
            if (hidden) {
                this.enableBackupData();
            } else {
                this.enableShowData();
            }
        });
    }


    private enableBackupData() {
        //Do nothing
        this.ws.onmessage = (e) => e;
        
        //TODO: if draw strategy is replace, do nothing. If it's add, store values in a temporal buffer without overcoming
        //the maxNumberOfElements 

        /**
         this.ws.onmessage = (e) => {
             let data = JSON.parse(e.data);
             if (data.constructor === Array) {
                 this.sessionStorage.addAll('chart', data);
             }
             else {
                 this.sessionStorage.add('chart', data);
             }
         };
         **/
    }

    private enableShowData() {
        this.ws.onmessage = (e) => {
            if (e.data && e.data.length) {
                let data = JSON.parse(e.data);
                this.dispatcher.call('onmessage', null, data);
            };
        };

    }
    /**
     *
     * Initialize a websocket connection
     *
     * @memberOf WebsocketDatasource

     */
    start() {
        super.start();
        this.ws = new WebSocket(this.source['endpoint']);

        this.dispatcher.call('addLoading', null, {});

        this.ws.onopen = (e) => {
            this.dispatcher.call('onopen', null, e);
        };
        this.ws.onerror = (e) => {
            throw new Error('An error occurred trying to reach the websocket server' + e);
        };
        this.ws.onmessage = (e) => {
            if (e.data && e.data.length) {
                let data = JSON.parse(e.data);
                this.dispatcher.call('onmessage', null, data);
            };
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

export default WebsocketDatasource;