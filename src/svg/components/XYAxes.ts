import XAxis from './XAxis';
import YAxis from './YAxis';

import Config from '../../Config';
import Component from './Component';

class XYAxis extends Component {
    private x: XAxis;
    private y: YAxis;

    constructor(config: Config) {
        super(config);

        this.x = new XAxis(config);
        this.y = new YAxis(config);
    }

    public render(): void {

    }

    public update(): void {

    }


}

export default XYAxis;