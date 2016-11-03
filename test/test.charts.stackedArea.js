import {assert} from 'chai';
import {SvgStackedAreaStrategy} from '../src/svg/strategy_stackedArea';

describe('SvgStackedAreaStrategy', () => {

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
    it.skip('should apply the default configuration if a custom one is ommited', () => {
      var data = [
        {'key': 'ES', x: '01/08/13', y:30},
        {'key': 'UK', x: '01/08/13', y:40},
        {'key': 'ES', x: '01/09/13', y:10},
        {'key': 'UK', x: '01/09/13', y:10},
        {'key': 'ES', x: '01/10/13', y:70},
        {'key': 'UK', x: '01/10/13', y:30},
        {'key': 'ES', x: '01/11/13', y:50},
        {'key': 'UK', x: '01/11/13', y:50},
        {'key': 'ES', x: '01/12/13', y:25},
        {'key': 'UK', x: '01/12/13', y:75},
        {'key': 'ES', x: '01/13/13', y:80},
        {'key': 'UK', x: '01/13/13', y:20},
        {'key': 'ES', x: '01/14/13', y:90},
        {'key': 'UK', x: '01/14/13', y:10}
      ];
      var marginTop = 251;
      var config = { marginTop };
      var svg = new SvgStackedAreaStrategy({ data, config, cType: 'StackedArea' });
      var resultConfig = svg._loadConfig(config).config;
      resultConfig.should.have.property('marginTop').equals(marginTop);
    });
  });
});

