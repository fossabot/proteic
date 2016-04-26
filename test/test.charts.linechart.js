describe('SvgLinechartStrategy', () => {
  describe('_loadConfigOnContext(config)', () => {
    it('should apply the default configuration if a custom one is ommited', () => {
      var data = [{ x: 0, y: 1 }, { x: 0, y: 2 }];
      var width = 250, height = 100;
      var config = { width: width, height: height };
      
      var svg = new SvgLinechartStrategy(data, config, 'Linechart');
      var result = svg._loadConfigOnContext(config);
      result.should.have.property('width').equals(width);
      result.should.have.property('height').equals(height);
    });
  });
});

describe('Linechart', () => {
  beforeEach(() => {
    //Append default chart div
    var div = document.createElement('div');
    div.innerHTML = '<div id="chart"></div>';
    document.body.appendChild(div);
  });

  afterEach(() => {
    //Remove default chart div
    var el = document.getElementById('chart');
    el.parentNode.removeChild(el);
  });

  describe('constructor()', () => {
    it('throws a "Missing constructor parameters" if the data parameter is missing', () => {
      assert.throws(() => {
        new Linechart()
      }, Error, 'Missing constructor parameters');
    });

    it('throws an error if the number of parameters is greater than 2', () => {
      assert.throws(() => {
        var data = [{ x: 0, y: 1 }, { x: 0, y: 2 }];
        var config = {}
        new Linechart(data, config, 'foo')
      }, Error, 'Unrecognized number of paremeters');
    });

    it('will construct a line chart given some data', () => {
      var data = [{ x: 0, y: 1 }, { x: 0, y: 2 }];
      var chart = new Linechart(data);
      assert.isOk(chart);
    });

    it('should construct a line chart with some custom configuration', () => {
      var data = [{ x: 0, y: 1 }, { x: 0, y: 2 }];
      var width = 250, height = 100;
      var config = { width: width, height: height };
      var chart = new Linechart(data, config);
      assert.isOk(chart);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        new Linechart(data)
      }, TypeError, 'Wrong data format');
    });
  });

  describe('chart functions', () => {
    it('toPNG()', (done) => {
      var data = [{ x: 0, y: 1 }, { x: 1, y: 2 }];
      var chart = new Linechart(data);
      chart.draw();
      //wait for image creation
      setTimeout(() => {
        var result = chart.toPNG((uri) => {
          assert.isOk(uri);
        });
        done();
      }, 600);
    });
  });
});