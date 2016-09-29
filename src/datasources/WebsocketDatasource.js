import Datasource from './Datasource';

export default class WebsocketDatasource extends Datasource {


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