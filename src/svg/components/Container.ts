import {select} from 'd3';

import Component from './Component';
import Config from '../../Config';

class Container {

    private svg: any;
    private config: Config;
    private components: Component[] = [];

    constructor(config: Config) {
        this.config = config;

        let selector = this.config.get('selector'),
            width = this.config.get('width'),
            height = this.config.get('height'),
            marginLeft = this.config.get('marginLeft'),
            marginRight = this.config.get('marginRight'),
            marginTop = this.config.get('marginTop'),
            marginBottom = this.config.get('marginBottom');

        width += marginLeft + marginRight;
        height += marginTop + marginBottom;

        this.initializeContainer(selector, width, height, marginLeft, marginTop);
    }

    /**
     * Add a new component to the current SVG container.
     * 
     * @param {Component} component A component to be added
     * @param {boolean} render If true, the component will be automatically rendered after adding it to the container
     * @returns {Container}
     * 
     * @memberOf Container
    
     */
    public add(component: Component): Container {
        this.components.push(component);
        component.configure(this.config, this.svg);
        component.render();
        return this;
    }

    /**
     * 
     * Initialize the svg container. 
     * @private
     * @param {string} selector Selector where this graph will be included in
     * @param {((number | string))} width Total width of the graph
     * @param {((number | string))} height Total height of the graph
     * @param {number} marginLeft Left margin
     * @param {number} marginTop Top margin
     * 
     * @memberOf Container
    
     */
    private initializeContainer(selector: string, width: (number | string), height: (number | string), marginLeft: number, marginTop: number): void {
        this.svg = select(selector)
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', 'chartContainer')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
    }


    public updateComponents(data: [{}]) {
        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            component.update(data);
        }

    }
};

export default Container;