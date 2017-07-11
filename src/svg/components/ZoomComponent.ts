import { Data } from './../../data/Data';
import {
    event,
    select,
    selection,
    zoom
} from 'd3';
import Config from '../../Config';
import Component from './Component';
import Zoomable from './Zoomable';

class ZoomComponent extends Component {

    private zoom: any;
    private zoomerComponent: Zoomable;

    constructor(zoomerComponent: Zoomable) {
        super();
        this.zoomerComponent = zoomerComponent;
        this.zoom = zoom().scaleExtent([1 / 2, 4]);
    }

    public render() {
        let selector = this.config.get('selector');
        select(selector).call(this.zoom);

        this.zoom.on('zoom', () => {
            this.zoomerComponent.zoom(event);
        });
    }

    public update(data: Data) {

    }

    public clear() {
        console.warn('Not yet implemented');
    }
    
    public transition() {
        console.warn('no transition implemented for xradial');
    }
}

export default ZoomComponent;
