import {select} from 'd3-select';

import Component from './Component';
import Config from '../../Config';

class Container extends Component {

    private svg: any;
    private components: Component[] = [];

    constructor(config: Config) {
        super(config);
        let selector = this.config.get('selector'),
            width = this.config.get('width'),
            height = this.config.get('height'),
            marginLeft = this.config.get('marginLeft'),
            marginTop = this.config.get('marginTop');

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
    public add(component: Component, render: boolean = true): Container {
        
        this.components.push(component);

        if (render) {
            this.render();
        }

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



    public update(): void {

    }

    public render(): void {

    }





};

export default Container;