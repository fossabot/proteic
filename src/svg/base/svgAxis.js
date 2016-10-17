import { SvgContainer } from '../components/svgContainer';
import { calculateWidth } from '../../utils/screen';

export class SvgAxis {

    constructor(context) {
        this._loadConfigOnContext(context.config);
        this.svgContainer = new SvgContainer(this.config);
    }

    changeConfigProperty(p, v) {
        this.config[p] = v;
        if (p === 'width' || p === 'height') {
            this.config.needRescaling = true;
        }
    }

    rescale(width = this.config.width, height = this.config.height) {
        this.axes.rescale(width, height);
        this.config.needRescaling = false;
    }

    _loadConfigOnContext(config, defaults) {
        this.config = {};
        //Selector
        this.config.selector = config.selector || defaults.selector;
        //Margins 
        this.config.marginTop = config.marginTop || defaults.marginTop;
        this.config.marginLeft = config.marginLeft || defaults.marginLeft;
        this.config.marginRight = config.marginRight || defaults.marginRight;
        this.config.marginBottom = config.marginBottom || defaults.marginBottom;
        //Width & height
        this.config.width = config.width
            ? calculateWidth(config.width, this.config.selector) - this.config.marginLeft - this.config.marginRight
            : calculateWidth(defaults.width, this.config.selector) - this.config.marginLeft - this.config.marginRight;
        this.config.height = config.height || defaults.height;
        //Axis
        this.config.xAxisType = config.xAxisType || defaults.xAxisType;
        this.config.xAxisFormat = config.xAxisFormat || defaults.xAxisFormat;
        this.config.xAxisLabel = config.xAxisLabel || defaults.xAxisLabel;
        this.config.yAxisType = config.yAxisType || defaults.yAxisType;
        this.config.yAxisFormat = config.yAxisFormat || defaults.yAxisFormat;
        this.config.yAxisLabel = config.yAxisLabel || defaults.yAxisLabel;

        //Color
        this.config.colorScale = config.colorScale || defaults.colorScale;

        //Events
        this.config.onDown = config.onDown || defaults.onDown;
        this.config.onUp = config.onUp || defaults.onUp;
        this.config.onHover = config.onHover || defaults.onHover;
        this.config.onClick = config.onClick || defaults.onClick;
        this.config.onLeave = config.onLeave || defaults.onLeave;
    }

}