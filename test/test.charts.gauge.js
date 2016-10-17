import {assert} from 'chai';
import {SvgGaugeStrategy} from '../src/svg/strategy_gauge';


describe('SvgGaugeStrategy', () => {

  beforeEach(() => {
    //Append default chart div
    var div = document.createElement('div');
    div.innerHTML = '<div id="chart"></div>';
    document.body.appendChild(div);
  });

  afterEach(() => {
    var el = document.getElementById('chart');
    el.parentNode.removeChild(el);
  });

  describe('_loadConfig(config)', () => {
    it('should apply the default configuration if a custom one is ommited', () => {
      var data = [{ x: 86 }];
      var minLevel = 15;
      var maxLevel = 103;
      var config = { minLevel, maxLevel };
      var svg = new SvgGaugeStrategy({ data, config, cType: 'Gauge' });
      var resultConfig = svg._loadConfig(config).config;
      resultConfig.should.have.property('minLevel').equals(minLevel);
      resultConfig.should.have.property('maxLevel').equals(maxLevel);
    });
  });
});

describe('Gauge', () => {
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
        var gauge = new proteic.Gauge();
      }, Error, 'Missing constructor parameters');
    });

    it('should ignore parameters after the second one.', () => {
      var data = [{ x: 86 }];
      var config = {};
      var gauge = new proteic.Gauge(data, config, 'foo');
      assert.isOk(gauge);
    });

    it('will construct a gauge chart given some data', () => {
      var data = [{ x: 86 }];
      var chart = new proteic.Gauge(data, {});
      assert.isOk(chart);
    });

    it('should construct a gauge chart with some custom configuration', () => {
      var data = [{ x: 86 }];
      var width = 250;
      var margin = { left: 0, right: 0, top: 0, bottom: 0 };
      var config = { width, margin };
      var chart = new proteic.Gauge(data, config);
      var svg = null;

      chart.draw();
      assert.isOk(chart);
      svg = document.getElementsByTagName('svg')[0];

      parseInt(svg.getAttribute('width')).should.equals(width);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        var gauge = new proteic.Gauge(data, {});
      }, TypeError, 'Wrong data format');
    });
  });
  
});
