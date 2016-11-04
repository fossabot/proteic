import Config from '../../Config';

abstract class Component {

    protected config: Config;
    protected svg: any;

    constructor() {
    }

    abstract update(data): void;
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
};

export default Component;    
