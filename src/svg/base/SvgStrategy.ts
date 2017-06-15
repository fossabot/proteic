import Container from '../components/Container';
import Component from '../components/Component';
import Config from '../../Config';
import inject from '../../inject';

abstract class SvgStrategy {

    protected container: Container;

    @inject('Config')
    protected config: Config;

    constructor() {

    }

    initialize() {
        this.container = new Container(this.config);
    }

    abstract draw(data: [{}], events: Map<string, any>): void;

    abstract addComponent(component: Function, config: any): void;

    public clear(){
        let components = this.container.getComponents();
        for(const c of components){
            c.clear();
        }
    }

    public addLoading() {
        this.container.addLoadingIcon();
    }

    public removeLoading() {
        this.container.removeLoadingIcon();
    }
}

export default SvgStrategy;