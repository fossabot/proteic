class SvgChart {

    constructor(chartContext) {
        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = chartContext.cType;
        this._loadConfigOnContext(chartContext.config);

        this.interactiveElements = null;
    }

    _loadConfigOnContext(config) {
        config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
        if (!config.events) {
            config.events = {};
        }
        if (!config.markers) {
            config.markers = {};
        }
        if (!config.xaxis) {
            config.xaxis = {};
        }
        if (!config.yaxis) {
            config.yaxis = {};
        }
        if (!config.x) {
            config.x = {};
        }
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || _default[this.cType].selector;
        this.config.margin = config.margin || _default[this.cType].margin;
        this.config.width = config.width ? utils.screen.calculateWidth(config.width, this.config.selector) - this.config.margin.left - this.config.margin.right
            : utils.screen.calculateWidth(_default[this.cType].width, this.config.selector) - this.config.margin.left - this.config.margin.right;
        this.config.height = config.height || _default[this.cType].height;
        this.config.ticks = config.ticks || _default[this.cType].ticks;
        this.config.xticks = config.xaxis.ticks || _default[this.cType].xaxis.ticks;
        this.config.yticks = config.yaxis.ticks || _default[this.cType].yaxis.ticks;
        this.config.tickLabel = config.tickLabel || _default[this.cType].tickLabel;
        this.config.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
        //this.tooltip is d3-tip, so that renaming this bar to 'tip' is required
        this.config.tip = config.tooltip || _default[this.cType].tooltip;
        this.config.events = {};
        this.config.events.down = config.events.down || _default[this.cType].events.down;
        this.config.events.up = config.events.up || _default[this.cType].events.up;
        this.config.events.over = config.events.over || _default[this.cType].events.over;
        this.config.events.click = config.events.click || _default[this.cType].events.click;
        this.config.events.leave = config.events.leave || _default[this.cType].events.leave;
        this.config._sortData = config.sortData || _default[this.cType].sortData;
        this.config.style = config.style || _default[this.cType].style;
        this.config.colorScale = config.colorScale || _default[this.cType].colorScale;
        this.config.xAxisLabel = config.xaxis.label || _default[this.cType].xaxis.label;
        this.config.yAxisLabel = config.yaxis.label || _default[this.cType].yaxis.label;
    }

    _endAllTransitions(transition, callback) {
        var n;
        if (transition.empty()) {
            callback();
        }
        else {
            n = transition.size();
            transition.each('end', () => {
                n--;
                if (n === 0) {
                    callback();
                }
            });
        }
    }

    _removeUserEvents() {
        var userEvents = [
            'mousedown.user',
            'mouseup.user',
            'mouseleave.user',
            'mouseover.user',
            'click.user',
            'mouseover.tip',
            'mouseout.tip'
        ];
        for (let key in userEvents) {
            this.interactiveElements.on(userEvents[key], null);
        }
    }

}