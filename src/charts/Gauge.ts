import Chart from './Chart';
import SvgStrategyGauge from '../svg/strategies/SvgStrategyGauge';
import Config from '../Config';
import { defaults } from '../utils/defaults/gauge';
import { calculateWidth } from '../utils/screen';


class Gauge extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyGauge(),
            data,
            userConfig
        );
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
            //Color
            colorScale = userData['colorScale'] || defaults.colorScale,
            invertColorScale = (typeof userData['invertColorScale'] === 'undefined') ? defaults.invertColorScale : userData['invertColorScale'],
            //Gauge params
            minLevel = userData['minLevel'] || defaults.minLevel,
            maxLevel = userData['maxLevel'] || defaults.maxLevel,
            minAngle = userData['minAngle'] || defaults.minAngle,
            maxAngle = userData['maxAngle'] || defaults.maxAngle,
            ringWidth = userData['ringWidth'] || defaults.ringWidth,
            ringMargin = userData['ringMargin'] || defaults.ringMargin,
            labelInset = userData['labelInset'] || defaults.labelInset,
            needleNutRadius = userData['needleNutRadius'] || defaults.needleNutRadius,
            needleLenghtRatio = userData['needleLenghtRatio'] || defaults.needleLenghtRatio,
            numericIndicator = (typeof userData['numericIndicator'] === 'undefined') ? defaults.numericIndicator : userData['numericIndicator'],
            label = userData['label'] || defaults.label,
            ticks = userData['ticks'] || defaults.ticks,
            propertyValue = userData['propertyValue'] || defaults.propertyValue;

        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('colorScale', colorScale);
        config.put('invertColorScale', invertColorScale);
        config.put('minLevel', minLevel);
        config.put('maxLevel', maxLevel);
        config.put('minAngle', minAngle);
        config.put('maxAngle', maxAngle);
        config.put('ringWidth', ringWidth);
        config.put('ringMargin', ringMargin);
        config.put('labelInset', labelInset);
        config.put('needleNutRadius', needleNutRadius);
        config.put('needleLenghtRatio', needleLenghtRatio);
        config.put('numericIndicator', numericIndicator);
        config.put('label', label);
        config.put('ticks', ticks);
        config.put('propertyValue', propertyValue);

        return config;
    }

    public keepDrawing(datum: any) {
        this.data = [datum[0]];
        super.draw();
    }


}

export default Gauge;