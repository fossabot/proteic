import { assert } from 'chai';
import { SvgSunburstStrategy } from '../src/svg/strategy_sunburst';


describe('SvgSunburstStrategy', () => {
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
    it('should apply a custom configuration', () => {
      var data = [
        { "id": "root", "parent": "", "value": "0", "label": "sequences" },
        { "id": "1", "parent": "root", "value": "50", "label": "home" },
        { "id": "2", "parent": "root", "value": "0", "label": "about"},
        { "id": "2.1", "parent": "2", "value": "25", "label": "contact"},
        { "id": "3", "parent": "root", "value": "0", "label": "product"},
        { "id": "3.1", "parent": "3", "value": "0", "label": "product"},
        { "id": "3.1.1", "parent": "3.1", "value": "25", "label": "cart"}
      ];
      var marginBottom = 201;
      var config = { marginBottom };
      var svg = new SvgSunburstStrategy({ data, config, cType: 'Sunburst' });
      var resultConfig = svg._loadConfig(config).config;
      resultConfig.should.have.property('marginBottom').equals(marginBottom);
    });
  });
});

describe('Sunburst', () => {
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
        var chart = new proteic.Sunburst();
      }, Error, 'Missing constructor parameters');
    });

    it('will construct a bar chart given some data', () => {
      var data = [
        { 'id': 'root', 'parent': '', 'value': '0', 'label': 'sequences' },
        { 'id': '1', 'parent': 'root', 'value': '50', 'label': 'home' },
        { 'id': '2', 'parent': 'root', 'value': '0', 'label': 'about'},
        { 'id': '2.1', 'parent': '2', 'value': '25', 'label': 'contact'},
        { 'id': '3', 'parent': 'root', 'value': '0', 'label': 'product'},
        { 'id': '3.1', 'parent': '3', 'value': '0', 'label': 'product'},
        { 'id': '3.1.1', 'parent': '3.1', 'value': '25', 'label': 'cart'}
      ];
      var chart = new proteic.Sunburst(data);
      assert.isOk(chart);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        var chart = new proteic.Sunburst(data);
      }, TypeError, 'Wrong data format');
    });
  });

  describe('chart functions ', () => {
    it.skip('toPNG()', (done) => {
      // TODO
      var data = {
        'name': 'sequences',
        'children': [
          { 'name': 'home',
            'children': [
              { 'name': 'home', 'value': 50 },
              { 'name': 'about',
                'children': [
                  { 'name': 'contact',
                    'value': 25
                  }
                ]
              },
              { 'name': 'product',
                'children': [
                  { 'name': 'product',
                    'children': [
                      { 'name': 'cart', 'value': 25 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
      var chart = new proteic.Sunburst(data);
      chart.draw();

      //wait for image creation
      setTimeout(() => {
        var result = chart.toPNG((uri) => {
          assert.isOk(uri);
        });
        done();
      }, 500);
    });
  });

});