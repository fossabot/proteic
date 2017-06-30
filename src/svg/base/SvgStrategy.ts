import Config from '../../Config';
import inject from '../../inject';
import Annotations from '../components/Annotations';
import Component from '../components/Component';
import Container from '../components/Container';
import XYAxes from '../components/XYAxes';

abstract class SvgStrategy {

    protected container: Container;

    @inject('Config')
    protected config: Config;

    constructor() {

    }

    public initialize() {
        this.container = new Container(this.config);
    }

    public abstract draw(data: [{}], events: Map<string, any>): void;

    public addComponent(component: Function, config: any) {
        switch (component.name) {
            case Annotations.name:
                let axes: XYAxes = <XYAxes>this.container.getComponent(XYAxes.name);
                this.container.add(new Annotations(axes.x, axes.y, config));
                break;
        }
    }

    public clear() {
        let components = this.container.getComponents();
        for (const c of components) {
            c.clear();
        }
    }
}

export default SvgStrategy;
