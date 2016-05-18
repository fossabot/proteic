class WebsocketDatasource extends Datasource {
    constructor(source) {
        super();
        this.source = source;
    }
    
    configure(reactor){
        this.reactor = reactor;
    }
    
    start() {
        this.ws = new WebSocket(this.source.endpoint);
        
        this.ws.onopen = (e) => {
            this.reactor.dispatchEvent('onopen',e);
        };
        this.ws.onerror = (e) => {
            this.reactor.dispatchEvent('onerror',e);
        };
        this.ws.onmessage = (e) => {
            //var data = JSON.parse(event.data.substr(2))[1];
            var data = JSON.parse(e.data);
            this.reactor.dispatchEvent('onmessage',data);
        };
    }

    stop() {
        if (this.ws) {
            this.ws.close();
        }
    }
}