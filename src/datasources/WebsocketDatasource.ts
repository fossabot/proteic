import Datasource from "./Datasource";
import { unwind } from '../utils/data/transforming';
import { discardProperties } from '../utils/data/filtering';
import StorageService from '../services/StorageService';
import { inject } from '../Injector';
import Config from '../Config';
import StreamingStrategy from '../charts/enums/StreamingStrategy';

import { fitArrayByOldAndNewValue } from '../utils/array/array';
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
    configure(dispatcher: any, config: Config) {
        super.configure(dispatcher, config);
        this.dispatcher = dispatcher;
        let chartIdentifierKey: string = this.config.get('chartIdentifierKey');
        this.visibilityChangeSource.subscribe((e: any) => {
            let hidden = e.hidden;

            if (hidden) {
                this.enableBackupData(chartIdentifierKey);
            } else {
                this.enableShowData(chartIdentifierKey);
            }
        });
    }


    private enableBackupData(chartIdentifierKey: string) {
        console.log('Enabling backup mode...Storing websocket data in the backroung');
        let streamingStrategy: StreamingStrategy = this.config.get('streamingStrategy');

        switch (streamingStrategy) {
            case StreamingStrategy.ADD:
                this.ws.onmessage = (e) => {
                    let originalData = this.sessionStorage.getArray(chartIdentifierKey);
                    let data = JSON.parse(e.data);
                    let newData = data.constructor === Array ? data : [data];
                    let maxNumberOfElements = this.config.get('maxNumberOfElements');
                    let data2store = fitArrayByOldAndNewValue(newData, originalData, maxNumberOfElements);
                    this.sessionStorage.setArray(chartIdentifierKey, data2store);
                }
                break;
            case StreamingStrategy.REPLACE:
                this.ws.onmessage = (e) => e;
                break;
            default:
                throw Error(`Unknown StreamingStrategy: ${streamingStrategy}`);
        }

    }

    private enableShowData(chartIdentifierKey: string) {
        let storedData = this.sessionStorage.getArray(chartIdentifierKey);
        console.log(`Disabling backup mode... Showing stored data (length): ${storedData.length}`);

        if (storedData != null && storedData.length) {
            this.dispatcher.call('onmessage', null, storedData);
            this.sessionStorage.setArray(chartIdentifierKey, []);
        }


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