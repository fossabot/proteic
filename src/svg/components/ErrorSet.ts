import Config from '../../Config';
import Component from './Component';

class ErrorSet extends Component {
    constructor() {
        super();
    }

    public render(): void {
        let width: number = this.config.get('imageWidth'),
            height: number = this.config.get('imageHeight'),
            marginLeft: number = this.config.get('marginLeft');

        this.svg.select('.spinner').style('opacity', 0);
        
        this.svg.append('image')
                .attr('class', 'warning')
                .style('opacity', 1)
                .attr('xlink:href', '../../../images/Warning.svg')
                .attr('width', 200)
                .attr('height', 200)
                .attr('transform', 'translate(' + (width - marginLeft - 200) + ',' + (height - 200) + ')');
    }

    public update(data: [{}]) {
        if (typeof data !== undefined && data.length != 0) {
            this.svg.select('.warning').style('opacity', 0);
        }
    }

    public transition() {}

    public clear() {}
}

export default ErrorSet;
