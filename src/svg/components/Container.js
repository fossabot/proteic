"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var d3_select_1 = require('d3-select');
var Component_1 = require('./Component');
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(config) {
        _super.call(this, config);
        this.components = [];
        var selector = this.config.get('selector'), width = this.config.get('width'), height = this.config.get('height'), marginLeft = this.config.get('marginLeft'), marginTop = this.config.get('marginTop');
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
    Container.prototype.add = function (component, render) {
        if (render === void 0) { render = true; }
        this.components.push(component);
        if (render) {
            this.render();
        }
        return this;
    };
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
    Container.prototype.initializeContainer = function (selector, width, height, marginLeft, marginTop) {
        this.svg = d3_select_1.select(selector)
            .append('svg:svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('class', 'chartContainer')
            .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
    };
    Container.prototype.update = function () {
    };
    Container.prototype.render = function () {
    };
    return Container;
}(Component_1["default"]));
;
exports.__esModule = true;
exports["default"] = Container;
