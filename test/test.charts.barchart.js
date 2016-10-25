import { assert } from 'chai';
import { SvgBarchartStrategy } from '../src/svg/strategy_barchart';

describe('SvgBarchartStrategy', () => {

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
      var data = [
        { x: 'Male', key: 'Spain', y: 30 },
        { x: 'Male', key: 'France', y: 20 }
      ];
      var marginTop = 251;
      var config = { marginTop };
      var svg = new SvgBarchartStrategy({ data, config, cType: 'Barchart' });
      var resultConfig = svg._loadConfig(config).config;
      resultConfig.should.have.property('marginTop').equals(marginTop);
    });
  });
});


describe('Barchart', () => {
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

  describe('constructor()', () => {
    it('throws a "Missing constructor parameters" if the data parameter is missing', () => {
      assert.throws(() => {
        var barchart = new proteic.Barchart();
      }, Error, 'Missing constructor parameters');
    });

    it('will construct a simple bar chart given some data', () => {
      var data = [
        { x: 'Male', key: 'Spain', y: 30 },
        { x: 'Male', key: 'France', y: 20 }
      ];
      var chart = new proteic.Barchart(data, {});
      assert.isOk(chart);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        var barchart = new proteic.Barchart(data, {});
      }, TypeError, 'Wrong data format');
    });
  });

  describe('chart functions ', () => {
    it.skip('toPNG()', (done) => {
      var data = [{ key: 'serie1', values: [{ x: 0, y: 1 }, { x: 1, y: 2 }] }];
      var chart = new proteic.Barchart(data, {});
      chart.draw();

      //wait for image creation
      setTimeout(() => {
        var result = chart.toPNG((uri) => {
          assert.isOk(uri);
        });
        done();
      }, 500);
    });

    it('addSerie(): should return an error because serie needs to be an object', () => {
      assert.throws(() => {
        var data = [{ key: 'serie1', values: [{ x: 0, y: 1 }, { x: 1, y: 2 }] }];
        var chart = new proteic.Barchart(data, {});
        chart.draw();
        chart.addSerie([{}, {}], true);
      }, Error);
    });

    it('addSeries(): should return an error because serie needs to be an array', () => {
      assert.throws(() => {
        var data = [{ key: 'serie1', values: [{ x: 0, y: 1 }, { x: 1, y: 2 }] }];
        var chart = new proteic.Barchart(data, {});
        var serie = {};

        chart.draw();
        chart.addSeries(serie);

      }, Error);
    });
  });

});