describe('StackedArea', () => {
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
        var chart = new proteic.StackedArea();
      }, Error, 'Missing constructor parameters');
    });

    it('should ignore parameters after the second one.', () => {
      var data = [
        {'key': 'ES', x: '01/08/13', y:30},
        {'key': 'UK', x: '01/08/13', y:40},
        {'key': 'ES', x: '01/09/13', y:10},
        {'key': 'UK', x: '01/09/13', y:10},
        {'key': 'ES', x: '01/10/13', y:70},
        {'key': 'UK', x: '01/10/13', y:30},
        {'key': 'ES', x: '01/11/13', y:50},
        {'key': 'UK', x: '01/11/13', y:50},
        {'key': 'ES', x: '01/12/13', y:25},
        {'key': 'UK', x: '01/12/13', y:75},
        {'key': 'ES', x: '01/13/13', y:80},
        {'key': 'UK', x: '01/13/13', y:20},
        {'key': 'ES', x: '01/14/13', y:90},
        {'key': 'UK', x: '01/14/13', y:10}
      ];
      var config = {};
      var chart = new proteic.StackedArea(data, config, 'foo');
      assert.isOk(chart);
    });

    it('will construct a line chart given some data', () => {
      var data = [
        {'key': 'ES', x: '01/08/13', y:30},
        {'key': 'UK', x: '01/08/13', y:40},
        {'key': 'ES', x: '01/09/13', y:10},
        {'key': 'UK', x: '01/09/13', y:10},
        {'key': 'ES', x: '01/10/13', y:70},
        {'key': 'UK', x: '01/10/13', y:30},
        {'key': 'ES', x: '01/11/13', y:50},
        {'key': 'UK', x: '01/11/13', y:50},
        {'key': 'ES', x: '01/12/13', y:25},
        {'key': 'UK', x: '01/12/13', y:75},
        {'key': 'ES', x: '01/13/13', y:80},
        {'key': 'UK', x: '01/13/13', y:20},
        {'key': 'ES', x: '01/14/13', y:90},
        {'key': 'UK', x: '01/14/13', y:10}
      ];
      var chart = new proteic.StackedArea(data, {});
      assert.isOk(chart);
    });

    it('should construct a line chart with some custom configuration', () => {
      var data = [
        {'key': 'ES', x: '01/08/13', y:30},
        {'key': 'UK', x: '01/08/13', y:40},
        {'key': 'ES', x: '01/09/13', y:10},
        {'key': 'UK', x: '01/09/13', y:10},
        {'key': 'ES', x: '01/10/13', y:70},
        {'key': 'UK', x: '01/10/13', y:30},
        {'key': 'ES', x: '01/11/13', y:50},
        {'key': 'UK', x: '01/11/13', y:50},
        {'key': 'ES', x: '01/12/13', y:25},
        {'key': 'UK', x: '01/12/13', y:75},
        {'key': 'ES', x: '01/13/13', y:80},
        {'key': 'UK', x: '01/13/13', y:20},
        {'key': 'ES', x: '01/14/13', y:90},
        {'key': 'UK', x: '01/14/13', y:10}
      ];
      var width = 250;
      var margin = { left: 0, right: 0, top: 0, bottom: 0 };
      var config = { width, margin };
      var chart = new proteic.StackedArea(data, config);
      var svg = null;

      chart.draw();
      assert.isOk(chart);
      svg = document.getElementsByTagName('svg')[0];

      parseInt(svg.getAttribute('width')).should.equals(width);
    });

    it.skip('should construct a line chart with streaming data', function (done) {
      var streamingData = {
        endpoint: 'ws://localhost:3000/socket.io/?EIO=3&transport=websocket'
      };
      var datasource = new proteic.WebsocketDatasource(streamingData);
      var chart = new proteic.StackedArea(datasource, {});

      this.timeout(5000);
      chart.start();

      setTimeout(() => {
        done();
      }, 3000);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        var chart = new proteic.StackedArea(data, {});
      }, TypeError, 'Wrong data format');
    });
  });

  describe('chart functions', () => {
    it.skip('toPNG()', (done) => {
      var data = [
        {'key': 'ES', x: '01/08/13', y:30},
        {'key': 'UK', x: '01/08/13', y:40},
        {'key': 'ES', x: '01/09/13', y:10},
        {'key': 'UK', x: '01/09/13', y:10},
        {'key': 'ES', x: '01/10/13', y:70},
        {'key': 'UK', x: '01/10/13', y:30},
        {'key': 'ES', x: '01/11/13', y:50},
        {'key': 'UK', x: '01/11/13', y:50},
        {'key': 'ES', x: '01/12/13', y:25},
        {'key': 'UK', x: '01/12/13', y:75},
        {'key': 'ES', x: '01/13/13', y:80},
        {'key': 'UK', x: '01/13/13', y:20},
        {'key': 'ES', x: '01/14/13', y:90},
        {'key': 'UK', x: '01/14/13', y:10}
      ];
      var chart = new proteic.StackedArea(data, {});
      chart.draw();
      //wait for image creation
      setTimeout(() => {
        var result = chart.toPNG((uri) => {
          assert.isOk(uri);
        });
        done();
      }, 600);
    });

    it('addSerie(): should return an error because serie needs to be an object', () => {
      assert.throws(() => {
        var data = [
          {'key': 'ES', x: '01/08/13', y:30},
          {'key': 'UK', x: '01/08/13', y:40},
          {'key': 'ES', x: '01/09/13', y:10},
          {'key': 'UK', x: '01/09/13', y:10},
          {'key': 'ES', x: '01/10/13', y:70},
          {'key': 'UK', x: '01/10/13', y:30},
          {'key': 'ES', x: '01/11/13', y:50},
          {'key': 'UK', x: '01/11/13', y:50},
          {'key': 'ES', x: '01/12/13', y:25},
          {'key': 'UK', x: '01/12/13', y:75},
          {'key': 'ES', x: '01/13/13', y:80},
          {'key': 'UK', x: '01/13/13', y:20},
          {'key': 'ES', x: '01/14/13', y:90},
          {'key': 'UK', x: '01/14/13', y:10}
        ];
        var chart = new proteic.StackedArea(data, {});
        chart.draw();
        chart.addSerie([{}, {}], true);
      }, Error);
    });

    it('addSeries(): should return an error because serie needs to be an array', () => {
      assert.throws(() => {
        var data = [
          {'key': 'ES', x: '01/08/13', y:30},
          {'key': 'UK', x: '01/08/13', y:40},
          {'key': 'ES', x: '01/09/13', y:10},
          {'key': 'UK', x: '01/09/13', y:10},
          {'key': 'ES', x: '01/10/13', y:70},
          {'key': 'UK', x: '01/10/13', y:30},
          {'key': 'ES', x: '01/11/13', y:50},
          {'key': 'UK', x: '01/11/13', y:50},
          {'key': 'ES', x: '01/12/13', y:25},
          {'key': 'UK', x: '01/12/13', y:75},
          {'key': 'ES', x: '01/13/13', y:80},
          {'key': 'UK', x: '01/13/13', y:20},
          {'key': 'ES', x: '01/14/13', y:90},
          {'key': 'UK', x: '01/14/13', y:10}
        ];
        var chart = new proteic.StackedArea(data, {});
        var serie = {};

        chart.draw();
        chart.addSeries(serie);

      }, Error);
    });

  });
});
