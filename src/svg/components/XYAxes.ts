import XAxis from './XAxis';
import YAxis from './YAxis';

import Config from '../../Config';
import Component from './Component';

class XYAxis extends Component {
    private _x: XAxis;
    private _y: YAxis;

    constructor() {
        super();

        this._x = new XAxis();
        this._y = new YAxis();
    }

    public render(): void {
        this._y.render();
        this._x.render();

    }

    public update(data: any): void {
        this._y.update(data);
        this._x.update(data);
    }


    public configure(config: Config, svg: any) {
        super.configure(config, svg);
        this._y.configure(config, svg);
        this._x.configure(config, svg);
    }
    public transition() {
        this._x.transition();
        this._y.transition();
    }

    get x(): XAxis {
        return this._x;
    }

    get y(): YAxis {
        return this._y;
    }

    public clear() {
        this._x.clear();
        this._y.clear();
    }

}

export default XYAxis;
