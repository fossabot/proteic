'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var utils = utils || {
  isArray: function isArray(d) {
    return d && d.constructor === Array && d instanceof Array;
  },
  isObject: function isObject(d) {
    return d && d.constructor === Object && d instanceof Object;
  },
  isFunction: function isFunction(func) {
    return func && {}.toString.call(func) === '[object Function]';
  },
  getNumberOfDifferentArrayKeys: function getNumberOfDifferentArrayKeys(array, field) {
    var keys = [];
    var element = null;

    if (!array || !array.length) {
      return 0;
    }

    for (var i = 0; i < array.length; i++) {
      element = field ? array[i][field] : array[i];
      if (element) {
        keys.push(element);
      }
    }
    return d3.set(keys).size();
  },
  sortBy: function sortBy(array, o) {
    var _toString = Object.prototype.toString;
    var _parser = function _parser(x) {
      return x;
    };
    var _getItem = function _getItem(x) {
      return _parser(x !== null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x[o.prop] || x);
    };

    if (!(array instanceof Array) || !array.length) {
      return [];
    }
    if (_toString.call(o) !== '[object Object]') {
      o = {};
    }
    if (typeof o.parser !== 'function') {
      o.parser = _parser;
    }
    o.desc = o.desc ? -1 : 1;
    return array.sort(function (a, b) {
      a = _getItem.call(o, a);
      b = _getItem.call(o, b);
      return o.desc * (a < b ? -1 : +(a > b));
    });
  }
};
'use strict';

var utils = utils || {};

var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

//private functions
(function () {
  function isExternal(url) {
    return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
  }

  function inlineImages(el, callback) {
    var images = el.querySelectorAll('image');
    var left = images.length;
    if (left == 0) {
      callback();
    }
    for (var i = 0; i < images.length; i++) {
      (function (image) {
        var href = image.getAttribute('xlink:href');
        if (href) {
          if (isExternal(href.value)) {
            console.warn('Cannot render embedded images linking to external hosts: ' + href.value);
            return;
          }
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        href = href || image.getAttribute('href');
        img.src = href;
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
          left--;
          if (left == 0) {
            callback();
          }
        };
        img.onerror = function () {
          console.error('Could not load ' + href);
          left--;
          if (left == 0) {
            callback();
          }
        };
      })(images[i]);
    }
  }

  function styles(el, selectorRemap) {
    var css = '';
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      if (isExternal(sheets[i].href)) {
        console.warn('Cannot include styles from other hosts: ' + sheets[i].href);
        continue;
      }
      var rules = sheets[i].cssRules;
      if (rules != null) {
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j];
          if (typeof rule.style != 'undefined') {
            var match = null;
            try {
              match = el.querySelector(rule.selectorText);
            } catch (err) {
              console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
            }
            if (match) {
              var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
              css += selector + ' { ' + rule.style.cssText + ' }\n';
            } else if (rule.cssText.match(/^@font-face/)) {
              css += rule.cssText + '\n';
            }
          }
        }
      }
    }
    return css;
  }
  utils.svgAsDataUri = function (el, options, cb) {
    options = options || {};
    options.scale = options.scale || 1;
    var xmlns = 'http://www.w3.org/2000/xmlns/';

    inlineImages(el, function () {
      var outer = document.createElement('div');
      var clone = el.cloneNode(true);
      var width, height;
      if (el.tagName == 'svg') {
        width = parseInt(clone.getAttribute('width') || clone.style.width || getComputedStyle(el).getPropertyValue('width'));
        height = parseInt(clone.getAttribute('height') || clone.style.height || getComputedStyle(el).getPropertyValue('height'));
      } else {
        var box = el.getBBox();
        width = box.x + box.width;
        height = box.y + box.height;
        clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.appendChild(clone);
        clone = svg;
      }

      clone.setAttribute('version', '1.1');
      clone.setAttributeNS(xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttributeNS(xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
      clone.setAttribute('width', width * options.scale);
      clone.setAttribute('height', height * options.scale);
      clone.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      outer.appendChild(clone);

      var css = styles(el, options.selectorRemap);
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = '<![CDATA[\n' + css + '\n]]>';
      var defs = document.createElement('defs');
      defs.appendChild(s);
      clone.insertBefore(defs, clone.firstChild);

      var svg = doctype + outer.innerHTML;
      var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
      if (cb) {
        cb(uri);
      }
    });
  };
})();
"use strict";

