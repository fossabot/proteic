import { Subject } from 'rxjs';
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
     * A websocket isntance
     */
    public ws: WebSocket;

    /**
     * A websocket subject. Use top send messages to all the subscriptors
     */
    private _wsSubject: Subject<any> = new Subject<any>();

    /**
     * Websocket endpoint
     */
    private _url: string;

    /**
     * Default cosntructor 
     */
    constructor(ws: WebSocket) {
        super();
        this.ws = ws;
        this._url = this.ws.url;
    }

    public start() {
        if (this.ws) {
            this._registerHandlers();
        } else {
            throw Error('Websocket is not started yet');
        }
    }
    public stop() {
        if (this.ws) {
            this._unregisterHandlers();
        }
    }


    private _registerHandlers() {
        this.ws.onmessage = (e) => this._wsSubject.next(this._extractDataFromWSEvent(e));
        this.ws.onerror = (e) => this._wsSubject.error(e);
        // this.visibilityChangeSourceSubscription = this.visibilityChangeSource.subscribe(
        //    (e) => this._handleVisibility(e)
        //    );
    }

    private _unregisterHandlers() {
        this.ws.onmessage = (e) => e;
        this.ws.onerror = (e) => e;
        // this.visibilityChangeSourceSubscription.unsubscribe();
    }


    private _extractDataFromWSEvent(e: any) {
        if (e.data && e.data.length) {
            return JSON.parse(e.data);
        }
        return null;
    }


    public subscription(): Subject<any> {
        return this._wsSubject;
    }


}

export default WebsocketDatasource;