import Datasource from './Datasource';
import { request } from 'd3';

/**
 * 
 * This datasource set up a connection to a http server. 
 * @export
 * @class HTTPDatasource
 * @extends {Datasource}

 */
export default class HTTPDatasource extends Datasource {

    /**
     * Creates an instance of HTTPDatasource. This datasource will try to connect to the speficied HTTP endpoint.
     * <pre class="prettyprint">
     *    var source = {
     *      endpoint: 'https://randomuser.me/api';
     *    };
     * 
     *    linechart = new proteic.Linechart(new proteic.HTTPwDatasource(source));
     * </pre>
     * 
     * If new data is available, this datasource will forward the data records to the chart, which automatically repaint the chart with these new records. 
     * @param {any} source An http endpoint. If invalid, this class will throw an Error. 
     *  
     * @memberOf HTTPDatasource
     * 
     */
    private intervalId: number;


    constructor(source: any) {
        super();
        this.source = source;
        this.intervalId = -1;
        this.isWaitingForData = false;
    }


    /**
     * 
     * Initialize an HTTP connection
     * 
     * @memberOf HTTPDatasource
    
     */
    public start() {
        if (!this.isWaitingForData) {
            super.start();
            let pollingTime = this.source.pollingTime;
            let url = this.source.url;
            this._startPolling(url, pollingTime);
            this.isWaitingForData = true;
        }
    }

    private _startPolling(url: string, time = 1000) {
        let interval = window.setInterval;
        this.intervalId = interval(() => this._startRequest(url), time);
    }

    private _startRequest(url: string) {
        request(url).get((e: any, response: any) => this._handleResponse(response));
    }

    private _stopPolling() {
        let clearInterval = window.clearInterval;
        clearInterval(this.intervalId);
    }

    private _handleResponse(xmlHttpRequest: XMLHttpRequest) {
        let parseJson = JSON.parse;
        if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
            let response = parseJson(xmlHttpRequest.response);
            this._handleOK(response);
        }
        else {
            this._handleError(xmlHttpRequest);
        }
    }

    private _handleOK(data: any) {
        this.dispatcher.call('onmessage', null, data);
    }

    private _handleError(data: any) {
        this.dispatcher.call('onerror', null, data);
    }

    /**
     * If started, this method close the HTTP connection.
     * 
     * @memberOf HTTPDatasource
    * */
    public stop() {
        if (this.isWaitingForData) {
            this._stopPolling();
            this.isWaitingForData = false;
        }
    }
}