var strategies = {
  Barchart: function Barchart(chartContext) {
    return new SvgBarchartStrategy(chartContext);
  },
  Linechart: function Linechart(chartContext) {
    return new SvgLinechartStrategy(chartContext);
  },
  Streamgraph: function Streamgraph(chartContext) {
    return new SvgStreamgraphStrategy(chartContext);
  }
};
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
  }, {
    key: 'sequentialYellow',
    value: function sequentialYellow() {
      return d3.scale.linear().range(palette_sequential_yellow);
    }
  }, {
    key: 'sequentialRedOrange',
    value: function sequentialRedOrange() {
      return d3.scale.linear().range(palette_sequential_red_orange);
    }
  }, {
    key: 'sequentialRed',
    value: function sequentialRed() {
      return d3.scale.linear().range(palette_sequential_red);
    }
  }, {
    key: 'sequentialPink',
    value: function sequentialPink() {
      return d3.scale.linear().range(palette_sequential_pink);
    }
  }, {
    key: 'sequentialPurplePink',
    value: function sequentialPurplePink() {
      return d3.scale.linear().range(palette_sequential_purple_pink);
    }
  }, {
    key: 'sequentialPurple',
    value: function sequentialPurple() {
      return d3.scale.linear().range(palette_sequential_purple);
    }
  }, {
    key: 'sequentialBlue',
    value: function sequentialBlue() {
      return d3.scale.linear().range(palette_sequential_blue);
    }
  }, {
    key: 'sequentialLightBlue',
    value: function sequentialLightBlue() {
      return d3.scale.linear().range(palette_sequential_lightBlue);
    }
  }, {
    key: 'sequentialBlueViolet',
    value: function sequentialBlueViolet() {
      return d3.scale.linear().range(palette_sequential_blue_violet);
    }
  }, {
    key: 'sequentialTurquoise',
    value: function sequentialTurquoise() {
      return d3.scale.linear().range(palette_sequential_turquoise);
    }
  }, {
    key: 'sequentialLightGreen',
    value: function sequentialLightGreen() {
      return d3.scale.linear().range(palette_sequential_lightGreen);
    }
  }, {
    key: 'sequentialDarkGreen',
    value: function sequentialDarkGreen() {
      return d3.scale.linear().range(palette_sequential_darkGreen);
    }
  }, {
    key: 'sequentialGreenBrown',
    value: function sequentialGreenBrown() {
      return d3.scale.linear().range(palette_sequential_green_brown);
    }
  }, {
    key: 'sequentialBrown',
    value: function sequentialBrown() {
      return d3.scale.linear().range(palette_sequential_brown);
    }
  }, {
    key: 'sequentialGrey',
    value: function sequentialGrey() {
      return d3.scale.linear().range(palette_sequential_grey);
    }
  }, {
    key: 'sequentialVioletCb',
    value: function sequentialVioletCb() {
      return d3.scale.linear().range(palette_sequential_violet_cb);
    }
  }, {
    key: 'sequentialPinkCb',
    value: function sequentialPinkCb() {
      return d3.scale.linear().range(palette_sequential_pink_cb);
    }
  }, {
    key: 'sequentialBlueCb',
    value: function sequentialBlueCb() {
      return d3.scale.linear().range(palette_sequential_blue_cb);
    }
  }, {
    key: 'sequentialGreenCb',
    value: function sequentialGreenCb() {
      return d3.scale.linear().range(palette_sequential_green_cb);
    }
  }, {
    key: 'sequentialGreenBrownCb',
    value: function sequentialGreenBrownCb() {
      return d3.scale.linear().range(palette_sequential_green_brown_cb);
    }
  }, {
    key: 'diverging_spectral1',
    value: function diverging_spectral1() {
      return d3.scale.linear().range(palette_diverging_spectral1);
    }
  }, {
    key: 'diverging_spectral2',
    value: function diverging_spectral2() {
      return d3.scale.linear().range(palette_diverging_spectral2);
    }
  }, {
    key: 'diverging_spectral3',
    value: function diverging_spectral3() {
      return d3.scale.linear().range(palette_diverging_spectral3);
    }
  }, {
    key: 'diverging_brown_turquoise',
    value: function diverging_brown_turquoise() {
      return d3.scale.linear().range(palette_diverging_brown_turquoise);
    }
  }, {
    key: 'diverging_orange_pink',
    value: function diverging_orange_pink() {
      return d3.scale.linear().range(palette_diverging_orange_pink);
    }
  }, {
    key: 'diverging_red_blue',
    value: function diverging_red_blue() {
      return d3.scale.linear().range(palette_diverging_red_blue);
    }
  }, {
    key: 'diverging_red_grey',
    value: function diverging_red_grey() {
      return d3.scale.linear().range(palette_diverging_red_grey);
    }
  }, {
    key: 'diverging_orange_violet',
    value: function diverging_orange_violet() {
      return d3.scale.linear().range(palette_diverging_orange_violet);
    }
  }, {
    key: 'diverging_purple_green',
    value: function diverging_purple_green() {
      return d3.scale.linear().range(palette_diverging_purple_green);
    }
  }, {
    key: 'diverging_violet_green',
    value: function diverging_violet_green() {
      return d3.scale.linear().range(palette_diverging_violet_green);
    }
  }, {
    key: 'diverging_red_green',
    value: function diverging_red_green() {
      return d3.scale.linear().range(palette_diverging_red_green);
    }
  }, {
    key: 'diverging_brown_green',
    value: function diverging_brown_green() {
      return d3.scale.linear().range(palette_diverging_brown_green);
    }
  }, {
    key: 'diverging_lightBrown_turquoise',
    value: function diverging_lightBrown_turquoise() {
      return d3.scale.linear().range(palette_diverging_lightBrown_turquoise);
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

var palette_sequential_yellow = ['#fff1c6', '#fee5a7', '#fcda87', '#face64', '#f8bf4b', '#f6b030', '#f4a009', '#d28514', '#b36c17', '#955618', '#7a4317', '#613214', '#49230f'];

var palette_sequential_red_orange = ['#ffecb8', '#fbd68b', '#f7bf5e', '#f3a82f', '#df7520', '#cd4925', '#be0a26', '#a81023', '#941320', '#80141d', '#6d1419', '#5a1215', '#470f0f'];

var palette_sequential_red = ['#fde4d4', '#f1c4af', '#f7bf5e', '#db826a', '#d0614d', '#c73e36', '#be0a26', '#a81023', '#941320', '#80141d', '#6d1419', '#5a1215', '#470f0f'];

var palette_sequential_pink = ['#fbe3e3', '#f9cfcc', '#f0aaa9', '#ed7e7e', '#ea647b', '#e74576', '#e41270', '#c70f65', '#aa105c', '#8d1253', '#731448', '#5a123c', '#420e30'];

var palette_sequential_purple_pink = ['#f9d8e6', '#ebbed7', '#dda4c7', '#c890bb', '#b27daf', '#8a4c94', '#622181', '#622181', '#50216b', '#472060', '#3e1f55', '#361e4b', '#2d1c41'];

var palette_sequential_purple = ['#f6e8f1', '#dcc5de', '#c2a3c9', '#a980b3', '#905e9f', '#793f8e', '#622181', '#592175', '#4f216b', '#462060', '#3d1f55', '#351e4b', '#2c1c41'];

var palette_sequential_blue = ['#e5f2f9', '#d1e5f5', '#afd3ed', '#91afd7', '#738bbf', '#3c5a9e', '#0c3183', '#132a68', '#10204c', '#0b193b', '#06142f', '#051228', '#061020'];

var palette_sequential_lightBlue = ['#eff8fd', '#d9eff6', '#c2e5ef', '#a8dae8', '#90cbe4', '#76b8e1', '#5baddc', '#4d96cc', '#427ebc', '#3a67ab', '#324c88', '#29366b', '#1e2354'];

var palette_sequential_blue_violet = ['#edf7e7', '#c8e3d2', '#91cdbf', '#41b5ab', '#218ba4', '#145d94', '#0c3183', '#0d2d76', '#0d2a6a', '#0e265e', '#0d2253', '#0c1e47', '#0b1a3c'];

var palette_sequential_turquoise = ['#e2ecf6', '#cadfe6', '#b1d3d6', '#94c6c6', '#74b9b6', '#4caca6', '#00a096', '#008d89', '#007b7c', '#006a6f', '#005963', '#004a57', '#063b4c'];

var palette_sequential_lightGreen = ['#faf9de', '#e9efc3', '#d7e4a7', '#c5d989', '#b1ce6a', '#9cc34c', '#84b92a', '#6fa32b', '#5a8f2a', '#477c29', '#346b27', '#205b24', '#074d21'];

var palette_sequential_darkGreen = ['#eaf3e5', '#c7d5be', '#a3ba9a', '#80a078', '#5c885a', '#357442', '#00632e', '#00592b', '#004e27', '#004423', '#033a1e', '#053019', '#052613'];

var palette_sequential_green_brown = ['#f7eccd', '#d9cba6', '#bcad82', '#a29162', '#887946', '#716330', '#5b501f', '#51461d', '#483d1b', '#3f3418', '#362b15', '#2d2311', '#231a0d'];

var palette_sequential_brown = ['#f7eccd', '#eed3ab', '#e4bb89', '#dba269', '#ad7446', '#834d2c', '#5e2f19', '#552a18', '#4c2516', '#432113', '#3a1c11', '#32180f', '#29130b'];

var palette_sequential_grey = ['#e5e8ea', '#bdbfc3', '#999a9f', '#77797f', '#595c64', '#3e444c', '#253038', '#20282e', '#1a2024', '#15181b', '#0e1112', '#070808', '#000000'];

var palette_sequential_violet_cb = ['#f4f3f9', '#e0dced', '#cbc6e0', '#b7b0d4', '#948cbf', '#706baa', '#4d4e98', '#484889', '#42427a', '#3d3c6c', '#37365e', '#313050', '#2c2a44'];

var palette_sequential_pink_cb = ['#fbe5ee', '#f8ccd5', '#f4b2bc', '#f096a3', '#d56976', '#bc3f52', '#a50f38', '#951735', '#851b31', '#761d2e', '#671e2a', '#581d26', '#4a1c22'];

var palette_sequential_blue_cb = ['#eaf6fc', '#cfe4f4', '#cfe4f4', '#91bfe3', '#6999bb', '#417797', '#065b78', '#11536b', '#174b5f', '#194354', '#1a3b49', '#1a343f', '#192d35'];

var palette_sequential_green_cb = ['#fff7d0', '#e9e09b', '#d1ca62', '#b7b623', '#9e9e28', '#88872a', '#72722a', '#676726', '#5c5c23', '#51511f', '#47471b', '#3d3d17', '#333413'];

var palette_sequential_green_brown_cb = ['#f2edde', '#d8d1c0', '#bfb699', '#a09778', '#837b5a', '#686141', '#4f4b2c', '#3e3e1f', '#2e3313', '#292d14', '#232613', '#1e2012', '#191a10'];

var palette_diverging_spectral1 = ['#98141f', '#ab332c', '#bf5040', '#d5705b', '#e4a57f', '#f3d6a6', '#f5f2b8', '#cfdbb1', '#a4c4a9', '#71ada1', '#4e868f', '#2e637d', '#06456c'];

var palette_diverging_spectral2 = ['#d43d4f', '#df564b', '#eb6d45', '#f08e53', '#f8b96f', '#fee08b', '#f5f2b8', '#d7e5b1', '#b5d7aa', '#8ec8a3', '#6abda3', '#4fa4b5', '#3489be'];

var palette_diverging_spectral3 = ['#651035', '#ae1143', '#c9314b', '#dd7257', '#eeb27a', '#feeb9e', '#f5f2b8', '#cadfba', '#96cabb', '#50b4bb', '#3eaecc', '#206791', '#0c2c63'];

var palette_diverging_brown_turquoise = ['#3f3128', '#683828', '#933624', '#d5705b', '#db9c5e', '#feeb9e', '#f5f2b8', '#cfdbb1', '#a4c4a9', '#71ada1', '#628f85', '#53746d', '#475b57'];

var palette_diverging_orange_pink = ['#e7511e', '#eb6929', '#ee7f37', '#f29446', '#f9c083', '#ffe9c3', '#ffeee3', '#f9cfc1', '#f3a9ab', '#db6882', '#c71360', '#891953', '#4b1c47'];

var palette_diverging_red_blue = ['#b2172b', '#c4443e', '#d76a5a', '#ed937e', '#f4b8a2', '#fcdbc7', '#efefef', '#bfcad5', '#8ba7bc', '#4d87a5', '#3c7ca0', '#28729b', '#036896'];

var palette_diverging_red_grey = ['#b2172b', '#c54532', '#da6c3b', '#f29446', '#f8bc67', '#fee08b', '#efece5', '#c9c5c1', '#a5a19f', '#808080', '#666666', '#333333', '#000000'];

var palette_diverging_orange_violet = ['#98141f', '#ab332c', '#f9bc47', '#fdcf66', '#fede8d', '#ffecb3', '#f9eff6', '#e8d0e3', '#a4c4a9', '#a973aa', '#834f96', '#622181', '#402357'];

var palette_diverging_purple_green = ['#59194b', '#85134b', '#c71360', '#db6882', '#eba7a8', '#fce0ca', '#faefe1', '#dbd9aa', '#b9c26e', '#94ad31', '#728b2b', '#546c25', '#39521f'];

var palette_diverging_violet_green = ['#55296e', '#75408e', '#8a5fa0', '#a081b5', '#beadcf', '#ddd7e7', '#eae8ed', '#c1d4bc', '#93be86', '#58a951', '#3c853e', '#23662f', '#084a22'];

var palette_diverging_red_green = ['#b2172b', '#c5403c', '#d96453', '#ef8972', '#f6b49c', '#fcdbc7', '#f9ebde', '#dad6a8', '#b9c16d', '#94ad31', '#728b2b', '#546c25', '#39521f'];

var palette_diverging_brown_green = ['#735146', '#846454', '#977a65', '#aa9177', '#c2ad91', '#dbcaad', '#edebd6', '#c4d6aa', '#94bf7c', '#58a951', '#3c853e', '#23662f', '#084a22'];

var palette_diverging_lightBrown_turquoise = ['#8b5219', '#a46821', '#bf812c', '#cfa151', '#e2c489', '#f6e8c3', '#f5f1df', '#cbdccc', '#9cc6b9', '#60afa6', '#359790', '#1d7d75', '#00665e'];
'use strict';

/**
 * This object is used as a default one for those charts that do not have any user configuration.
 * @type {Object}
 */
var _default = {
  Barchart: {
    style: {
      '.axis': {
        'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdges'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    // Set the color scale for the chart. You can use Proteus scales or any D3 scale
    colorScale: Colors.category7(),
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    ticks: 5, // ticks for y axis.
    tooltip: function tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },

    tickLabel: '',
    selector: '#chart',
    events: {
      down: function down() {
        d3.select(this).classed('hover', false);
      },
      over: function over() {
        d3.select(this).transition().duration(150).attr('fill-opacity', 0.4);
      },
      leave: function leave() {
        d3.select(this).transition().duration(150).attr('fill-opacity', 1);
      },
      click: function click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  Linechart: {
    selector: '#chart',
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 600,
    height: 250,
    style: {
      'path': {
        'stroke': '#11D3BC',
        'stroke-width': 2,
        'fill': 'none'
      },
      '.axis': {
        'font': '10px sans-serif'
      },
      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdge'
      },
      '.x.axis path': {
        'display': 'none'
      }
    },
    ticks: 5, // ticks for y axis.
    markers: {
      shape: 'circle',
      size: 5,
      color: '#FFFCCA',
      outlineColor: '#537780',
      outlineWidth: 2
    },
    tooltip: function tooltip(text) {
      return text;
    },

    events: {
      down: function down() {
        d3.select(this).classed('hover', false);
      },
      over: function over() {
        d3.select(this).transition().duration(50).attr('r', 7);
      },
      leave: function leave() {
        d3.select(this).transition().duration(50).attr('r', 5).style('stroke-width', 2);
      },
      click: function click(d, i) {
        console.log(d, i);
      }
    },
    tickLabel: '',
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  },
  Streamgraph: {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: {
      from: 'orange',
      to: 'blue'
    },
    style: {
      '.axis': {
        'font': '10px sans-serif'
      },

      '.axis path,.axis line': {
        'fill': 'none',
        'stroke': '#000',
        'shape-rendering': 'crispEdges'
      }
    },
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width: 900,
    height: 300,
    ticks: 5, // ticks for y axis.
    tooltip: function tooltip(object) {
      return 'Info: ' + JSON.stringify(object);
    },

    tickLabel: '',
    events: {
      down: function down() {
        d3.select(this).classed('hover', false);
      },
      over: function over() {
        d3.select(this).transition().duration(150).attr('fill-opacity', 0.4);
      },
      leave: function leave() {
        d3.select(this).transition().duration(150).attr('fill-opacity', 1);
      },
      click: function click(d, i) {
        console.log(d, i);
      }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
      descending: false,
      prop: 'x'
    }
  }
};
'use strict';

/**
 * SvgStrategy wrapper class
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgStrategy = function () {
    function SvgStrategy(strategy) {
        _classCallCheck(this, SvgStrategy);

        this.strategy = strategy;
    }

    _createClass(SvgStrategy, [{
        key: 'draw',
        value: function draw(data) {
            this.strategy.draw(data);
        }
    }, {
        key: 'on',
        value: function on(events) {
            this.strategy.on(events);
        }
    }]);

    return SvgStrategy;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SvgChart = function () {
    function SvgChart(chartContext) {
        _classCallCheck(this, SvgChart);

        var clazz = this.constructor.name;
        if (clazz === 'SvgChart') {
            throw new Error(clazz + ' is non-instanciable');
        }
        this._initialized = false;
        this.cType = chartContext.cType;
        this._loadConfigOnContext(chartContext.config);

        this.interactiveElements = null;
    }

    _createClass(SvgChart, [{
        key: 'draw',
        value: function draw(data) {
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
    }, {
        key: '_applyCSS',
        value: function _applyCSS() {
            var style = this.style;
            var styleValue = null;

            for (var key in style) {
                styleValue = style[key];
                d3.selectAll(key).style(styleValue);
            }
        }
    }, {
        key: 'on',
        value: function on() {
            var events = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            for (var key in events) {
                var action = events[key];
                this.interactiveElements.on(key + '.user', action);
            }
        }
    }, {
        key: '_loadConfigOnContext',
        value: function _loadConfigOnContext(config) {
            this.margin = config.margin || _default[this.cType].margin;
            this.width = config.width || _default[this.cType].width;
            this.height = config.height || _default[this.cType].height;
            this.ticks = config.ticks || _default[this.cType].ticks;
            this.tickLabel = config.tickLabel || _default[this.cType].tickLabel;
            this.selector = config.selector || _default[this.cType].selector;
            this.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
            this.tooltip = config.tooltip || _default[this.cType].tooltip;
            this.events = {};
            this.events.down = config.events.down || _default[this.cType].events.down;
            this.events.up = config.events.up || _default[this.cType].events.up;
            this.events.over = config.events.over || _default[this.cType].events.over;
            this.events.click = config.events.click || _default[this.cType].events.click;
            this.events.leave = config.events.leave || _default[this.cType].events.leave;
            this._sortData = config.sortData || _default[this.cType].sortData;
            this.style = config.style || _default[this.cType].style;
            this.colorScale = config.colorScale || _default[this.cType].colorScale;
        }
    }]);

    return SvgChart;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgBarchartStrategy = function (_SvgChart) {
  _inherits(SvgBarchartStrategy, _SvgChart);

  function SvgBarchartStrategy(chartContext) {
    _classCallCheck(this, SvgBarchartStrategy);

    //Create range function

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgBarchartStrategy).call(this, chartContext));

    _this.xAxisName = 'x';
    _this.yAxisName = 'y';
    _this.x = d3.scale.ordinal().rangeRoundBands([0, _this.width], .1);
    _this.y = d3.scale.linear().range([_this.height, 0]);

    //Create scale
    _this.xAxis = d3.svg.axis().scale(_this.x).orient('bottom').ticks(10);

    _this.yAxis = d3.svg.axis().scale(_this.y).orient('left').innerTickSize(-_this.width).outerTickSize(0).tickPadding(20).ticks(_this.ticks, _this.tickLabel);

    _this.keyFunction = function (d) {
      return d.x;
    };
    return _this;
  }

  /**
   * Renders a barchart based on data object
   * @param  {Object} data Data Object. Contains an array with x and y properties.
   * 
   */


  _createClass(SvgBarchartStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      var bars = null;
      var max = Number.MIN_VALUE;

      _get(Object.getPrototypeOf(SvgBarchartStrategy.prototype), 'draw', this).call(this, data);

      //Re-scale axis
      this.x.domain(data.map(this.keyFunction));
      max = d3.max(data, function (d) {
        return d[_this2.yAxisName];
      });
      this.y.domain([0, max]);

      //Create a transition effect for axis rescaling
      this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
      this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

      //Bind data
      bars = this.svg.selectAll('.bar').data(data, this.keyFunction);
      //For new data, add bars and events  
      bars.enter().append('rect').attr('class', 'bar').attr('height', function (d) {
        return _this2.height - _this2.y(d[_this2.yAxisName]);
      }).attr('fill', function (d, i) {
        return _this2.colorScale(i);
      })
      //namespaces let us to provide more than one functon for the same event
      .on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

      this.interactiveElements = bars;

      bars.exit().transition().duration(300).attr('y', this.y(0)).attr('height', this.height - this.y(0)).style('fill-opacity', 1e-6).style().remove();

      bars.transition().duration(300).attr('x', function (d) {
        return _this2.x(d[_this2.xAxisName]);
      }).attr('width', this.x.rangeBand()).attr('y', function (d) {
        return _this2.y(d[_this2.yAxisName]);
      }).attr('height', function (d) {
        return _this2.height - _this2.y(d[_this2.yAxisName]);
      });

      this._applyCSS();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.left + this.margin.right;
      //Create a global 'g' (group) element
      this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      //Append a new group with 'x' aXis
      this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height + ')').call(this.xAxis);

      //Append a new group with 'y' aXis
      this.svg.append('g').attr('class', 'y axis').attr('stroke-dasharray', '5, 5').call(this.yAxis).append('text');

      //Initialize SVG
      this._initialized = true;
    }

    /**
     * This method adds config options to the chart context.
     * @param  {Object} config Config object
     */

  }, {
    key: '_loadConfigOnContext',
    value: function _loadConfigOnContext(config) {
      config = config || { events: {} };
      if (!config.events) {
        config.events = {};
      }
      _get(Object.getPrototypeOf(SvgBarchartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);

      //Just for testing purposes
      return this;
    }
  }]);

  return SvgBarchartStrategy;
}(SvgChart);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgLinechartStrategy = function (_SvgChart) {
  _inherits(SvgLinechartStrategy, _SvgChart);

  function SvgLinechartStrategy(chartContext) {
    _classCallCheck(this, SvgLinechartStrategy);

    //Create range function

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgLinechartStrategy).call(this, chartContext));

    _this.xAxisName = 'x';
    _this.yAxisName = 'y';

    _this.x = d3.scale.linear().range([0, _this.width]);
    _this.y = d3.scale.linear().range([_this.height, 0]);

    //Create scale
    _this.xAxis = d3.svg.axis().scale(_this.x).orient('bottom').ticks(10);

    _this.yAxis = d3.svg.axis().scale(_this.y).orient('left').innerTickSize(-_this.width).outerTickSize(0).tickPadding(20).ticks(_this.ticks, _this.tickLabel);

    _this.keyFunction = function (d) {
      return d.x;
    };
    return _this;
  }

  /**
   * Renders a linechart based on data object
   * @param  {Object} data Data Object. Contains an array with x and y properties.
   * 
   */


  _createClass(SvgLinechartStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      var line = null;
      var path = null;
      var markers = null;
      _get(Object.getPrototypeOf(SvgLinechartStrategy.prototype), 'draw', this).call(this, data);
      //Re-scale axis
      // this.x.domain([0, d3.max(data, function (d) { return d.x; })]);
      this.x.domain([d3.min(data, function (d) {
        return d.x;
      }), d3.max(data, function (d) {
        return d.x;
      })]);
      this.y.domain([0, d3.max(data, function (d) {
        return d.y;
      })]);

      //Create a transition effect for axis rescaling
      this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
      this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);

      // Bind data
      line = d3.svg.line().x(function (d) {
        return _this2.x(d.x);
      }).y(function (d) {
        return _this2.y(d.y);
      });

      // Create path and bind data to it
      path = this.svg.select('path').datum(data, this.keyFunction).attr('d', line);

      // Append markers to line
      if (this.markers) {
        switch (this.markers.shape) {
          case 'circle':
            markers = this.svg.selectAll('circle').data(data, this.keyFunction);

            markers.enter().append('circle').attr('cx', function (d) {
              return _this2.x(d.x);
            }).attr('cy', function (d) {
              return _this2.y(d.y);
            }).attr('r', this.markers.size).style({
              'fill': this.markers.color,
              'stroke': this.markers.outlineColor,
              'stroke-width': this.markers.outlineWidth
            });

            markers.transition().attr('cx', function (d) {
              return _this2.x(d.x);
            }).attr('cy', function (d) {
              return _this2.y(d.y);
            }).duration(0);
            break;
          default:
            throw Error('Not a valid marker shape: ' + this.markers.shape);
        }
      }

      // Add tooltips to the markers
      if (this.tooltip) {
        markers.append('title').text(this.tooltip(function (d) {
          return _this2.x(d.x);
        }));
      }

      // Add events to the markers
      markers.on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

      this.interactiveElements = markers;

      this._applyCSS();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.left + this.margin.right;

      //Create a global 'g' (group) element
      this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      // Append the line path
      this.svg.append('path');

      //Append a new group with 'x' aXis
      this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height + ')').call(this.xAxis);

      //Append a new group with 'y' aXis
      this.svg.append('g').attr('class', 'y axis').attr('stroke-dasharray', '5, 5').call(this.yAxis).append('text');

      //Initialize SVG
      this._initialized = true;
    }

    /**
     * This method adds config options to the chart context.
     * @param  {Object} config Config object
     */

  }, {
    key: '_loadConfigOnContext',
    value: function _loadConfigOnContext(config) {
      config = config || { events: {}, markers: {} };
      if (!config.events) {
        config.events = {};
      }
      if (!config.markers) {
        config.markers = {};
      }
      _get(Object.getPrototypeOf(SvgLinechartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
      this.markers = {};
      this.markers.color = config.markers.color || _default.Linechart.markers.color;
      this.markers.outlineColor = config.markers.outlineColor || _default.Linechart.markers.outlineColor;
      this.markers.outlineWidth = config.markers.outlineWidth || _default.Linechart.markers.outlineWidth;
      this.markers.shape = config.markers.shape || _default.Linechart.markers.shape;
      this.markers.size = config.markers.size || _default.Linechart.markers.size;

      //Just for testing purposes
      return this;
    }
  }]);

  return SvgLinechartStrategy;
}(SvgChart);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgStreamgraphStrategy = function (_SvgChart) {
    _inherits(SvgStreamgraphStrategy, _SvgChart);

    function SvgStreamgraphStrategy(chartContext) {
        _classCallCheck(this, SvgStreamgraphStrategy);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SvgStreamgraphStrategy).call(this, chartContext));

        _this.x = d3.time.scale().range([0, _this.width]);
        _this.y = d3.scale.linear().range([_this.height - 10, 0]);

        _this.format = d3.time.format(_this.xDateformat);
        _this.xAxis = d3.svg.axis().scale(_this.x).orient('bottom').ticks(d3.time.days);

        _this.yAxis = d3.svg.axis().scale(_this.y);
        return _this;
    }

    /**
     * Renders a barchart based on data object
     * @param  {Object} data Data Object. Contains an array with x and y properties.
     * 
     */


    _createClass(SvgStreamgraphStrategy, [{
        key: 'draw',
        value: function draw(data) {
            var _this2 = this;

            var layers = null; //streamgraph layers
            var nColors = null; //number of colors = different keys
            var fromColor = this.colorScale.from;
            var toColor = this.colorScale.to;
            var colorrange = null; //color range based on user preferences

            //Initialize data
            if (!this._initialized) {
                this._initialize();
            }
            //Force x axis to be a date and y-axis to be a number
            data.forEach(function (d) {
                d.date = _this2.format.parse(d.date);
                d.value = +d.value;
            });
            this.stack = d3.layout.stack().offset('silhouette').values(function (d) {
                return d.values;
            }).x(function (d) {
                return d.date;
            }).y(function (d) {
                return d.value;
            });

            this.nest = d3.nest().key(function (d) {
                return d.key;
            });

            this.area = d3.svg.area().interpolate('cardinal').x(function (d) {
                return _this2.x(d.date);
            }).y0(function (d) {
                return _this2.y(d.y0);
            }).y1(function (d) {
                return _this2.y(d.y0 + d.y);
            });

            layers = this.stack(this.nest.entries(data));

            this.x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            this.y.domain([0, d3.max(data, function (d) {
                return d.y0 + d.y;
            })]);

            nColors = utils.getNumberOfDifferentArrayKeys(data, 'key');
            colorrange = chroma.scale([fromColor, toColor]).colors(nColors);

            this.z = d3.scale.ordinal().range(colorrange);

            this.svg.selectAll('.layer').data(layers).enter().append('path').attr('class', 'layer').attr('d', function (d) {
                return _this2.area(d.values);
            }).style('fill', function (d, i) {
                return _this2.z(i);
            });

            this.svg.selectAll('.layer').attr('opacity', 1).on('mousedown.user', this.events.down).on('mouseup.user', this.events.up).on('mouseleave.user', this.events.leave).on('mouseover.user', this.events.over).on('click.user', this.events.click);

            var vertical = d3.select(this.selector).append('div').attr('class', 'remove').style('position', 'absolute').style('z-index', '19').style('width', '1px').style('height', '380px').style('top', '10px').style('bottom', '30px').style('left', '0px').style('background', '#000000');

            this._applyCSS();
        }
    }, {
        key: '_initialize',
        value: function _initialize() {
            var width = this.width + this.margin.left + this.margin.right;
            var height = this.height + this.margin.left + this.margin.right;

            this.svg = d3.select(this.selector).append('svg').attr({ width: width, height: height }).append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

            this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.height + ')').call(this.xAxis);

            this.svg.append('g').attr('class', 'y axis').attr('transform', 'translate(' + this.width + ', 0)').call(this.yAxis.orient('right'));

            this.svg.append('g').attr('class', 'y axis').call(this.yAxis.orient('left'));

            this._initialized = true;
        }

        /**
         * This method adds config options to the chart context.
         * @param  {Object} config Config object
         */

    }, {
        key: '_loadConfigOnContext',
        value: function _loadConfigOnContext(config) {
            config = config || { events: {} };
            if (!config.events) {
                config.events = {};
            }
            _get(Object.getPrototypeOf(SvgStreamgraphStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
            this.colorScale = config.colorScale || _default.Streamgraph.colorScale;
            this.xDateformat = config.xDateFormat || _default.Streamgraph.xDateFormat;
        }
    }]);

    return SvgStreamgraphStrategy;
}(SvgChart);
'use strict';
/**
 * globals Svg, _default
 */

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chart = function () {
  function Chart() {
    _classCallCheck(this, Chart);

    var clazz = this.constructor.name;
    if (clazz === 'Chart' || clazz === 'Basic' || clazz === 'Flow') {
      throw new Error(clazz + ' is non-instanciable');
    }
    this.events = {};
  }

  /**
   * Returns the chart context: data, configuration and chart type.
   */


  _createClass(Chart, [{
    key: '_getChartContext',
    value: function _getChartContext() {
      return {
        data: this.data,
        config: this.config,
        cType: this.constructor.name
      };
    }

    /**
     * Initialize the SVG context
     */

  }, {
    key: '_initializeSVGContext',
    value: function _initializeSVGContext() {
      this._svg = new SvgStrategy(strategies[this.constructor.name](this._getChartContext()));
    }

    /**
     * @param  {Object} data Data object. This method infer the type of data, which could be:
     * Array: Data is an static object.
     * Object: Data is a data source we need to connect to, in order to receive a stream of data.
     */

  }, {
    key: '_inferDataSource',
    value: function _inferDataSource(data) {
      if (utils.isObject(data)) {
        this._initializeWebsocketDataSource(data);
      } else if (!utils.isArray(data)) {
        throw new TypeError('Wrong data format');
      }
    }

    /**
     * Initialize a connecton between browser and server through a Websocket connections
     * @param  {Object} source Connection details.
     */

  }, {
    key: '_initializeWebsocketDataSource',
    value: function _initializeWebsocketDataSource(source) {
      var _this = this;

      var _initialize = function _initialize() {
        _this.ws = new WebSocket(source.endpoint);

        _this.ws.onopen = function () {};

        _this.ws.onerror = function (e) {
          throw new Error('Error with websocket connection', e);
        };

        _this.ws.onmessage = function (event) {
          //var data = JSON.parse(event.data).points;
          var data = JSON.parse(event.data.substr(2))[1];
          setTimeout(function () {
            _this.keepDrawing(data);
          }, 50);
        };
      };

      //private streaming functions, only available when using websockets
      this.start = function () {
        _initialize();
      };
      this.stop = function () {
        if (_this.ws) {
          _this.ws.close();
        }
      };
    }

    /**
    * Add a new serie to the current data.
    * @param  {object} new serie
    * @autodraw {Boolean} Auto re-draw the current chart after adding the new serie
    */

  }, {
    key: 'addSerie',
    value: function addSerie(serie) {
      var autodraw = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!serie || !utils.isObject(serie)) {
        throw Error('\'serie\' should be an object. Instead: ' + series);
      }

      this.data.push(serie);

      if (autodraw) {
        this.draw();
      }
    }

    /**
     * Add new series (array) to the current data.
     * @param  {Array} series Array of data
     * @autodraw {Boolean} Auto re-draw the current chart after adding new series
     */

  }, {
    key: 'addSeries',
    value: function addSeries(series) {
      var autodraw = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!series || series.constructor !== Array) {
        throw Error('\'series\' should be an array. Instead: ' + series);
      }

      this.data = this.data.concat(series);

      if (autodraw) {
        this.draw();
      }
    }
  }, {
    key: 'removeSerie',
    value: function removeSerie(serie) {
      var _this2 = this;

      var autodraw = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (!serie || !utils.isObject(serie)) {
        throw Error('\'serie\' should be an object. Instead: ' + series);
      }

      this.data.some(function (item, index, array) {
        var equals = JSON.stringify(item) === JSON.stringify(serie);
        if (equals) {
          return _this2.data.splice(index, 1);
        }
      });

      if (autodraw) {
        this.draw();
      }
    }

    /**
     * Renders data on barchart. Only allowed when data is an array of static data.
     * @param  {Array} data Array of data
     */

  }, {
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      if (!utils.isArray(data)) {
        throw new TypeError('draw method is only allowed with static data.');
      }
      this._svg.draw(data);
    }

    /**
     * Returns a PNG image of the current graph
     * @return {[String]} Image in data-url format
     */

  }, {
    key: 'toPNG',
    value: function toPNG(cb) {
      utils.svgAsDataUri(d3.select(this.config.selector + ' svg')[0][0], {}, function (uri, err) {
        if (err) {
          throw Error('Error converting to image ' + err);
        } else {
          cb(uri);
        }
      });
    }

    /**
     * On method. Define custom events (click, over, down and up).
     */

  }, {
    key: 'on',
    value: function on(eventName, action) {
      if (!eventName || typeof eventName !== "string") {
        throw Error('eventName should be a string. Instead: ' + eventName);
      }
      if (!action || !utils.isFunction(action)) {
        throw Error('action should be a function. Instead: ' + eventName);
      }

      this.events[eventName] = action;
      this._svg.on(this.events);
      return this;
    }
  }]);

  return Chart;
}();

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

