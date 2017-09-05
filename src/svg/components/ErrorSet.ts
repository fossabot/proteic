import Config from '../../Config';
import Component from './Component';

class ErrorSet extends Component {
    constructor() {
        super();
    }

    public render(): void {
        let width: number = this.config.get('width'),
            height: number = this.config.get('height'),
            marginLeft: number = this.config.get('marginLeft'),
            errorImagePosition: number[] = this.config.get('errorImagePosition');
            
        this.svg.select('.spinner').style('opacity', 0);

        this.svg.append('image')
                .attr('class', 'warning')
                .style('opacity', 1)
                .attr('xlink:href', '../../../images/Warning.svg')
                .attr('width', 200)
                .attr('height', 200)
                .attr('x', width / 2 - 100)
                .attr('y', height / 2 - 100);

        if (errorImagePosition) {
            this.translate(errorImagePosition[0], errorImagePosition[1]);
        }
    }

    public update(data: [{}]) {
        if (typeof data !== undefined && data.length != 0) {
            this.svg.select('.warning').style('opacity', 0);
        }
    }

    public transition() {}

    public clear() {}

    translate(x: Number, y: Number) {
        this.svg.select('.warning')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(${x}, ${y})`);
    }
}

export default ErrorSet;
