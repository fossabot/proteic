import Chart from './Chart';
import SvgStrategyLinechart from '../svg/strategies/SvgStrategyLinechart';
import Config from '../Config';
import { defaults } from '../utils/defaults/linechart';
import {calculateWidth} from '../utils/screen';


class Linechart extends Chart {

    constructor(data: any) {
        super(new SvgStrategyLinechart());
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
            //Color
            colorScale = userData['colorScale'] || defaults.colorScale,
            //Events
            onDown = userData['onDown'] || defaults.onDown,
            onUp = userData['onUp'] || defaults.onUp,
            onHover = userData['onHover'] || defaults.onHover,
            onClick = userData['onClick'] || defaults.onClick,
            onLeave = userData['onLeave'] || defaults.onLeave,
            //Markers
            markerOutlineWidth = userData['markerOutlineWidth'] || defaults.markerOutlineWidth,
            markerShape = userData['markerShape'] || defaults.markerShape,
            markerSize = (typeof userData['markerSize'] === 'undefined' || userData['markerSize'] < 0) ? defaults.markerSize : userData['markerSize'],
            //Area
            areaOpacity = (typeof userData['areaOpacity'] === 'undefined' || userData['markerSize'] < 0) ? defaults.areaOpacity : userData['areaOpacity'];

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
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('markerOutlineWidth', markerOutlineWidth);
        config.put('markerShape', markerShape);
        config.put('markerSize', markerSize);
        config.put('areaOpacity', areaOpacity);

        return config;
    }


}

export default Linechart;