var Basic = function (_Chart) {
  _inherits(Basic, _Chart);

  function Basic() {
    _classCallCheck(this, Basic);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Basic).call(this));
  }

  return Basic;
}(Chart);

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */

var Flow = function (_Chart2) {
  _inherits(Flow, _Chart2);

  function Flow() {
    _classCallCheck(this, Flow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Flow).call(this));
  }

  _createClass(Flow, [{
    key: 'draw',
    value: function draw(data) {
      //hack to clone object. It is because flow chart (like streamgraph) modify the original dataset to create itself.
      //It could be a problem in streaming scenario, where data is concatenated with new data. We need to keep the original dataset.
      data = JSON.parse(JSON.stringify(data));
      _get(Object.getPrototypeOf(Flow.prototype), 'draw', this).call(this, data);
    }
  }]);

  return Flow;
}(Chart);
'use strict';

/**
 * Barchart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Barchart = function (_Basic) {
  _inherits(Barchart, _Basic);

  /**
   * Barchart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */

  function Barchart(data, config) {
    _classCallCheck(this, Barchart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Barchart).call(this));

    if (!arguments.length) {
      throw new Error('Missing constructor parameters');
    }

    _this._inferDataSource(arguments[0]);

    switch (arguments.length) {
      case 1:
        _this.data = arguments[0];
        _this.config = _default[_this.constructor.name];
        break;
      case 2:
        _this.data = arguments[0];
        _this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    _this._initializeSVGContext();
    return _this;
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Barchart, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Object.getPrototypeOf(Barchart.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {[Object]} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      var config = this.config;
      var maxNumberOfElements = config.maxNumberOfElements;
      if (!this.datum) {
        this.datum = [];
      }
      this.datum = this.datum.concat(datum);
      if (maxNumberOfElements && maxNumberOfElements > 0) {
        if (this.datum.length > maxNumberOfElements) {
          for (var i = 0; i < datum.length; i++) {
            this.datum.shift();
          }
        }
      }
      _get(Object.getPrototypeOf(Barchart.prototype), 'draw', this).call(this, this.datum);
    }
  }]);

  return Barchart;
}(Basic);
'use strict';

