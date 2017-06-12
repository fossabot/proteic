import Component from "./Component";
import { scaleLinear } from "d3";

class XRadialAxis extends Component {

    private _xRadialAxis: any;

    constructor() {
        super();
    }

    update(data: any): void { }

    render(): void {
        this._xRadialAxis = scaleLinear().range([0, 2 * Math.PI]);
    }

    get xRadialAxis(): any {
        return this._xRadialAxis;
    }

    public clear() {
        console.warn('Not yet implemented');
    }
}

export default XRadialAxis;