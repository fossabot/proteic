class SvgSwimlaneStrategy {
  constructor(chartContext) {
    this._loadConfigOnContext(chartContext.config);

    this.minExtent = null;
    this.maxExtent = null;
  }

  drawItems() {
    
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    this.data = data;
    this.lanes = data.lanes;
    if (this.minExtent !== null && this.maxExtent !== null) {
      this.items = this.items.filter((d) => new Date(d.start) < this.maxExtent && new Date(d.end) > this.minExtent);
    }
    else {
      this.items = data.items;
    }


    this.miniHeight = this.lanes.length * 12 + 50
    this.mainHeight = this.height - this.miniHeight - 50;

    var itemsDMin = d3.timeSunday(d3.min(this.items, (d) => new Date(d.start)))
    var itemsDMax = d3.max(this.items, (d) => new Date(d.end));

    var dataDMin = d3.timeSunday(d3.min(this.data.items, (d) => new Date(d.start)))
    var dataDMax = d3.max(this.data.items, (d) => new Date(d.end));
    

    console.log('Selected items -----', itemsDMin, itemsDMax);
    console.log('Total data ---------', dataDMin, dataDMax);
    this.now = new Date(data.items[0].start);

    this.x = d3.scaleTime().domain([itemsDMin, itemsDMax]).range([0, this.width]);
    this.brushX = d3.scaleTime().domain([dataDMin, dataDMax]).range([0, this.width]);

    this.ext = d3.extent(this.lanes, (d) => d.id);
    this.y1 = d3.scaleLinear().domain([this.ext[0], this.ext[1] + 1]).range([0, this.mainHeight]);
    this.y2 = d3.scaleLinear().domain([this.ext[0], this.ext[1] + 1]).range([0, this.miniHeight]);

    if (!this._initialized) {
      this._initialize();
    }

    var newMiniPath = this.getPaths(this.data.items)[0];

      this.miniItemsPath
        .style('stroke', 'orange')
        .style('stroke-width', 5)
        .style('fill', 'lightorange')
        .attr('d', newMiniPath.path);
    // upate the item rects

    this.rects = this.itemRects.selectAll('rect')
      .data(this.items, (d) => d.id)
      .attr('x', (d) => this.x1(new Date(d.start)))
      .attr('width', (d) => this.x1(new Date(d.end)) - this.x1(new Date(d.start)));


    this.rects
      .enter()
      .append('rect')
      .attr('x', (d) => this.x1(new Date(d.start)))
      .attr('y', (d) => this.y1(d.lane) + .1 * this.y1(1) + 0.5)
      .attr('width', (d) => this.x1(new Date(d.end)) - this.x1(new Date(d.start)))
      .attr('height', (d) => .8 * this.y1(1))
      //.attr('class', (d) => 'mainItem ' + d.class)
      .on('click', function (d) {
        alert(JSON.stringify(d));
      });

    this.rects.exit().remove();

    // update the item labels
    var labels = this.itemRects.selectAll('text')
      .data(this.items, (d) => d.id)
      .attr('x', (d) => this.x1(Math.max(new Date(d.start), this.minExtent)) + 2);

    labels
      .enter()
      .append('text')
      .text((d) => 'Item\n\n\n\n Id: ' + d.id)
      .attr('x', (d) => this.x1(Math.max(new Date(d.start), this.minExtent)) + 2)
      .attr('y', (d) => this.y1(d.lane) + .4 * this.y1(1) + 0.5)
      .attr('text-anchor', 'start')
      .attr('class', 'itemLabel');

    labels.exit().remove();

  }

  _initialize() {
    this.x1 = d3.scaleTime().range([0, this.width]);

    this.svg = d3.select(this.selector)
      .append('svg:svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'chart');

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.mainHeight);

    this.main = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('width', this.width)
      .attr('height', this.mainHeight)
      .attr('class', 'main');

    this.mini = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + (this.mainHeight + 60) + ')')
      .attr('width', this.width)
      .attr('height', this.miniHeight)
      .attr('class', 'mini');
    this._initialized = true;

    // draw the x axis
    this.xDateAxis = d3.axisBottom(this.x)
      .ticks(d3.timeMonday, (this.x.domain()[1] - this.x.domain()[0]) > 15552e6 ? 2 : 1)
      .tickFormat(d3.timeFormat('%d'))
      .tickSize(6, 0, 0);

    this.x1DateAxis = d3.axisBottom(this.x1)
      .ticks(d3.timeDay, 1)
      .tickFormat(d3.timeFormat('%a %d'))
      .tickSize(6, 0, 0);

    this.xMonthAxis = d3.axisTop(this.x)
      .ticks(d3.timeMonth, 1)
      .tickFormat(d3.timeFormat('%b %Y'))
      .tickSize(15, 0, 0);

  /**
    this.x1MonthAxis = d3.axisTop(this.x1)
      .ticks(d3.timeMonday, 1)
      .tickFormat(d3.timeFormat('%b - Week %W'))
      .tickSize(15, 0, 0);
    this.main.append('g')
      .attr('transform', 'translate(0,' + this.mainHeight + ')')
      .attr('class', 'main axis date')
      .call(this.x1DateAxis);
    
    this.main.append('g')
      .attr('transform', 'translate(0,0.5)')
      .attr('class', 'main axis month')
      .call(this.x1MonthAxis)
      .selectAll('text')
      .attr('dx', 5)
      .attr('dy', 12);
**/
    this.mini.append('g')
      .attr('transform', 'translate(0,' + this.miniHeight + ')')
      .attr('class', 'axis date')
      .call(this.xDateAxis);

    this.mini.append('g')
      .attr('transform', 'translate(0,0.5)')
      .attr('class', 'axis month')
      .call(this.xMonthAxis)
      .selectAll('text')
      .attr('dx', 5)
      .attr('dy', 12);

    // draw the lanes for the main chart
    this.main.append('g').selectAll('.laneLines')
      .data(this.lanes)
      .enter().append('line')
      .attr('x1', 0)
      .attr('y1', (d) => (this.y1(d.id)))
      .attr('x2', this.width)
      .attr('y2', (d) => (this.y1(d.id)))
      .attr('stroke', 'lightgray');

    this.main.append('g').selectAll('.laneText')
      .data(this.lanes)
      .enter().append('text')
      .text((d) => d.label)
      .attr('x', -10)
      .attr('y', (d) => this.y1(d.id + .5))
      .attr('dy', '0.5ex')
      .attr('text-anchor', 'end')
      .attr('class', 'laneText');

    // draw the lanes for the mini chart
    this.mini.append('g')
      .selectAll('.laneLines')
      .data(this.lanes)
      .enter().append('line')
      .attr('x1', 0)
      .attr('y1', (d) => (this.y2(d.id)))
      .attr('x2', this.width)
      .attr('y2', (d) => (this.y2(d.id)))
      .attr('stroke', (d) => d.label === '' ? 'white' : 'lightgray');

    this.mini.append('g')
      .selectAll('.laneText')
      .data(this.lanes)
      .enter().append('text')
      .text((d) => d.label)
      .attr('x', -10)
      .attr('y', (d) => this.y2(d.id + .5))
      .attr('dy', '0.5ex')
      .attr('text-anchor', 'end')
      .attr('class', 'laneText');

    var self = this;
    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.miniHeight]])
      .on('end', function () {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var domain = d3.event.selection.map(self.x.invert);
        //var domain1 = domain0.map(d3.timeDay.round);
        self.minExtent = domain[0];
        self.maxExtent = domain[1];

        console.log(domain[0], domain[1]);
        
        self.x.domain([self.minExtent, self.maxExtent]);
        self.x1.domain([self.minExtent, self.maxExtent]);

        self.draw(self.data);
      });

    this.mini.append('rect')
      .attr('pointer-events', 'painted')
      .attr('width', this.width)
      .attr('height', this.miniHeight)
      .attr('visibility', 'hidden');

    this.mini
      .append('g')
      .attr('class', 'brush')
      .call(this.brush);
    // draw the items
    this.itemRects = this.main.append('g')
      .attr('clip-path', 'url(#clip)');


    this.miniItemsPath = this.mini.append('g').append('path');


  }

	/**
	 * This method adds config options to the chart context.
	 * @param  {Object} config Config object
	 */
  _loadConfigOnContext(config) {
    if (!config.events) {
      config.events = {};
    }
    this.selector = config.selector || _default[this.cType].selector;
    this.margin = config.margin || _default[this.cType].margin;
    this.width = config.width ? this._calculateWidth(config.width) - this.margin.left - this.margin.right
      : this._calculateWidth(_default[this.cType].width) - this.margin.left - this.margin.right;
    this.height = config.height || _default[this.cType].height;
    this.events = {};
    this.events.down = config.events.down || _default[this.cType].events.down;
    this.events.up = config.events.up || _default[this.cType].events.up;
    this.events.over = config.events.over || _default[this.cType].events.over;
    this.events.click = config.events.click || _default[this.cType].events.click;
    this.events.leave = config.events.leave || _default[this.cType].events.leave;
    return this;
  }



  getPaths(items) {
  // var dMin = d3.timeSunday(d3.min(this.data.items, (d) => new Date(d.start)))
  // var dMax = d3.max(this.data.items, (d) => new Date(d.end));
  //  this.brushX = d3.scaleTime().domain([dMin, dMax]).range([0, this.width]);

    var paths = {}, d, offset = .5 * this.y2(1) + 0.5, result = [];
    for (var i = 0; i < items.length; i++) {
      d = items[i];

      if (!paths[d.class]) paths[d.class] = '';
      paths[d.class] += ['M', this.brushX(new Date(d.start)), (this.y2(d.lane) + offset), 'H', this.brushX(new Date(d.end))].join(' ');
    }

    for (var className in paths) {
      result.push({ class: className, path: paths[className] });
    }
    return result;
  }




  _calculateWidth(width) {
    if (width === 'auto') {
      return d3.select(this.selector)
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
      containerWidth = d3.select(this.selector)
        .node()
        .getBoundingClientRect()
        .width;
      percentage = width.split('%')[0];
      return Math.round(percentage * containerWidth / 100);
    } else {
      throw Error('Unknow chart width: ' + width);
    }

  }
}