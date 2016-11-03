import Config from '../../Config';

abstract class Component {

    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract update(): void;
    abstract render(): void;
};

export default Component;    
