import { Data } from './../../data/Data';
import { scaleSqrt } from 'd3';
import Component from './Component';

class YRadialAxis extends Component {

    private _yRadialAxis: any;

    constructor() {
        super();
    }

    public render() {
        let width = this.config.get('width');
        let height = this.config.get('height');
        let radius = (Math.min(width, height) / 2) - 10;

        this._yRadialAxis = scaleSqrt().range([0, radius]);
    }

    public update(data: Data) { }

    get yRadialAxis(): any {
        return this._yRadialAxis;
    }

    public clear() {
        console.warn('Not yet implemented');
    }

    public transition() {
        // console.warn('no transition implemented for xradial');
    }

}

export default YRadialAxis;
