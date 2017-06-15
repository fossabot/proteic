import Component from "./Component";

/**
 * Creates an SVG clip path component that is attached to the chart.
 * The clip path can be later referenced by the `#proteic-clip-path` id.
 */
class ClipPath extends Component {

    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }

    update(data: any): void { }

    public render(): void {
        this.svg.append('clipPath')
            .attr('id', this.config.get('proteicID'))
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height);
    }

    public clear() {
        console.warn('TODO: Not yet implemented');
    }

    public transition() {
        console.warn('No transition effects for clippath');
    }

}

export default ClipPath;