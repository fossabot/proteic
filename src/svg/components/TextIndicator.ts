import Component from "./Component";

class TextIndicator extends Component {

    constructor() {}

    update(data: [any]): void {
        let datum = data[data.length - 1];

        this.svg.select('.value')
            .text(datum.value);
        this.svg.select('.label')
            .text(datum.label);
    }

    render(): void {
        let translation = this.config.get('textIndicatorTranslation');
        let indicator = this.svg.append('g')
            .attr('class', 'text-indicator')
            .attr('pointer-events', 'none')
            .style('text-anchor', 'middle')
            .style('alignment-baseline', 'central');

        if (translation) {
            indicator.attr('transform', translation);
        }

        indicator.append('text')
            .attr('class', 'value')
            .attr('x', 0)
            .attr('y', 0)
            .attr('pointer-events', 'none')
            .text('0')
            .style('font', '48px Montserrat, sans-serif')
            .style('text-anchor', 'middle');

        indicator.append('text')
            .attr('class', 'label')
            .attr('x', 0)
            .attr('y', 0)
            .attr('pointer-events', 'none')
            .text('')
            .style('font', '24px Montserrat, sans-serif')
            .style('transform', 'translate(0, 1.5em')
            .style('text-anchor', 'middle');
    }
}

export default TextIndicator;