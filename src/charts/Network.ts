import Chart from './Chart';
import SvgStrategyNetwork from '../svg/strategies/SvgStrategyNetwork';
import Config from '../Config';
import { defaults } from '../utils/defaults/network';
import { calculateWidth } from '../utils/screen';
import { copy } from '../utils/functions';


class Network extends Chart {

    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategyNetwork(),
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
            //Color
            colorScale = userData['colorScale'] || defaults.colorScale,
            nodeRadius = userData['nodeRadius'] || defaults.nodeRadius,
            legend = (typeof userData['legend'] === 'undefined') ? defaults.legend : userData['legend'],
            //Events
            onDown = userData['onDown'] || defaults.onDown,
            onUp = userData['onUp'] || defaults.onUp,
            onHover = userData['onHover'] || defaults.onHover,
            onClick = userData['onClick'] || defaults.onClick,
            onLeave = userData['onLeave'] || defaults.onLeave,
            //Network
            weighted = (typeof userData['weighted'] === 'undefined') ? defaults.weighted : userData['weighted'],
            linkWeight = userData['linkWeight'] || defaults.linkWeight,
            nodeWeight = userData['nodeWeight'] || defaults.nodeWeight,
            minLinkValue = userData['minLinkValue'] || defaults.minLinkValue,
            maxLinkValue = userData['maxLinkValue'] || defaults.maxLinkValue,
            minNodeWeight = userData['minNodeWeight'] || defaults.minNodeWeight,
            maxNodeWeight = userData['maxNodeWeight'] || defaults.maxNodeWeight,
            //Labels
            labelShow = (typeof userData['labelShow'] === 'undefined') ? defaults.labelShow : userData['labelShow'],
            labelField = userData['labelField'] || defaults.labelField,
            zoom = (typeof userData['zoom'] === 'undefined') ? defaults.zoom : userData['zoom'];

        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('colorScale', colorScale);
        config.put('nodeRadius', nodeRadius);
        config.put('legend', nodeRadius);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);
        config.put('weighted', weighted);
        config.put('linkWeight', linkWeight);
        config.put('nodeWeight', nodeWeight);
        config.put('minLinkValue', minLinkValue);
        config.put('maxLinkValue', maxLinkValue);
        config.put('minNodeWeight', minNodeWeight);
        config.put('maxNodeWeight', maxNodeWeight);
        config.put('labelShow', labelShow);
        config.put('labelField', labelField);
        config.put('zoom', zoom);
        return config;
    }


}

export default Network;