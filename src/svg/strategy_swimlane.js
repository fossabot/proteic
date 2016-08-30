class SvgSwimlaneStrategy {
  constructor(chartContext) {
    this._loadConfigOnContext(chartContext.config);
  }

	/**
	 * Renders a linechart based on data object
	 * @param  {Object} data Data Object. Contains an array with x and y properties.
	 * 
	 */
  draw(data) {
    this.lanes = data.lanes;
    this.items = data.items;
    this.miniHeight = this.lanes.length * 12 + 50
    this.mainHeight = this.height - this.miniHeight - 50;

    var dMin = d3.timeSunday(d3.min(this.items, (d) => new Date(d.start)))
    var dMax = d3.max(this.items, (d) => new Date(d.end));

    this.now = new Date(data.items[0].start);

    this.x = d3.scaleTime().domain([dMin, dMax]).range([0, this.width]);
    this.x1 = d3.scaleTime().range([0, this.width]);
    this.ext = d3.extent(this.lanes, (d) => d.id);
    this.y1 = d3.scaleLinear().domain([this.ext[0], this.ext[1] + 1]).range([0, this.mainHeight]);
    this.y2 = d3.scaleLinear().domain([this.ext[0], this.ext[1] + 1]).range([0, this.miniHeight]);

    if (!this._initialized) {
      this._initialize();
    }

    // draw the items
    this.itemRects = this.main.append('g')
      .attr('clip-path', 'url(#clip)');


    /**
        this.mini.append('g').selectAll('miniItems')
          .data(this.getPaths(this.items))
          .enter().append('path')
          .attr('class', (d) => 'miniItem ' + d.class)
          .attr('d', (d) => d.path);
    **/
    var self = this;
    // invisible hit area to move around the selection window

    /**
    this.mini.append('rect')
      .attr('pointer-events', 'painted')
      .attr('width', this.width)
      .attr('height', this.miniHeight)
      .attr('visibility', 'hidden')
      .on('mouseup', function () {
        var origin = d3.mouse(this);
        var point = self.x.invert(origin[0]);
                        
        console.log(d3.brushSelection());
        
        var halfExtent = (self.brush.extent()[1].getTime() - self.brush.extent()[0].getTime()) / 2;
        var start = new Date(point.getTime() - halfExtent)
        var end = new Date(point.getTime() + halfExtent);
        
        
        console.log('point', point, 'half', halfExtent, 'start', start, 'end', end);
        
        
        self.brush.extent([start, end]);
        self.display(self);
      });
**/
    // draw the selection area
    var self = this;
    this.brush = d3.brushX()
      // .extent([d3.timeMonday(this.now), d3.timeSaturday.ceil(this.now)])
      .extent([[0, 0], [this.width, this.height]])

      .on("brush", () => this.display(this));
    /*
    this.mini.append('g')
    .attr('class', 'x brush')
    .call(this.brush)
    .selectAll('rect')
    .attr('y', 1)
    .attr('height', this.miniHeight - 1);

  this.mini.selectAll('rect.background').remove();
  
  this.display(self);
  **/


  }

  _initialize() {
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














    this.mybrush = d3.brushX().extent([[0, 0], [this.width, 100]])
      .on("end", this.brushended);


    this.mini = this.svg.append("g")
      .attr("class", "axis axis--grid")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisBottom(this.x)
        .ticks(d3.timeMonth, 12)
        .tickSize(-100)
        .tickFormat(function () { return null; }))
      .selectAll(".tick")
      .classed("tick--minor", function (d) { console.log(d); return d.getHours(); });

    this.mini.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisBottom(this.x)
        .ticks(d3.timeYear)
        .tickPadding(0))
      .attr("text-anchor", null)
      .selectAll("text")
      .attr("x", 6);

    this.mini.append("g")
      .attr("class", "brush")
      .call(this.mybrush);





    /**
        this.mini = this.svg.append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + (this.mainHeight + 60) + ')')
          .attr('width', this.width)
          .attr('height', this.miniHeight)
          .attr('class', 'mini');
          **/

    this._initialized = true;

    // draw the x axis
    this.xDateAxis = d3.axisBottom()
      .scale(this.x)
      .ticks(d3.timeMonday, (this.x.domain()[1] - this.x.domain()[0]) > 15552e6 ? 2 : 1)
      .tickFormat(d3.timeFormat('%d'))
      .tickSize(6, 0, 0);

    this.x1DateAxis = d3.axisBottom()
      .scale(this.x1)
      .ticks(d3.timeDay, 1)
      .tickFormat(d3.timeFormat('%a %d'))
      .tickSize(6, 0, 0);

    this.xMonthAxis = d3.axisTop()
      .scale(this.x)
      .ticks(d3.timeMonth, 1)
      .tickFormat(d3.timeFormat('%b %Y'))
      .tickSize(15, 0, 0);

    this.x1MonthAxis = d3.axisTop()
      .scale(this.x1)
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

    /**
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
          **/
    // draw the lanes for the main chart
    this.main.append('g').selectAll('.laneLines')
      .data(this.lanes)
      .enter().append('line')
      .attr('x1', 0)
      .attr('y1', (d) => d3.format('d')(this.y1(d.id)) + 0.5)
      .attr('x2', this.width)
      .attr('y2', (d) => d3.format('d')(this.y1(d.id)) + 0.5)
      .attr('stroke', (d) => d.label === '' ? 'white' : 'lightgray');

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
    /**
    this.mini.append('g')
      .selectAll('.laneLines')
      .data(this.lanes)
      .enter().append('line')
      .attr('x1', 0)
      .attr('y1', (d) => d3.format('d')(this.y2(d.id)) + 0.5)
      .attr('x2', this.width)
      .attr('y2', (d) => d3.format('d')(this.y2(d.id)) + 0.5)
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
**/
    // draw a line representing today's date
    this.main.append('line')
      .attr('y1', 0)
      .attr('y2', this.mainHeight)
      .attr('class', 'main todayLine')
      .attr('clip-path', 'url(#clip)');
    /**
        this.mini.append('line')
          .attr('x1', this.x(this.now) + 0.5)
          .attr('y1', 0)
          .attr('x2', this.x(this.now) + 0.5)
          .attr('y2', this.miniHeight)
          .attr('class', 'todayLine');
          
          **/

  }


  brushended() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.

    console.log(d3.event.selection);
    console.log(d3.event.sourceEvent);
    /**
    var domain0 = d3.event.selection.map(this.x.invert),
        domain1 = domain0.map(d3.timeDay.round);
  
    // If empty when rounded, use floor & ceil instead.
    if (domain1[0] >= domain1[1]) {
      domain1[0] = d3.timeDay.floor(domain0[0]);
      domain1[1] = d3.timeDay.ceil(domain0[1]);
    }
  
  console.log(domain0, domain1);
    d3.select(this)
      .transition()
        .call(brush.move, domain1.map(this.x));
        **/
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



  getPaths() {
    var paths = {}, d, offset = .5 * this.y2(1) + 0.5, result = [];
    for (var i = 0; i < this.items.length; i++) {
      d = this.items[i];
      if (!paths[d.class]) paths[d.class] = '';
      paths[d.class] += ['M', this.x(new Date(d.start)), (this.y2(d.lane) + offset), 'H', this.x(new Date(d.end))].join(' ');
    }

    for (var className in paths) {
      result.push({ class: className, path: paths[className] });
    }

    return result;
  }

  display(self) {
    var rects, labels
      , minExtent = d3.timeDay(this.brush.extent()[0])
      , maxExtent = d3.timeDay(this.brush.extent()[1])
      , visItems = this.items.filter((d) => new Date(d.start) < maxExtent && new Date(d.end) > minExtent);

    //this.mini.select('.brush').call(this.brush.extent([minExtent, maxExtent]));

    this.x1.domain([minExtent, maxExtent]);

    /**
        if ((maxExtent - minExtent) > 1468800000) {
          this.x1DateAxis.ticks(d3.timeMonday, 1).tickFormat(d3.timeFormat('%a %d'))
          this.x1MonthAxis.ticks(d3.timeMonday, 1).tickFormat(d3.timeFormat('%b - Week %W'))
        }
        else if ((maxExtent - minExtent) > 172800000) {
          this.x1DateAxis.ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%a %d'))
          this.x1MonthAxis.ticks(d3.timeMonday, 1).tickFormat(d3.timeFormat('%b - Week %W'))
        }
        else {
          this.x1DateAxis.ticks(d3.timeHour, 4).tickFormat(d3.timeFormat('%I %p'))
          this.x1MonthAxis.ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%b %e'))
        }
    **/

    // shift the today line
    this.main.select('.main.todayLine')
      .attr('x1', this.x1(this.now) + 0.5)
      .attr('x2', this.x1(this.now) + 0.5);

    // update the axis
    this.main.select('.main.axis.date').call(this.x1DateAxis);
    this.main.select('.main.axis.month').call(this.x1MonthAxis)
      .selectAll('text')
      .attr('dx', 5)
      .attr('dy', 12);

    // upate the item rects
    this.rects = this.itemRects.selectAll('rect')
      .data(visItems, (d) => d.id)
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
    labels = this.itemRects.selectAll('text')
      .data(visItems, (d) => d.id)
      .attr('x', (d) => this.x1(Math.max(new Date(d.start), minExtent)) + 2);

    labels
      .enter()
      .append('text')
      //.text((d) => 'DDDDDDDItem\n\n\n\n Id: ' + d.id)
      .attr('x', (d) => this.x1(Math.max(new Date(d.start), minExtent)) + 2)
      .attr('y', (d) => this.y1(d.lane) + .4 * this.y1(1) + 0.5)
      .attr('text-anchor', 'start')
      .attr('class', 'itemLabel');

    labels.exit().remove();
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