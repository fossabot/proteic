import Chart from './Chart';
import SvgStrategySwimlane from '../svg/strategies/SvgStrategySwimlane';
import Config from '../Config';
import { defaults } from '../utils/defaults/swimlane';
import { calculateWidth } from '../utils/screen';
import {
    stackOrderInsideOut,
    stackOffsetWiggle,
    stack as d3Stack
} from 'd3';
import {copy} from '../utils/functions';

class Swimlane extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategySwimlane(),
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
            marginTop = (userData['marginTop'] !== undefined) ? userData['marginTop'] : defaults.marginTop,
            marginLeft = (userData['marginLeft'] !== undefined) ? userData['marginLeft'] : defaults.marginLeft,
            marginRight = (userData['marginRight'] !== undefined) ? userData['marginRight'] : defaults.marginRight,
            marginBottom = (userData['marginBottom'] !== undefined) ? userData['marginBottom'] : defaults.marginBottom,
            //Width & height
            width = userData['width']
                ? calculateWidth(userData['width'], selector) - marginLeft - marginRight
                : calculateWidth(defaults.width, selector) - marginLeft - marginRight,
            height = userData['height'] || defaults.height,
            //Axis
            xAxisType = userData['xAxisType'] || defaults.xAxisType,
            xAxisFormat = userData['xAxisFormat'] || defaults.xAxisFormat,
            xAxisLabel = userData['xAxisLabel'] || defaults.xAxisLabel,
            xAxisGrid = (typeof userData['xAxisGrid'] === 'undefined') ? defaults.xAxisGrid : userData['xAxisGrid'],
            yAxisType = userData['yAxisType'] || defaults.yAxisType,
            yAxisFormat = userData['yAxisFormat'] || defaults.yAxisFormat,
            yAxisLabel = userData['yAxisLabel'] || defaults.yAxisLabel,
            yAxisShow = userData['yAxisShow'] || defaults.yAxisShow,
            yAxisGrid = (typeof userData['yAxisGrid'] === 'undefined') ? defaults.yAxisGrid : userData['yAxisGrid'],

            //Color
            colorScale = userData['colorScale'] || defaults.colorScale,
            //Events
            onDown = userData['onDown'] || defaults.onDown,
            onUp = userData['onUp'] || defaults.onUp,
            onHover = userData['onHover'] || defaults.onHover,
            onClick = userData['onClick'] || defaults.onClick,
            onLeave = userData['onLeave'] || defaults.onLeave,

            legend = (typeof userData['legend'] === 'undefined') ? defaults.legend : userData['legend'],
            
            propertyStart = userData['propertyStart'] || defaults.propertyStart,
            propertyEnd = userData['propertyEnd'] || defaults.propertyEnd,
            propertyKey = userData['propertyKey'] || defaults.propertyKey;


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
        config.put('xAxisGrid', xAxisGrid);
        config.put('yAxisType', yAxisType);
        config.put('yAxisFormat', yAxisFormat);
        config.put('yAxisLabel', yAxisLabel);
        config.put('yAxisShow', yAxisShow);
        config.put('yAxisGrid', yAxisGrid);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('onUp', onUp);
        config.put('legend', legend);
        config.put('propertyStart', propertyStart);
        config.put('propertyEnd', propertyEnd);
        config.put('propertyKey', propertyKey);

        return config;
    }
}

export default Swimlane;