import { scaleLinear } from 'd3';
import Component from './Component';

class XRadialAxis extends Component {

    private _xRadialAxis: any;

    constructor() {
        super();
    }

    public update(data: any): void { }

    public render(): void {
        this._xRadialAxis = scaleLinear().range([0, Math.PI * 2]);
    }

    get xRadialAxis(): any {
        return this._xRadialAxis;
    }

    public clear() {
        console.warn('Not yet implemented');
    }

    public transition() {
        // console.warn('no transition implemented for xradial');
    }
    
}

export default XRadialAxis;
