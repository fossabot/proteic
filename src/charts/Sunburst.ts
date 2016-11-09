import Chart from "./Chart";
import Config from "../Config";
import SvgStrategySunburst from "../svg/strategies/SvgStrategySunburst";
import {defaults} from "../utils/defaults/sunburst";
import {calculateWidth} from "../utils/screen";
import {copy} from "../utils/functions";

class Sunburst extends Chart {


    constructor(data: any, userConfig: any = {}) {
        super(
            new SvgStrategySunburst(),
            data,
            userConfig
        );
    }

    protected loadConfigFromUser(userData: { [key: string]: any }): Config {
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
            //Events
            onDown = userData['onDown'] || defaults.onDown,
            onUp = userData['onUp'] || defaults.onUp,
            onHover = userData['onHover'] || defaults.onHover,
            onClick = userData['onClick'] || defaults.onClick,
            onLeave = userData['onLeave'] || defaults.onLeave;

        config.put('selector', selector);
        config.put('marginTop', marginTop);
        config.put('marginLeft', marginLeft);
        config.put('marginRight', marginRight);
        config.put('marginBottom', marginBottom);
        config.put('width', width);
        config.put('height', height);
        config.put('colorScale', colorScale);
        config.put('onDown', onDown);
        config.put('onUp', onUp);
        config.put('onHover', onHover);
        config.put('onClick', onClick);
        config.put('onLeave', onLeave);

        return config;
    }

    protected keepDrawing(datum: any) {
        let datumType = datum.constructor;
        if (datumType === Array) {
            if (this.data) {
                this.data = this.data.concat(datum);
            } else {
                this.data = datum;
            }
        }
        else {
            this.data.push(datum);
        }
        this.draw(copy(this.data));
    }

}

export default Sunburst;