/**
 * Linechart implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Linechart = function (_Basic) {
  _inherits(Linechart, _Basic);

  /**
   * Linechart constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */

  function Linechart(data, config) {
    _classCallCheck(this, Linechart);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Linechart).call(this));

    if (!arguments.length) {
      throw new Error('Missing constructor parameters');
    }

    _this._inferDataSource(arguments[0]);

    switch (arguments.length) {
      case 1:
        _this.data = arguments[0];
        _this.config = _default[_this.constructor.name];
        break;
      case 2:
        _this.data = arguments[0];
        _this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    _this._initializeSVGContext();
    return _this;
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Linechart, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Object.getPrototypeOf(Linechart.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {[Object]} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      var config = this.config;
      var maxNumberOfElements = config.maxNumberOfElements;
      if (!this.datum) {
        this.datum = [];
      }
      this.datum = this.datum.concat(datum);
      if (maxNumberOfElements && maxNumberOfElements > 0) {
        if (this.datum.length > maxNumberOfElements) {
          for (var i = 0; i < datum.length; i++) {
            this.datum.shift();
          }
        }
      }
      _get(Object.getPrototypeOf(Linechart.prototype), 'draw', this).call(this, this.datum);
    }
  }]);

  return Linechart;
}(Basic);
'use strict';

/**
 * Streamgraph implementation. This charts belongs to 'Flow' family.
 * It is inherited on 'Flow'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Streamgraph = function (_Flow) {
  _inherits(Streamgraph, _Flow);

  /**
   * Streamgraph constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you 
   * do not specify this, '_default' object is used by default.
   */

  function Streamgraph() {
    _classCallCheck(this, Streamgraph);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Streamgraph).call(this));

    if (!arguments.length) {
      throw new Error('Missing constructor parameters');
    }

    _this._inferDataSource(arguments[0]);

    switch (arguments.length) {
      case 1:
        _this.data = arguments[0];
        _this.config = _default;
        break;
      case 2:
        _this.data = arguments[0];
        _this.config = arguments[1];
        break;
      default:
        throw Error('Unrecognized number of paremeters: ' + arguments);
    }
    _this._initializeSVGContext();
    return _this;
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Streamgraph, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Object.getPrototypeOf(Streamgraph.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {[Object]} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      if (!this.datum) {
        this.datum = [];
      }
      this.datum = this.datum.concat(datum);
      _get(Object.getPrototypeOf(Streamgraph.prototype), 'draw', this).call(this, this.datum);
    }
  }]);

  return Streamgraph;
}(Flow);