import Config from '../../Config';
import Component from './Component';

class Spinner extends Component {
    constructor() {
        super();
    }

    public render(): void {
        let width: number = this.config.get('width'),
            height: number = this.config.get('height'),
            marginLeft: number = this.config.get('marginLeft');

        this.svg.append('image')
                .attr('class', 'spinner')
                .style('opacity', 1)
                .attr('xlink:href', '../../../images/Spinner.svg')
                .attr('width', 200)
                .attr('height', 200)
                .attr('x', width / 2 - 100)
                .attr('y', height / 2 - 100);
    }

    public update(data: [{}]) {
        if (typeof data !== undefined && data.length != 0) { // data arrives
            this.svg.select('.spinner').style('opacity', 0);
        } else {
            if (!parseInt(this.svg.select('.spinner').style('opacity'))) {
                this.svg.select('.spinner').style('opacity', 1);
            }
        }

    }

    public transition() {}

    public clear() {}

    translate(x: Number, y: Number) {
        this.svg.select('.spinner')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(${x}, ${y})`);
    }
}

export default Spinner;