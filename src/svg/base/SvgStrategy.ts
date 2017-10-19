import Container from '../components/Container';
import Component from '../components/Component';
import XYAxes from '../components/XYAxes';
import Annotations from '../components/Annotations';
import Config from '../../Config';
import inject from '../../inject';
import ErrorSet from '../components/ErrorSet';

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

    public addComponent(component: Function, config: any) {
        switch (component.name) {
            case Annotations.name:
                let axes: XYAxes = this.container.getComponent(XYAxes.name) as XYAxes;
                this.container.add(new Annotations(axes.x, axes.y, config));
                break;
            case ErrorSet.name:
                this.container.add(new ErrorSet());
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
