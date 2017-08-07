import Config from '../../Config';
import Component from './Component';

class Spinner extends Component {
    constructor() {
        super();
    }

    public render(): void {
        this.svg.append('image')
                .style('opacity', 1)
                .attr('class', 'spinner')
                .attr('xlink:href', '../../../images/Spinner.gif')
                .attr('position', 'absolute')
                .attr('height', '60%')
                .style('width', '70%');

    }

    public update(data: [{}]) {
        if (typeof data !== undefined && data.length != 0) {
            this.svg.select('.spinner').style('opacity', 0);
        }
    }

    public transition() {}

    public clear() {}
}

export default Spinner;
