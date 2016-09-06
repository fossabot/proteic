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

    _initialize() {
        var width = this.config.width + this.config.margin.left + this.config.margin.right;
        var height = this.config.height + this.config.margin.top + this.config.margin.bottom;

        //Create a global 'g' (group) element
        this.svg = d3
            .select(this.config.selector)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');

        //Append a new group with 'x' aXis
        this.svg
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.config.height + ')')
            .call(this.xAxis);


        this.svg
            .append('g')
            .attr('class', 'y axis')
            .attr('stroke-dasharray', '1, 2')
            .call(this.yAxis)
            .append('text');

        // Append axes labels
        this.svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'x axis label')
            .attr('x', this.config.width / 2)
            .attr('y', this.config.height + this.config.margin.bottom)
            .text(this.xAxisLabel);

        this.svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'y axis label')
            .attr('transform', 'rotate(-90)')
            .attr('x', - this.config.height / 2)
            .attr('y', - this.config.margin.left / 1.3)
            .text(this.yAxisLabel);
    }

    _applyCSS() {
        var style = this.style;
        var styleValue = null;

        for (let key in style) {
            styleValue = style[key];
            for (let v in styleValue) {
                d3.selectAll(key).style(v, styleValue[v]);
            }
        }
    }

    on(events = {}) {
        for (let key in events) {
            let action = events[key];
            this.interactiveElements.on(key + '.user', action);
        }

    }
    _calculateWidth(width) {
        if (width === 'auto') {
            return d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
        }
        else if (utils.isNumeric(width)) {
            //check container width TODO
            return width;
        }
        else if (utils.isPercentage(width)) {
            let containerWidth, percentage;
            containerWidth = d3.select(this.config.selector)
                .node()
                .getBoundingClientRect()
                .width;
            percentage = width.split('%')[0];
            return Math.round(percentage * containerWidth / 100);
        } else {
            throw Error('Unknow chart width: ' + width);
        }

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
        this.config = {};
        this.config.cType = this.constructor.name;
        this.config.selector = config.selector || _default[this.cType].selector;
        this.config.margin = config.margin || _default[this.cType].margin;
        this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right
            : this._calculateWidth(_default[this.cType].width) - this.config.margin.left - this.config.margin.right;
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
    _updateXaxis() {
        this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
    }
    _updateYaxis() {
        this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);
    }
    _updateAxis() {
        this._updateXaxis();
        this._updateYaxis();
    }
}