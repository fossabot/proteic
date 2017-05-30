import Config from "../../Config";
import {Selection} from "d3";

abstract class Component {

    protected config: Config;
    protected svg: Selection<any, any, any, any>;

    constructor() {
    }

    abstract update(data: any, events?: Map<string, any>): void;

    abstract render(): void;

    /**
     *
     * Configure this component to use a given configuration and a SVG selector. This method is automatically by the Container.
     * @param {Config} config A configuration object
     * @param {*} svg A D3 selector object
     *
     * @memberOf Component

     */
    public configure(config: Config, svg: any) {
        this.config = config;
        this.svg = svg;
    }
}
;

export default Component;    
