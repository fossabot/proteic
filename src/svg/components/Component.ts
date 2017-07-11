import { Data } from './../../data/Data';
import { Selection } from 'd3';
import { Observable } from 'rxjs';
import Config from '../../Config';

abstract class Component {

    protected config: Config;
    protected svg: Selection<any, any, any, any>;

    protected elementEnter: any;
    protected elementExit: any;
    protected elementUpdate: any;

    public abstract update(data: Data, events?: Map<string, any>): void;

    public abstract transition(): void;

    public abstract clear(): void;

    public abstract render(): void;

    /**
     *
     * Configure this component to use a given configuration and a SVG selector.
     * This method is automatically by the Container.
     * @param {Config} config A configuration object
     * @param {*} svg A D3 selector object
     * @memberof Component
     * @returns {void}
     */
    public configure(config: Config, svg: any) {
        this.config = config;
        this.svg = svg;
    }
}

export default Component;    
