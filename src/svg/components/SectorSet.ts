import { Data } from './../../data/Data';
import {
    Arc,
    arc,
    pie
} from 'd3';
import Globals from '../../Globals';
import Component from './Component';

class SectorSet extends Component {

    constructor() {
        super();
    }

    public render() { }

    public update(data: Data) {
        let propertyKey = this.config.get('propertyKey');
        let propertyX = this.config.get('propertyX');
        let width = this.config.get('width');
        let height = this.config.get('height');
        let radius = Math.min(width, height) / 2;

        let colorScale = this.config.get('colorScale');

        let myPie = pie().value((d: any) => d[propertyX])(data.originalDatum);
        let myArc: Arc<any, any> = arc().innerRadius(0).outerRadius(radius);

        let arcs = this.svg.selectAll('g.slice').data(myPie);
        let newBlock = arcs.enter();

        newBlock
            .append('g')
            .attr(Globals.COMPONENT_DATA_KEY_ATTRIBUTE, (d: any) => d.data[propertyKey])
            .append('path')
            .attr('fill',
            (d: any, i: number) =>
                d.data[propertyKey] !== undefined ? colorScale(d.data[propertyKey]) : colorScale(i))
            .attr('d', myArc);

    }

    public clear() {
        console.warn('Not yet implemented');
    }

    public transition() {
        // console.warn('No transition for sector set');
    }
}

export default SectorSet;
