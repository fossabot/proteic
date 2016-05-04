'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Colors utility class. Provides scales for each color palette.
 */

var Colors = function () {
  function Colors() {
    _classCallCheck(this, Colors);
  }

  _createClass(Colors, null, [{
    key: 'category1',
    value: function category1() {
      return d3.scale.ordinal().range(palette_category1);
    }
  }, {
    key: 'category2',
    value: function category2() {
      return d3.scale.ordinal().range(palette_category2);
    }
  }, {
    key: 'category3',
    value: function category3() {
      return d3.scale.ordinal().range(palette_category3);
    }
  }, {
    key: 'category4',
    value: function category4() {
      return d3.scale.ordinal().range(palette_category4);
    }
  }, {
    key: 'category5',
    value: function category5() {
      return d3.scale.ordinal().range(palette_category5);
    }
  }, {
    key: 'category6',
    value: function category6() {
      return d3.scale.ordinal().range(palette_category6);
    }
  }, {
    key: 'category7',
    value: function category7() {
      return d3.scale.ordinal().range(palette_category7);
    }
  }, {
    key: 'category8',
    value: function category8() {
      return d3.scale.ordinal().range(palette_category8);
    }
  }]);

  return Colors;
}();

/**
 * List of color palettes
 */

var palette_category1 = ['#e1c8df', '#9ecd9d', '#acd9d6', '#e4e36b', '#bfa1c5', '#e4d3b8', '#facba8', '#ced4ea', '#acd9d6'];

var palette_category2 = ['#b6dde2', '#6394af', '#e4e9ab', '#8ea876', '#f7dce1', '#cc878f', '#fadaac', '#f29a83', '#8d7e9e'];

var palette_category3 = ['#6b68a9', '#8cc590', '#b9487d', '#bfa1c5', '#4e6936', '#71bbc3', '#484156', '#ccaf44', '#d0553c'];

var palette_category4 = ['#f1a30d', '#1d4763', '#84c7bc', '#c1212d', '#8fbe46', '#076837', '#563a2d', '#563a2d', '#87325d'];

var palette_category5 = ['#f1a30d', '#0c3183', '#acd9d6', '#c1212d', '#8fbe46', '#076837', '#8a6338', '#8d2d84', '#f09bbc'];

var palette_category6 = ['#71bbc3', '#1d4763', '#8fbe46', '#4e6936', '#ee8998', '#c1212d', '#f5af3c', '#e95e2e', '#634484'];

var palette_category7 = ['#ea671e', '#684592', '#84b92a', '#cd131c', '#3c5ba2', '#5baddc', '#ffde06', '#5db68b', '#775e47'];

var palette_category8 = ['#ebd646', '#a50f38', '#00a096', '#f09bbc', '#065b78', '#72722a', '#005231', '#4d4e98', '#7c4d25'];