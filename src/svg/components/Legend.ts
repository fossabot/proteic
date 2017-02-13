import Component from './Component';
import Config from '../../Config';
import Globals from '../../Globals';

import {
    selection,
    nest
} from 'd3';


class Legend extends Component {

    constructor() {
        super();
    }

    public render() {
        this.svg.append('g').attr('class', 'legend');
    }

    public update(data: any) {
        let propertyKey:string = this.config.get('propertyKey');

        //Exclude those values that do not contain a 'key'.
        let dataSeries: any = nest()
            .key((d: any) => d[propertyKey]).entries(data),
            legend = null,
            entries = null,
            colorScale = this.config.get('colorScale'),
            height = this.config.get('height'),
            width = this.config.get('width');

        if (dataSeries.length === 1 && dataSeries[0][propertyKey] === 'undefined') {
            console.warn('Not showing legend, since there is a valid key');
            return;
        }

        // this.svg.selectAll('g.legend').remove();

        legend = this.svg.select('.legend');

        // JOIN entries
        entries = legend.selectAll(`.legend-entry`)
        .data(dataSeries, (d: any) => d[propertyKey]);

        let enterEntries = entries.enter().append('g')
        .attr('class', 'legend-entry')
        .attr(Globals.LEGEND_DATA_KEY_ATTRIBUTE, (d: any) => d[propertyKey]);

        enterEntries.append('rect')
        .attr('class', 'legend-cb')
        .attr('x', width + 10)
        .attr('y', (d: any, i: number) => i * 25)
        .attr('height', 20)
        .attr('width', 20)
        .style('fill', (d: any) => colorScale(d[propertyKey]))
        .style('stroke', (d: any) => colorScale(d[propertyKey]))
        .style('opacity', 0.8)
        .on('click.default', (d: any) => this.toggle(d));

        enterEntries.append('text')
        .attr('class', 'legend-txt')
        .attr("x", width + 25 + 10)
        .attr("y", (d: any, i: number) => i * 25 + 7)
        .attr("dy", "0.55em")
        .text((d: any) => d[propertyKey])
        .style('font', '14px Montserrat, sans-serif')
        .on('click.default', () => this.toggle);

        enterEntries.merge(entries);

        legend.selectAll('.legend-cb')
            .attr('x', width + 10)
            .attr('y', (d: any, i: number) => i * 25)
            .on('click.default', (d: any) => this.toggle(d));   

        legend.selectAll('.legend-txt')
        .attr("x", width + 25 + 10)
        .attr("y", (d: any, i: number) => i * 25 + 7)
        .on('click.default', () => this.toggle);

        entries.exit().remove();
    }

    private toggle(d: any): void {
        let key: string = d.key,
            element = this.svg.selectAll('*[' + Globals.COMPONENT_DATA_KEY_ATTRIBUTE + '="' + key + '"]'),
            colorScale = this.config.get('colorScale'),
            propertyKey = this.config.get('propertyKey');

        if (!element.empty()) {
            let opacity: number = parseInt(element.style('opacity'));
            opacity = (opacity == 1) ? Globals.COMPONENT_HIDE_OPACITY : 1;
            let legendEntry = this.svg.select('.legend-entry[' + Globals.LEGEND_DATA_KEY_ATTRIBUTE + '="' + key + '"]');

            legendEntry.selectAll('rect')
                .transition()
                .duration(Globals.COMPONENT_HIDE_SHOW_TRANSITION_TIME)
                .style('fill', (d: any): any => {
                    return (opacity === 1) ? colorScale(d[propertyKey]) : 'transparent';
                });

            element
                .transition()
                .duration(Globals.COMPONENT_HIDE_SHOW_TRANSITION_TIME)
                .style('opacity', opacity);
        }
    }

}

export default Legend;