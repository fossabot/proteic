
import Component from './Component';
import Config from '../../Config';

/**
 * Creates an SVG clip path component that is attached to the chart.
 * The clip path can be later referenced by the `#proteic-clip-path` id.
 */
class ClipPath extends Component {

    private width: Number;
    private height: Number;

    constructor(width: Number, height: Number) {
        super();
        this.width = width;
        this.height = height;
    }

    update(data): void {
    }

    public render(): void {
        this.svg.append('clipPath')
            .attr('id', 'proteic-clip-path')
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height);
    }
}

export default ClipPath;