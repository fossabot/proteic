import {sortBy, isNumeric, isPercentage } from '../utils/functions'

export class SvgChart {

    constructor(chartContext) {
        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = chartContext.cType;
        this._loadConfigOnContext(chartContext.config);

        this.interactiveElements = null;
    }




    _calculateWidth(width) {
        if (width === 'auto') {
            return d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
        }
        else if (isNumeric(width)) {
            //check container width TODO
            return width;
        }
        else if (isPercentage(width)) {
            let containerWidth, percentage;
            containerWidth = d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
            percentage = width.split('%')[0];
            return Math.round(percentage * containerWidth / 100);
        } else {
            throw Error('Unknow chart width: ' + width);
        }

    }
}