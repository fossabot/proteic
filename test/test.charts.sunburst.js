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
        var chart = new Sunburst();
      }, Error, 'Missing constructor parameters');
    });

    it('will construct a bar chart given some data', () => {
      var data = {
        "name": "sequences",
        "children": [
          { "name": "home",
            "children": [
              { "name": "home", "value": 50 },
              { "name": "about",
                "children": [
                  { "name": "contact",
                    "value": 25
                  }
                ]
              },
              { "name": "product",
                "children": [
                  { "name": "product",
                    "children": [
                      { "name": "cart", "value": 25 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
      var chart = new Sunburst(data);
      assert.isOk(chart);
    });

    it('throws a "Wrong data format" TypeError if data is not an object neither an array', () => {
      var data = 'wrong parameter';
      assert.throws(() => {
        var chart = new Sunburst(data);
      }, TypeError, 'Wrong data format');
    });
  });

  describe('chart functions ', () => {
    it.skip('toPNG()', (done) => {
      // TODO
      var data = {
        "name": "sequences",
        "children": [
          { "name": "home",
            "children": [
              { "name": "home", "value": 50 },
              { "name": "about",
                "children": [
                  { "name": "contact",
                    "value": 25
                  }
                ]
              },
              { "name": "product",
                "children": [
                  { "name": "product",
                    "children": [
                      { "name": "cart", "value": 25 }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
      var chart = new Sunburst(data);
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