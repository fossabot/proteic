
import Component from './Component';
import XYAxes from './XYAxes';
import Config from '../../Config';

class Lineset extends Component {

    private xyAxes : XYAxes;
    
    constructor(config: Config, xyAxes: XYAxes) {
        super(config);
        this.xyAxes = xyAxes;
    }
    
    
    public render(): void {

    }

    public update(): void {

    }

}

export default Lineset;