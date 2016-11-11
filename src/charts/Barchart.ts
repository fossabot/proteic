import Chart from './Chart';
import SvgStrategyBarchart from '../svg/strategies/SvgStrategyBarchart';
import Config from '../Config';
import { defaults } from '../utils/defaults/barchart';
import { calculateWidth } from '../utils/screen';
import {copy} from '../utils/functions';
import {stack as d3stack} from 'd3';

class Barchart extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyBarchart(),
            data,
            userConfig
        );
    }

    fire(event: string, data: string) {//TODO: improve this section
        if (event === 'transition') {
            if (data === 'grouped') {
                this.config.put('stacked', false);
            }
            else if (data === 'stacked') {
                this.config.put('stacked', true);
            }
            this.draw();
        }
    }

    public keepDrawing(datum: any) {
        let datumType = datum.constructor;
        if (datumType === Array) {
            this.data = datum;
        }
        else {
            for (let i = 0; i < this.data.length; i++) {
                var d = this.data[i];
                if (d['x'] === datum['x']) {
                    this.data[i] = datum;
                    break;
                }
            }
        }
        this.draw(copy(this.data));
    }



    protected loadConfigFromUser(userData: { [key: string]: any; }): Config {
        let config = new Config(), // TODO change initializations
            //Selector
            selector = userData['selector'] || defaults.selector,
            //Margins 
            marginTop = userData['marginTop'] || defaults.marginTop,
            marginLeft = (userData['marginLeft']  != "undefined") ?  userData['marginLeft']  :  defaults.marginLeft,
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

            stacked = (typeof userData['stacked'] === 'undefined') ? defaults.stacked : userData['stacked'],
            stack = d3stack().value((d, k) => d.value[k]),

            legend = (typeof userData['legend'] === 'undefined') ? defaults.legend : userData['legend'];

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

export default Barchart;