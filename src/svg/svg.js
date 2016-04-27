class SvgChart {

    constructor(data, config, cType) {
        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = cType;
        this._loadConfigOnContext(config);
    }

    draw(data) {
        if (this._sortData) {
            utils.sortBy(data, {
                prop: this._sortData.prop,
                desc: this._sortData.descending
            });
        }

        if (!this._initialized) {
            this._initialize();
        }

    }

    _applyCSS() {
        var style = this.style;
        var styleValue = null;
        
        for (let key in style) {
            styleValue = style[key];
            d3.selectAll(key).style(styleValue);
        }
    }

    _loadConfigOnContext(config) {
        this.margin = config.margin || _default[this.cType].margin;
        this.width = config.width ||  _default[this.cType].width;
        this.height = config.height ||  _default[this.cType].height;
        this.ticks = config.ticks ||  _default[this.cType].ticks;
        this.tickLabel = config.tickLabel || _default[this.cType].tickLabel
        this.selector = config.selector || _default[this.cType].selector;
        this.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
        this.tooltip = config.tooltip || _default[this.cType].tooltip;
        this.events = {};
        this.events.down = config.events.down || _default[this.cType].events.down;
        this.events.up = config.events.up || _default[this.cType].events.up;
        this.events.over = config.events.over || _default[this.cType].events.over;
        this.events.click = config.events.click || _default[this.cType].events.click;
        this.events.leave = config.events.leave || _default[this.cType].events.leave;
        this._sortData = config.sortData || _default[this.cType].sortData;
        this.style = config.style || _default[this.cType].style;
    }
}