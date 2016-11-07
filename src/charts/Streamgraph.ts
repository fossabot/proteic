import Chart from './Chart';
import SvgStrategyStreamgraph from '../svg/strategies/SvgStrategyStreamgraph';
import Config from '../Config';
import { defaults } from '../utils/defaults/streamgraph';
import { calculateWidth } from '../utils/screen';
import {copy} from '../utils/functions';

import {
    stackOrderInsideOut,
    stackOffsetWiggle,
    stack as d3Stack
} from 'd3';

class Streamgraph extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyStreamgraph(),
            data,
            userConfig
        );
    }

    public keepDrawing(datum: any) {
        var datumType = datum.constructor;

        if (datumType === Array) {
            this.data = this.data.concat(datum);
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }


    protected loadConfigFromUser(userData: { [key: string]: any; }): Config {
        let config = new Config(),
            //Selector
            selector = userData['selector'] || defaults.selector,
            //Margins 
            marginTop = userData['marginTop'] || defaults.marginTop,
            marginLeft = userData['marginLeft'] || defaults.marginLeft,
            marginRight = userData['marginRight'] || defaults.marginRight,
            marginBottom = userData['marginBottom'] || defaults.marginBottom,
            //Width & height
            width = userData['width']
                ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
                : calculateWidth(defaults.width, selector) - marginLeft - marginRight,
            height = userData['height'] || defaults.height,
            //Axis
            xAxisType = userData['xAxisType'] || defaults.xAxisType,
            xAxisFormat = userData['xAxisFormat'] || defaults.xAxisFormat,
            xAxisLabel = userData['xAxisLabel'] || defaults.xAxisLabel,
            yAxisType = userData['yAxisType'] || defaults.yAxisType,
            yAxisFormat = userData['yAxisFormat'] || defaults.yAxisFormat,
            yAxisLabel = userData['yAxisLabel'] || defaults.yAxisLabel,
            yAxisShow = userData['yAxisShow'] || defaults.yAxisShow,
            //Color
            colorScale = userData['colorScale'] || defaults.colorScale,
            //Events
            onDown = userData['onDown'] || defaults.onDown,
            onUp = userData['onUp'] || defaults.onUp,
            onHover = userData['onHover'] || defaults.onHover,
            onClick = userData['onClick'] || defaults.onClick,
            onLeave = userData['onLeave'] || defaults.onLeave,

            legend = (typeof userData['legend'] === 'undefined') ? defaults.legend : userData['legend'],
            stacked = true, // Streamgraph is always stacked; ignoring default or user properties.
            stack = d3Stack().value((d, k) => d.value[k]).order(stackOrderInsideOut).offset(stackOffsetWiggle);

        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('xAxisType', xAxisType);
        config.put('xAxisFormat', xAxisFormat);
        config.put('xAxisLabel', xAxisLabel);
        config.put('yAxisType', yAxisType);
        config.put('yAxisFormat', yAxisFormat);
        config.put('yAxisLabel', yAxisLabel);
        config.put('yAxisShow', yAxisShow);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('legend', legend);
        config.put('stacked', stacked);
        config.put('stack', stack);

        return config;
    }


}

export default Streamgraph;