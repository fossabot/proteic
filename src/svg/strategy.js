import {SvgContainer} from './components/svgContainer';

export class SvgStrategy {

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

}