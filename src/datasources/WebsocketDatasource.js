import Datasource from './Datasource';

export default class WebsocketDatasource extends Datasource {


    constructor(source) {
        super();
        this.source = source;
        console.log('source', source);
    }
    
    configure(dispatcher) {
        this.dispatcher = dispatcher;
    }

    start() {
        super.start();
        this.ws = new WebSocket(this.source.endpoint);

        this.ws.onopen = (e) => {
            this.dispatcher.apply('onopen', this, e);
        };
        this.ws.onerror = (e) => {
            this.dispatcher.apply('onerror', this, e);
        };
        this.ws.onmessage = (e) => {
            var data = JSON.parse(e.data);
            this.dispatcher.apply('onmessage', this, data);
        };
    }

    stop() {
        super.stop();
        if (this.ws) {
            this.ws.close();
        }
    }
}