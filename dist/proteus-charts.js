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
  isNumeric: function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  isEven: function isEven(n) {
    return n % 2 == 0;
  },
  isPercentage: function isPercentage(n) {
    var split = null;
    var number = null;
    if (!n || typeof n !== 'string') {
      return false;
    }
    split = n.split('%');
    number = +split[0];
    return split.length === 2 && number >= 0 && number <= 100;
  },
  keys: function keys(array, field) {
    var keys = new Set();
    var element = null;

    if (!array || !array.length) {
      return [];
    }

    for (var i = 0; i < array.length; i++) {
      element = field ? array[i][field] : array[i];
      if (element) {
        keys.add(element);
      }
    }
    return keys;
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
  },
  findElement: function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][propName] === propValue) {
        return arr[i];
      }
    }
    return null;
    // will return null if not found; you could return a default instead
  },
  deg2rad: function deg2rad(deg) {
    return deg * Math.PI / 180;
  }
};
'use strict';

var utils = utils || {};

var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

//private functions
(function () {
  function isExternal(url) {
    return url && url.lastIndexOf('http', 0) === 0 && url.lastIndexOf(window.location.host) === -1;
  }

  function inlineImages(el, callback) {
    var images = el.querySelectorAll('image');
    var left = images.length;
    if (left === 0) {
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
          if (left === 0) {
            callback();
          }
        };
        img.onerror = function () {
          console.error('Could not load ' + href);
          left--;
          if (left === 0) {
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
      if (rules !== null) {
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
      if (el.tagName === 'svg') {
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
  },
  Gauge: function Gauge(chartContext) {
    return new SvgGaugeStrategy(chartContext);
  },
  Sunburst: function Sunburst(chartContext) {
    return new SvgSunburstStrategy(chartContext);
  },
  Swimlane: function Swimlane(chartContext) {
    return new SvgSwimlaneStrategy(chartContext);
  },
  StackedArea: function StackedArea(chartContext) {
    return new SvgStackedAreaStrategy(chartContext);
  }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * List of color palettes
 */

var paletteCategory1 = ['#e1c8df', '#9ecd9d', '#acd9d6', '#e4e36b', '#bfa1c5', '#e4d3b8', '#facba8', '#ced4ea', '#acd9d6'];

var paletteCategory2 = ['#b6dde2', '#6394af', '#e4e9ab', '#8ea876', '#f7dce1', '#cc878f', '#fadaac', '#f29a83', '#8d7e9e'];

var paletteCategory3 = ['#6b68a9', '#8cc590', '#b9487d', '#bfa1c5', '#4e6936', '#71bbc3', '#484156', '#ccaf44', '#d0553c'];

var paletteCategory4 = ['#f1a30d', '#1d4763', '#84c7bc', '#c1212d', '#8fbe46', '#076837', '#563a2d', '#563a2d', '#87325d'];

var paletteCategory5 = ['#f1a30d', '#0c3183', '#acd9d6', '#c1212d', '#8fbe46', '#076837', '#8a6338', '#8d2d84', '#f09bbc'];

var paletteCategory6 = ['#71bbc3', '#1d4763', '#8fbe46', '#4e6936', '#ee8998', '#c1212d', '#f5af3c', '#e95e2e', '#634484'];

var paletteCategory7 = ['#ea671e', '#684592', '#84b92a', '#cd131c', '#3c5ba2', '#5baddc', '#ffde06', '#5db68b', '#775e47'];

var paletteCategory8 = ['#ebd646', '#a50f38', '#00a096', '#f09bbc', '#065b78', '#72722a', '#005231', '#4d4e98', '#7c4d25'];

var paletteSequentialYellow = ['#fff1c6', '#fee5a7', '#fcda87', '#face64', '#f8bf4b', '#f6b030', '#f4a009', '#d28514', '#b36c17', '#955618', '#7a4317', '#613214', '#49230f'];

var paletteSequentialRedOrange = ['#ffecb8', '#fbd68b', '#f7bf5e', '#f3a82f', '#df7520', '#cd4925', '#be0a26', '#a81023', '#941320', '#80141d', '#6d1419', '#5a1215', '#470f0f'];

var paletteSequentialRed = ['#fde4d4', '#f1c4af', '#f7bf5e', '#db826a', '#d0614d', '#c73e36', '#be0a26', '#a81023', '#941320', '#80141d', '#6d1419', '#5a1215', '#470f0f'];

var paletteSequentialPink = ['#fbe3e3', '#f9cfcc', '#f0aaa9', '#ed7e7e', '#ea647b', '#e74576', '#e41270', '#c70f65', '#aa105c', '#8d1253', '#731448', '#5a123c', '#420e30'];

var paletteSequentialPurplePink = ['#f9d8e6', '#ebbed7', '#dda4c7', '#c890bb', '#b27daf', '#8a4c94', '#622181', '#622181', '#50216b', '#472060', '#3e1f55', '#361e4b', '#2d1c41'];

var paletteSequentialPurple = ['#f6e8f1', '#dcc5de', '#c2a3c9', '#a980b3', '#905e9f', '#793f8e', '#622181', '#592175', '#4f216b', '#462060', '#3d1f55', '#351e4b', '#2c1c41'];

var paletteSequentialBlue = ['#e5f2f9', '#d1e5f5', '#afd3ed', '#91afd7', '#738bbf', '#3c5a9e', '#0c3183', '#132a68', '#10204c', '#0b193b', '#06142f', '#051228', '#061020'];

var paletteSequentialLightBlue = ['#eff8fd', '#d9eff6', '#c2e5ef', '#a8dae8', '#90cbe4', '#76b8e1', '#5baddc', '#4d96cc', '#427ebc', '#3a67ab', '#324c88', '#29366b', '#1e2354'];

var paletteSequentialBlueViolet = ['#edf7e7', '#c8e3d2', '#91cdbf', '#41b5ab', '#218ba4', '#145d94', '#0c3183', '#0d2d76', '#0d2a6a', '#0e265e', '#0d2253', '#0c1e47', '#0b1a3c'];

var paletteSequentialTurquoise = ['#e2ecf6', '#cadfe6', '#b1d3d6', '#94c6c6', '#74b9b6', '#4caca6', '#00a096', '#008d89', '#007b7c', '#006a6f', '#005963', '#004a57', '#063b4c'];

var paletteSequentialLightGreen = ['#faf9de', '#e9efc3', '#d7e4a7', '#c5d989', '#b1ce6a', '#9cc34c', '#84b92a', '#6fa32b', '#5a8f2a', '#477c29', '#346b27', '#205b24', '#074d21'];

var paletteSequentialDarkGreen = ['#eaf3e5', '#c7d5be', '#a3ba9a', '#80a078', '#5c885a', '#357442', '#00632e', '#00592b', '#004e27', '#004423', '#033a1e', '#053019', '#052613'];

var paletteSequentialGreenBrown = ['#f7eccd', '#d9cba6', '#bcad82', '#a29162', '#887946', '#716330', '#5b501f', '#51461d', '#483d1b', '#3f3418', '#362b15', '#2d2311', '#231a0d'];

var paletteSequentialBrown = ['#f7eccd', '#eed3ab', '#e4bb89', '#dba269', '#ad7446', '#834d2c', '#5e2f19', '#552a18', '#4c2516', '#432113', '#3a1c11', '#32180f', '#29130b'];

var paletteSequentialGrey = ['#e5e8ea', '#bdbfc3', '#999a9f', '#77797f', '#595c64', '#3e444c', '#253038', '#20282e', '#1a2024', '#15181b', '#0e1112', '#070808', '#000000'];

var paletteSequentialVioletCb = ['#f4f3f9', '#e0dced', '#cbc6e0', '#b7b0d4', '#948cbf', '#706baa', '#4d4e98', '#484889', '#42427a', '#3d3c6c', '#37365e', '#313050', '#2c2a44'];

var paletteSequentialPinkCb = ['#fbe5ee', '#f8ccd5', '#f4b2bc', '#f096a3', '#d56976', '#bc3f52', '#a50f38', '#951735', '#851b31', '#761d2e', '#671e2a', '#581d26', '#4a1c22'];

var paletteSequentialBlueCb = ['#eaf6fc', '#cfe4f4', '#cfe4f4', '#91bfe3', '#6999bb', '#417797', '#065b78', '#11536b', '#174b5f', '#194354', '#1a3b49', '#1a343f', '#192d35'];

var paletteSequentialGreenCb = ['#fff7d0', '#e9e09b', '#d1ca62', '#b7b623', '#9e9e28', '#88872a', '#72722a', '#676726', '#5c5c23', '#51511f', '#47471b', '#3d3d17', '#333413'];

var paletteSequentialGreenBrownCb = ['#f2edde', '#d8d1c0', '#bfb699', '#a09778', '#837b5a', '#686141', '#4f4b2c', '#3e3e1f', '#2e3313', '#292d14', '#232613', '#1e2012', '#191a10'];

var paletteDivergingSpectral1 = ['#98141f', '#ab332c', '#bf5040', '#d5705b', '#e4a57f', '#f3d6a6', '#f5f2b8', '#cfdbb1', '#a4c4a9', '#71ada1', '#4e868f', '#2e637d', '#06456c'];

var paletteDivergingSpectral2 = ['#d43d4f', '#df564b', '#eb6d45', '#f08e53', '#f8b96f', '#fee08b', '#f5f2b8', '#d7e5b1', '#b5d7aa', '#8ec8a3', '#6abda3', '#4fa4b5', '#3489be'];

var paletteDivergingSpectral3 = ['#651035', '#ae1143', '#c9314b', '#dd7257', '#eeb27a', '#feeb9e', '#f5f2b8', '#cadfba', '#96cabb', '#50b4bb', '#3eaecc', '#206791', '#0c2c63'];

var paletteDivergingBrownTurquoise = ['#3f3128', '#683828', '#933624', '#d5705b', '#db9c5e', '#feeb9e', '#f5f2b8', '#cfdbb1', '#a4c4a9', '#71ada1', '#628f85', '#53746d', '#475b57'];

var paletteDivergingOrangePink = ['#e7511e', '#eb6929', '#ee7f37', '#f29446', '#f9c083', '#ffe9c3', '#ffeee3', '#f9cfc1', '#f3a9ab', '#db6882', '#c71360', '#891953', '#4b1c47'];

var paletteDivergingRedBlue = ['#b2172b', '#c4443e', '#d76a5a', '#ed937e', '#f4b8a2', '#fcdbc7', '#efefef', '#bfcad5', '#8ba7bc', '#4d87a5', '#3c7ca0', '#28729b', '#036896'];

var paletteDivergingRedGrey = ['#b2172b', '#c54532', '#da6c3b', '#f29446', '#f8bc67', '#fee08b', '#efece5', '#c9c5c1', '#a5a19f', '#808080', '#666666', '#333333', '#000000'];

var paletteDivergingOrangeViolet = ['#98141f', '#ab332c', '#f9bc47', '#fdcf66', '#fede8d', '#ffecb3', '#f9eff6', '#e8d0e3', '#a4c4a9', '#a973aa', '#834f96', '#622181', '#402357'];

var paletteDivergingPurpleGreen = ['#59194b', '#85134b', '#c71360', '#db6882', '#eba7a8', '#fce0ca', '#faefe1', '#dbd9aa', '#b9c26e', '#94ad31', '#728b2b', '#546c25', '#39521f'];

var paletteDivergingVioletGreen = ['#55296e', '#75408e', '#8a5fa0', '#a081b5', '#beadcf', '#ddd7e7', '#eae8ed', '#c1d4bc', '#93be86', '#58a951', '#3c853e', '#23662f', '#084a22'];

var paletteDivergingRedGreen = ['#b2172b', '#c5403c', '#d96453', '#ef8972', '#f6b49c', '#fcdbc7', '#f9ebde', '#dad6a8', '#b9c16d', '#94ad31', '#728b2b', '#546c25', '#39521f'];

var paletteDivergingBrownGreen = ['#735146', '#846454', '#977a65', '#aa9177', '#c2ad91', '#dbcaad', '#edebd6', '#c4d6aa', '#94bf7c', '#58a951', '#3c853e', '#23662f', '#084a22'];

var paletteDivergingLightBrownTurquoise = ['#8b5219', '#a46821', '#bf812c', '#cfa151', '#e2c489', '#f6e8c3', '#f5f1df', '#cbdccc', '#9cc6b9', '#60afa6', '#359790', '#1d7d75', '#00665e'];

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
      return d3.scaleOrdinal().range(paletteCategory1);
    }
  }, {
    key: 'category2',
    value: function category2() {
      return d3.scaleOrdinal().range(paletteCategory2);
    }
  }, {
    key: 'category3',
    value: function category3() {
      return d3.scaleOrdinal().range(paletteCategory3);
    }
  }, {
    key: 'category4',
    value: function category4() {
      return d3.scaleOrdinal().range(paletteCategory4);
    }
  }, {
    key: 'category5',
    value: function category5() {
      return d3.scaleOrdinal().range(paletteCategory5);
    }
  }, {
    key: 'category6',
    value: function category6() {
      return d3.scaleOrdinal().range(paletteCategory6);
    }
  }, {
    key: 'category7',
    value: function category7() {
      return d3.scaleOrdinal().range(paletteCategory7);
    }
  }, {
    key: 'category8',
    value: function category8() {
      return d3.scaleOrdinal().range(paletteCategory8);
    }
  }, {
    key: 'sequentialYellow',
    value: function sequentialYellow() {
      return d3.scaleQuantile().range(paletteSequentialYellow);
    }
  }, {
    key: 'sequentialRedOrange',
    value: function sequentialRedOrange() {
      return d3.scaleQuantile().range(paletteSequentialRedOrange);
    }
  }, {
    key: 'sequentialRed',
    value: function sequentialRed() {
      return d3.scaleQuantile().range(paletteSequentialRed);
    }
  }, {
    key: 'sequentialPink',
    value: function sequentialPink() {
      return d3.scaleQuantile().range(paletteSequentialPink);
    }
  }, {
    key: 'sequentialPurplePink',
    value: function sequentialPurplePink() {
      return d3.scaleQuantile().range(paletteSequentialPurplePink);
    }
  }, {
    key: 'sequentialPurple',
    value: function sequentialPurple() {
      return d3.scaleQuantile().range(paletteSequentialPurple);
    }
  }, {
    key: 'sequentialBlue',
    value: function sequentialBlue() {
      return d3.scaleQuantile().range(paletteSequentialBlue);
    }
  }, {
    key: 'sequentialLightBlue',
    value: function sequentialLightBlue() {
      return d3.scaleQuantile().range(paletteSequentialLightBlue);
    }
  }, {
    key: 'sequentialBlueViolet',
    value: function sequentialBlueViolet() {
      return d3.scaleQuantile().range(paletteSequentialBlueViolet);
    }
  }, {
    key: 'sequentialTurquoise',
    value: function sequentialTurquoise() {
      return d3.scaleQuantile().range(paletteSequentialTurquoise);
    }
  }, {
    key: 'sequentialLightGreen',
    value: function sequentialLightGreen() {
      return d3.scaleQuantile().range(paletteSequentialLightGreen);
    }
  }, {
    key: 'sequentialDarkGreen',
    value: function sequentialDarkGreen() {
      return d3.scaleQuantile().range(paletteSequentialDarkGreen);
    }
  }, {
    key: 'sequentialGreenBrown',
    value: function sequentialGreenBrown() {
      return d3.scaleQuantile().range(paletteSequentialGreenBrown);
    }
  }, {
    key: 'sequentialBrown',
    value: function sequentialBrown() {
      return d3.scaleQuantile().range(paletteSequentialBrown);
    }
  }, {
    key: 'sequentialGrey',
    value: function sequentialGrey() {
      return d3.scaleQuantile().range(paletteSequentialGrey);
    }
  }, {
    key: 'sequentialVioletCb',
    value: function sequentialVioletCb() {
      return d3.scaleQuantile().range(paletteSequentialVioletCb);
    }
  }, {
    key: 'sequentialPinkCb',
    value: function sequentialPinkCb() {
      return d3.scaleQuantile().range(paletteSequentialPinkCb);
    }
  }, {
    key: 'sequentialBlueCb',
    value: function sequentialBlueCb() {
      return d3.scaleQuantile().range(paletteSequentialBlueCb);
    }
  }, {
    key: 'sequentialGreenCb',
    value: function sequentialGreenCb() {
      return d3.scaleQuantile().range(paletteSequentialGreenCb);
    }
  }, {
    key: 'sequentialGreenBrownCb',
    value: function sequentialGreenBrownCb() {
      return d3.scaleQuantile().range(paletteSequentialGreenBrownCb);
    }
  }, {
    key: 'diverging_spectral1',
    value: function diverging_spectral1() {
      return d3.scaleQuantile().range(paletteDivergingSpectral1);
    }
  }, {
    key: 'diverging_spectral2',
    value: function diverging_spectral2() {
      return d3.scaleQuantile().range(paletteDivergingSpectral2);
    }
  }, {
    key: 'diverging_spectral3',
    value: function diverging_spectral3() {
      return d3.scaleQuantile().range(paletteDivergingSpectral3);
    }
  }, {
    key: 'diverging_brown_turquoise',
    value: function diverging_brown_turquoise() {
      return d3.scaleQuantile().range(paletteDivergingBrownTurquoise);
    }
  }, {
    key: 'diverging_orange_pink',
    value: function diverging_orange_pink() {
      return d3.scaleQuantile().range(paletteDivergingBrownTurquoise);
    }
  }, {
    key: 'diverging_red_blue',
    value: function diverging_red_blue() {
      return d3.scaleQuantile().range(paletteDivergingRedBlue);
    }
  }, {
    key: 'diverging_red_grey',
    value: function diverging_red_grey() {
      return d3.scaleQuantile().range(paletteDivergingRedGrey);
    }
  }, {
    key: 'diverging_orange_violet',
    value: function diverging_orange_violet() {
      return d3.scaleQuantile().range(paletteDivergingOrangeViolet);
    }
  }, {
    key: 'diverging_purple_green',
    value: function diverging_purple_green() {
      return d3.scaleQuantile().range(paletteDivergingPurpleGreen);
    }
  }, {
    key: 'diverging_violet_green',
    value: function diverging_violet_green() {
      return d3.scaleQuantile().range(paletteDivergingVioletGreen);
    }
  }, {
    key: 'diverging_red_green',
    value: function diverging_red_green() {
      return d3.scaleQuantile().range(paletteDivergingRedGreen);
    }
  }, {
    key: 'diverging_brown_green',
    value: function diverging_brown_green() {
      return d3.scaleQuantile().range(paletteDivergingBrownGreen);
    }
  }, {
    key: 'diverging_lightBrown_turquoise',
    value: function diverging_lightBrown_turquoise() {
      return d3.scaleQuantile().range(paletteDivergingLightBrownTurquoise);
    }
  }]);

  return Colors;
}();
'use strict';

var _default = _default || {};

_default.Barchart = {
    stacked: true,
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    xaxis: {
        label: ''
    },
    yaxis: {
        label: 'Y'
    },
    // Set the color scale for the chart. You can use Proteus scales or any D3 scale
    colorScale: Colors.category7(),
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 350,
    ticks: 5, // ticks for y axis.
    tooltip: function tooltip(data) {
        // Allows HTML
        return '<b>Eje x</b>: ' + data.x + '<br/>' + '<b>Eje y</b>: ' + data.y;
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
};
'use strict';

var _default = _default || {};

_default.Gauge = {
    selector: '#chart',
    colorScale: Colors.diverging_red_blue(),
    invertColorScale: true,
    minLevel: 0,
    maxLevel: 100,
    minAngle: -90,
    maxAngle: 90,
    ringWidth: 50,
    ringMargin: 20,
    labelInset: 10,
    needleNutRadius: 25,
    needleLenghtRatio: 0.8,
    numericIndicator: true,
    xaxis: {
        label: 'X'
    },
    yaxis: {
        label: 'Y'
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '50%', // %, auto, or numeric
    height: 250,
    style: {
        '.labels': {
            'font': '18px sans-serif',
            'text-anchor': 'middle'
        },
        '.text-indicator': {
            'font': '48px sans-serif',
            'text-anchor': 'middle'
        },
        '.needle': {
            'fill': '#666666'
        }
    },
    ticks: 10, // ticks for y axis.
    markers: {
        shape: 'circle',
        size: 5,
        color: '#FFFCCA',
        outlineColor: '#537780',
        outlineWidth: 2
    },
    tooltip: function tooltip(data) {
        return JSON.stringify(data);
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
    maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};
'use strict';

var _default = _default || {};

_default.Linechart = {
    selector: '#chart',
    xaxis: {
        label: 'X',
        ticks: 5
    },
    yaxis: {
        label: 'Y',
        ticks: 5
    },
    colorScale: Colors.category7(),
    area: false,
    areaOpacity: 0.4,
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
    height: 250,
    style: {
        '.line': {
            'stroke-width': 2,
            'fill': 'none'
        },
        '.area': {
            'stroke-width': 0
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    markers: {
        shape: 'circle',
        size: 5,
        color: '#FFFCCA',
        outlineColor: '#537780',
        outlineWidth: 2
    },
    tooltip: function tooltip(data) {
        return JSON.stringify(data);
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
    maxNumberOfElements: 100, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: true,
        prop: 'x'
    }
};
'use strict';

var _default = _default || {};

_default.StackedArea = {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: Colors.category5(),
    xaxis: {
        label: ''
    },
    yaxis: {
        label: ''
    },
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
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

};
'use strict';

var _default = _default || {};

_default.Streamgraph = {
    selector: '#chart',
    xDateFormat: '%m/%d/%y',
    colorScale: Colors.category5(),
    xaxis: {
        label: ''
    },
    yaxis: {
        label: ''
    },
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
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '100%', // %, auto, or numeric 
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

};
'use strict';

var _default = _default || {};

_default.Sunburst = {
    selector: '#chart',
    colorScale: Colors.category8(),
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '50%', // %, auto, or numeric
    height: 450,
    style: {
        '.labels': {
            'font': '18px sans-serif',
            'text-anchor': 'middle'
        },
        'path': {
            'stroke': '#fff',
            'stroke-width': 2,
            'shape-rendering': 'crispEdge'
        },
        '.infobox': {
            'text-anchor': 'middle',
            'alignment-baseline': 'central',
            'fill': 'black'
        },
        '.infobox .name': {
            'font': '28px sans-serif'
        },
        '.infobox .value': {
            'font': '24px sans-serif',
            'transform': 'translate(0, 1.5em)'
        }
    },
    tooltip: function tooltip(data) {
        return data.name + ': ' + data.value;
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
    maxNumberOfElements: 5, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};
'use strict';

var _default = _default || {};

_default.Swimlane = {
    selector: '#chart',
    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width: '99%', // %, auto, or numeric
    height: 550,
    events: {
        down: function down() {},
        over: function over() {},
        up: function up() {},
        click: function click() {},
        leave: function leave() {}
    }
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProteusEvent = function () {
    function ProteusEvent(name) {
        _classCallCheck(this, ProteusEvent);

        this.name = name;
        this.callbacks = [];
    }

    _createClass(ProteusEvent, [{
        key: "registerCallback",
        value: function registerCallback(cb) {
            this.callbacks.push(cb);
        }
    }]);

    return ProteusEvent;
}();

var Reactor = function () {
    function Reactor() {
        _classCallCheck(this, Reactor);

        this.events = {};
    }

    _createClass(Reactor, [{
        key: "registerEvent",
        value: function registerEvent(eventName) {
            var event = new ProteusEvent(eventName);
            this.events[eventName] = event;
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(eventName, args) {
            if (this.events[eventName]) {
                this.events[eventName].callbacks.forEach(function (cb) {
                    cb(args);
                });
            }
        }
    }, {
        key: "addEventListener",
        value: function addEventListener(eventName, cb) {
            //check if eventName already exists

            if (this.events[eventName]) {
                this.events[eventName].registerCallback(cb);
            }
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(eventName) {
            var event = this.events[eventName];
            event.callbacks = [];
        }
    }]);

    return Reactor;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datasource = function () {
    function Datasource() {
        _classCallCheck(this, Datasource);
    }

    _createClass(Datasource, [{
        key: 'start',
        value: function start() {
            console.log('Starting datasource');
        }
    }, {
        key: 'stop',
        value: function stop() {
            console.log('Stopping datasource');
        }
    }]);

    return Datasource;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebsocketDatasource = function (_Datasource) {
    _inherits(WebsocketDatasource, _Datasource);

    function WebsocketDatasource(source) {
        _classCallCheck(this, WebsocketDatasource);

        var _this = _possibleConstructorReturn(this, (WebsocketDatasource.__proto__ || Object.getPrototypeOf(WebsocketDatasource)).call(this));

        _this.source = source;
        _this.reactors = [];
        return _this;
    }

    _createClass(WebsocketDatasource, [{
        key: 'configure',
        value: function configure(reactor) {
            this.reactors.push(reactor);
        }
    }, {
        key: 'start',
        value: function start() {
            var _this2 = this;

            _get(WebsocketDatasource.prototype.__proto__ || Object.getPrototypeOf(WebsocketDatasource.prototype), 'start', this).call(this);
            this.ws = new WebSocket(this.source.endpoint);

            this.ws.onopen = function (e) {
                for (var rIndex in _this2.reactors) {
                    var reactor = _this2.reactors[rIndex];
                    reactor.dispatchEvent('onopen', e);
                }
            };
            this.ws.onerror = function (e) {
                for (var rIndex in _this2.reactors) {
                    var reactor = _this2.reactors[rIndex];
                    reactor.dispatchEvent('onerror', e);
                }
            };
            this.ws.onmessage = function (e) {
                //var data = JSON.parse(event.data.substr(2))[1];
                var data = JSON.parse(e.data);
                for (var rIndex in _this2.reactors) {
                    var reactor = _this2.reactors[rIndex];
                    reactor.dispatchEvent('onmessage', data);
                }
            };
        }
    }, {
        key: 'stop',
        value: function stop() {
            _get(WebsocketDatasource.prototype.__proto__ || Object.getPrototypeOf(WebsocketDatasource.prototype), 'stop', this).call(this);
            if (this.ws) {
                this.ws.close();
            }
        }
    }]);

    return WebsocketDatasource;
}(Datasource);
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
        key: '_initialize',
        value: function _initialize() {
            var width = this.config.width + this.config.margin.left + this.config.margin.right;
            var height = this.config.height + this.config.margin.top + this.config.margin.bottom;

            //Create a global 'g' (group) element
            this.svg = d3.select(this.config.selector).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');

            //Append a new group with 'x' aXis
            this.svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + this.config.height + ')').call(this.xAxis);

            this.svg.append('g').attr('class', 'y axis').attr('stroke-dasharray', '1, 2').call(this.yAxis).append('text');

            // Append axes labels
            this.svg.append('text').attr('text-anchor', 'middle').attr('class', 'x axis label').attr('x', this.config.width / 2).attr('y', this.config.height + this.config.margin.bottom).text(this.xAxisLabel);

            this.svg.append('text').attr('text-anchor', 'middle').attr('class', 'y axis label').attr('transform', 'rotate(-90)').attr('x', -this.config.height / 2).attr('y', -this.config.margin.left / 1.3).text(this.yAxisLabel);
        }
    }, {
        key: '_applyCSS',
        value: function _applyCSS() {
            var style = this.style;
            var styleValue = null;

            for (var key in style) {
                styleValue = style[key];
                for (var v in styleValue) {
                    d3.selectAll(key).style(v, styleValue[v]);
                }
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
        key: '_calculateWidth',
        value: function _calculateWidth(width) {
            if (width === 'auto') {
                return d3.select(this.config.selector).node().getBoundingClientRect().width;
            } else if (utils.isNumeric(width)) {
                //check container width TODO
                return width;
            } else if (utils.isPercentage(width)) {
                var containerWidth = void 0,
                    percentage = void 0;
                containerWidth = d3.select(this.config.selector).node().getBoundingClientRect().width;
                percentage = width.split('%')[0];
                return Math.round(percentage * containerWidth / 100);
            } else {
                throw Error('Unknow chart width: ' + width);
            }
        }
    }, {
        key: '_loadConfigOnContext',
        value: function _loadConfigOnContext(config) {
            config = config || { events: {}, markers: {}, xaxis: {}, yaxis: {} };
            if (!config.events) {
                config.events = {};
            }
            if (!config.markers) {
                config.markers = {};
            }
            if (!config.xaxis) {
                config.xaxis = {};
            }
            if (!config.yaxis) {
                config.yaxis = {};
            }
            if (!config.x) {
                config.x = {};
            }
            this.config = {};
            this.config.cType = this.constructor.name;
            this.config.selector = config.selector || _default[this.cType].selector;
            this.config.margin = config.margin || _default[this.cType].margin;
            this.config.width = config.width ? this._calculateWidth(config.width) - this.config.margin.left - this.config.margin.right : this._calculateWidth(_default[this.cType].width) - this.config.margin.left - this.config.margin.right;
            this.config.height = config.height || _default[this.cType].height;
            this.config.ticks = config.ticks || _default[this.cType].ticks;
            this.config.xticks = config.xaxis.ticks || _default[this.cType].xaxis.ticks;
            this.config.yticks = config.yaxis.ticks || _default[this.cType].yaxis.ticks;
            this.config.tickLabel = config.tickLabel || _default[this.cType].tickLabel;
            this.config.transitionDuration = config.transitionDuration || _default[this.cType].transitionDuration;
            //this.tooltip is d3-tip, so that renaming this bar to 'tip' is required
            this.config.tip = config.tooltip || _default[this.cType].tooltip;
            this.config.events = {};
            this.config.events.down = config.events.down || _default[this.cType].events.down;
            this.config.events.up = config.events.up || _default[this.cType].events.up;
            this.config.events.over = config.events.over || _default[this.cType].events.over;
            this.config.events.click = config.events.click || _default[this.cType].events.click;
            this.config.events.leave = config.events.leave || _default[this.cType].events.leave;
            this.config._sortData = config.sortData || _default[this.cType].sortData;
            this.config.style = config.style || _default[this.cType].style;
            this.config.colorScale = config.colorScale || _default[this.cType].colorScale;
            this.config.xAxisLabel = config.xaxis.label || _default[this.cType].xaxis.label;
            this.config.yAxisLabel = config.yaxis.label || _default[this.cType].yaxis.label;
        }
    }, {
        key: '_endAllTransitions',
        value: function _endAllTransitions(transition, callback) {
            var n;
            if (transition.empty()) {
                callback();
            } else {
                n = transition.size();
                transition.each('end', function () {
                    n--;
                    if (n === 0) {
                        callback();
                    }
                });
            }
        }
    }, {
        key: '_removeUserEvents',
        value: function _removeUserEvents() {
            var userEvents = ['mousedown.user', 'mouseup.user', 'mouseleave.user', 'mouseover.user', 'click.user', 'mouseover.tip', 'mouseout.tip'];
            for (var key in userEvents) {
                this.interactiveElements.on(userEvents[key], null);
            }
        }
    }, {
        key: '_updateXaxis',
        value: function _updateXaxis() {
            this.svg.select('.x.axis').transition().duration(this.transitionDuration).call(this.xAxis);
        }
    }, {
        key: '_updateYaxis',
        value: function _updateYaxis() {
            this.svg.select('.y.axis').transition().duration(this.transitionDuration).call(this.yAxis);
        }
    }, {
        key: '_updateAxis',
        value: function _updateAxis() {
            this._updateXaxis();
            this._updateYaxis();
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

    var _this = _possibleConstructorReturn(this, (SvgBarchartStrategy.__proto__ || Object.getPrototypeOf(SvgBarchartStrategy)).call(this, chartContext));

    var config = _this.config;

    _this.svgContainer = new SvgContainer(config);
    _this.axes = new XYAxes('categorical', 'linear', config);
    _this.bars = new Barset(_this.axes.xAxis, _this.axes.yAxis);

    _this.svgContainer.add(_this.axes).add(_this.bars, [new Tooltip()]);

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
      data = data || this.data;
      var svg = this.svgContainer.svg,
          config = this.config,
          isStacked = this.config.stacked,
          keys = this._getDataKeys(data),
          yMin = 0,
          yMax = 0,
          method = isStacked ? 'stacked' : 'grouped';

      yMax = isStacked ? d3.max(data, function (d) {
        return d.total;
      }) : this._calculateMaxGrouped(data);

      this.axes.updateDomainByKeysAndBBox(keys, [yMin, yMax]);

      this.axes.transition(svg, 200);

      this.bars.update(svg, config, data, method);

      this.data = data; // TODO: ? 
    }
  }, {
    key: '_calculateMaxGrouped',
    value: function _calculateMaxGrouped(data) {
      var max = -99999999;
      for (var i in data) {
        var object = data[i];
        var keys = Object.keys(object);
        for (var k in keys) {
          var key = keys[k];
          if (key !== 'total' && key !== 'key' && object[key] > max) {
            max = object[key];
          }
        }
      }
      return max;
    }
  }, {
    key: '_getDataKeys',
    value: function _getDataKeys(data) {
      return data.map(function (d) {
        return d.key;
      });
    }
  }, {
    key: 'transition2Stacked',
    value: function transition2Stacked() {
      this.config.stacked = true;
    }
  }, {
    key: 'transition2Grouped',
    value: function transition2Grouped() {
      this.config.stacked = false;
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
      _get(SvgBarchartStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgBarchartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
      this.config.stacked = typeof config.stacked === 'undefined' ? _default[this.constructor.name].stacked : config.stacked;
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

    var _this = _possibleConstructorReturn(this, (SvgLinechartStrategy.__proto__ || Object.getPrototypeOf(SvgLinechartStrategy)).call(this, chartContext));

    var config = _this.config,
        xDataType = config.x.type;

    _this.svgContainer = new SvgContainer(config);
    _this.axes = new XYAxes(xDataType, 'linear', config);
    _this.lines = new Lineset(_this.axes.xAxis, _this.axes.yAxis);

    //Include components in the chart container
    _this.svgContainer.add(_this.axes).add(_this.lines);
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
      var svg = this.svgContainer.svg,
          config = this.config,
          xDataFormat = config.x.type,
          yDataFormat = 'linear',
          bbox = null;

      this._parseData(data, xDataFormat, yDataFormat, config);

      bbox = this._getDomainBBox(data);

      this.axes.updateDomainByBBox(bbox);

      //Create a transition effect for axis rescaling
      this.axes.transition(svg, 200);

      //Now update lines
      this.lines.update(svg, config, data);
    }
    //TODO: move this function to a utility class? It is used in many charts

  }, {
    key: '_parseData',
    value: function _parseData(data, xDataFormat, yDataFormat, config) {
      data.forEach(function (d) {
        //parse x coordinate
        switch (xDataFormat) {
          case 'time':
            d.x = d3.timeParse(config.x.format)(d.x);
            break;
          case 'linear':
            d.x = +d.x;
            break;
        }
        //parse x coordinate
        switch (yDataFormat) {
          case 'time':
            d.y = d3.timeFormat;
            break;
          case 'linear':
            d.y = +d.y;
            break;
        }
      });
    }
  }, {
    key: '_getDomainBBox',
    value: function _getDomainBBox(data) {
      var minX = d3.min(data, function (d) {
        return d.x;
      }),
          maxX = d3.max(data, function (d) {
        return d.x;
      }),
          minY = d3.min(data, function (d) {
        return d.y;
      }),
          maxY = d3.max(data, function (d) {
        return d.y;
      });
      return [minX, maxX, minY, maxY];
    }

    /**
     * This method adds config options to the chart context.
     * @param  {Object} config Config object
     */

  }, {
    key: '_loadConfigOnContext',
    value: function _loadConfigOnContext(config) {
      _get(SvgLinechartStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgLinechartStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
      this.config = this.config || {};
      this.config.markers = {};
      this.config.markers.color = config.markers.color || _default.Linechart.markers.color;
      this.config.markers.outlineColor = config.markers.outlineColor || _default.Linechart.markers.outlineColor;
      this.config.markers.outlineWidth = config.markers.outlineWidth || _default.Linechart.markers.outlineWidth;
      this.config.markers.shape = config.markers.shape || _default.Linechart.markers.shape;
      this.config.markers.size = config.markers.size || _default.Linechart.markers.size;
      this.config.area = typeof config.area === 'undefined' ? _default.Linechart.area : config.area;
      this.config.areaOpacity = config.areaOpacity || _default.Linechart.areaOpacity;
      this.config.x = {};
      this.config.x.type = config.x.type || _default.Linechart.xDataType;
      this.config.x.format = config.x.format || _default.Linechart.xDateFormat;
      this.config.x.ticks = config.x.ticks;

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

        var _this = _possibleConstructorReturn(this, (SvgStreamgraphStrategy.__proto__ || Object.getPrototypeOf(SvgStreamgraphStrategy)).call(this, chartContext));

        _this.x = d3.scaleTime().range([0, _this.config.width]);

        _this.y = d3.scaleLinear().range([_this.config.height - 10, 0]);
        _this.z = _this.config.colorScale;

        _this.xAxis = d3.axisBottom(_this.x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat("%m/%d/%y"));

        _this.yAxis = d3.axisLeft(_this.y).tickSizeInner(-_this.config.width).tickSizeOuter(0).tickPadding(20).ticks(_this.config.ticks, _this.config.tickLabel).tickFormat(function (d) {
            return d;
        });

        _this.keys = null;
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

            var stack = null;

            //Initialize data
            if (!this._initialized) {
                this._initialize();
            }

            stack = d3.stack().keys(data.keys).order(d3.stackOrderInsideOut).offset(d3.stackOffsetWiggle);

            data.values.forEach(function (d) {
                d.date = d3.timeParse(_this2.xDateformat)(d.date);
            });

            var dataSeries = stack(data.values);

            this.x.domain(d3.extent(data.values, function (d) {
                return d.date;
            }));
            window.a = dataSeries;

            this.y.domain([d3.min(a, function (serie) {
                return d3.min(serie, function (d) {
                    return d[0];
                });
            }), d3.max(a, function (serie) {
                return d3.max(serie, function (d) {
                    return d[1];
                });
            })]);

            var self = this;

            var area = d3.area().curve(d3.curveCardinal).x(function (d) {
                return _this2.x(d.data.date);
            }).y0(function (d) {
                return _this2.y(d[0]);
            }).y1(function (d) {
                return _this2.y(d[1]);
            });

            var series = this.svg.selectAll('.series').data(dataSeries).enter().append('g').attr('class', 'series').style('stroke', function (d, i) {
                return _this2.config.colorScale(i);
            });

            series.append('path').attr('class', 'layer').attr('d', area).style('fill', function (d, i) {
                return _this2.z(i);
            });

            series.attr('opacity', 1).on('mousedown.user', this.config.events.down).on('mouseup.user', this.config.events.up).on('mouseleave.user', this.config.events.leave).on('mouseover.user', this.config.events.over).on('click.user', this.config.events.click);

            this._updateAxis();
        }
    }, {
        key: '_initialize',
        value: function _initialize() {
            _get(SvgStreamgraphStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgStreamgraphStrategy.prototype), '_initialize', this).call(this);
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
            _get(SvgStreamgraphStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgStreamgraphStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
            this.colorScale = config.colorScale || _default.StackedArea.colorScale;
            this.xDateformat = config.xDateFormat || _default.StackedArea.xDateFormat;
        }
    }]);

    return SvgStreamgraphStrategy;
}(SvgChart);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgGaugeStrategy = function (_SvgChart) {
  _inherits(SvgGaugeStrategy, _SvgChart);

  function SvgGaugeStrategy(chartContext) {
    _classCallCheck(this, SvgGaugeStrategy);

    //Create scale
    var _this = _possibleConstructorReturn(this, (SvgGaugeStrategy.__proto__ || Object.getPrototypeOf(SvgGaugeStrategy)).call(this, chartContext));

    _this.scale = d3.scaleLinear().domain([_this.config.minLevel, _this.config.maxLevel]).range([0, 1]);

    _this.angleScale = d3.scaleLinear().domain([_this.config.minLevel, _this.config.maxLevel]).range([90 + _this.config.minAngle, 90 + _this.config.maxAngle]);

    _this.config.colorScale.domain([0, 1]);

    _this.scaleMarks = _this.scale.ticks(_this.config.ticks);
    _this.tickData = d3.range(_this.config.ticks).map(function () {
      return 1 / _this.config.ticks;
    });

    _this.keyFunction = function (d) {
      return d.x;
    };
    _this.translation = function () {
      return 'translate(' + _this.r + ',' + _this.r + ')';
    };

    return _this;
  }

  /**
   * Renders a gauge chart based on data object
   * @param  {Object} data Data Object. Contains a numeric value.
   * 
   */


  _createClass(SvgGaugeStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      var needleLen = null;

      _get(SvgGaugeStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgGaugeStrategy.prototype), 'draw', this).call(this, data);
      this.datum = data[data.length - 1];
      needleLen = this.config.needleLenghtRatio * this.r;

      console.log(this.config.needleNutRadius, needleLen, this.config.needleLenghtRatio, this.r);
      // Append the needle
      if (!this.needle) {
        this.needle = this.svg.append('path').attr('class', 'needle').datum(this.datum.x).attr('transform', function (d) {
          return 'translate(' + _this2.r + ', ' + _this2.r + ') rotate(' + (_this2.angleScale(d) - 90) + ')';
        }).attr('d', 'M ' + (0 - this.config.needleNutRadius) + ' ' + 0 + ' L ' + 0 + ' ' + (0 - needleLen) + ' L ' + this.config.needleNutRadius + ' ' + 0);
      }

      this.needle.transition().attr('transform', function (d) {
        return 'translate(' + _this2.r + ', ' + _this2.r + ') rotate(' + (_this2.angleScale(_this2.datum.x) - 90) + ')';
      }).attr('d', 'M ' + (0 - this.config.needleNutRadius) + ' ' + 0 + ' L ' + 0 + ' ' + (0 - needleLen) + ' L ' + this.config.needleNutRadius + ' ' + 0);

      this.svg.select('.text-indicator').text(this.datum.x);

      this._applyCSS();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      var _this3 = this;

      var width = this.config.width + this.config.margin.left + this.config.margin.right;
      var height = this.config.height + this.config.margin.top + this.config.margin.bottom;
      var labels = null;
      var arcs = null;

      //Create a global 'g' (group) element
      this.svg = d3.select(this.config.selector).append('svg').attr('width', this.config.width).attr('height', this.config.height).append('g').attr('transform', 'translate(' + this.config.margin.left + ',' + this.config.margin.top + ')');

      this.range = this.config.maxAngle - this.config.minAngle;
      this.r = (this.config.width > this.config.height ? this.config.height : this.config.width) / 2;
      this.needleLength = Math.round(this.r * this.needleLenghtRatio);

      this.arc = d3.arc().innerRadius(this.r - this.config.ringWidth - this.config.ringMargin).outerRadius(this.r - this.config.ringMargin).startAngle(function (d, i) {
        var ratio = d * i;
        return utils.deg2rad(_this3.config.minAngle + ratio * _this3.range);
      }).endAngle(function (d, i) {
        var ratio = d * (i + 1);
        return utils.deg2rad(_this3.config.minAngle + ratio * _this3.range);
      });

      // Append the ring
      arcs = this.svg.append('g').attr('class', 'arc').attr('transform', this.translation);

      // Append the ring sectors
      var arcPaths = arcs.selectAll('path').data(this.tickData).enter().append('path')
      // ID for textPath linking
      .attr('id', function (d, i) {
        return 'sector-' + i;
      }).attr('d', this.arc);

      // Fill colors
      if (this.config.invertColorScale) {
        arcPaths.attr('fill', function (d, i) {
          return _this3.config.colorScale(1 - d * i);
        });
      } else {
        arcPaths.attr('fill', function (d, i) {
          return _this3.config.colorScale(d * i);
        });
      }

      // Apend the scale labels
      labels = this.svg.append('g').attr('class', 'labels').attr('transform', this.translation);

      // Append scale marker labels
      labels.selectAll('text').data(this.scaleMarks).enter().append('text').attr('transform', function (d) {
        var ratio = _this3.scale(d);
        var newAngle = _this3.config.minAngle + ratio * _this3.range;
        return 'rotate(' + newAngle + ') translate(0,' + (_this3.config.labelInset - _this3.r) + ')';
      }).text(function (d) {
        return d;
      });

      // Append needle nut
      this.svg.append('circle').attr('class', 'needle').attr('transform', this.translation).attr('cx', 0).attr('cy', 0).attr('r', this.config.needleNutRadius);

      this.svg.append('g').attr('class', 'needle');

      if (this.config.numericIndicator) {
        this.svg.append('text').attr('class', 'text-indicator').attr('transform', this.translation).attr('x', 0).attr('y', 100).text('0');
      }

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
      _get(SvgGaugeStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgGaugeStrategy.prototype), '_loadConfigOnContext', this).call(this, config);
      this.config = this.config || {};
      this.config.minLevel = config.minLevel || _default.Gauge.minLevel;
      this.config.maxLevel = config.maxLevel || _default.Gauge.maxLevel;
      this.config.minAngle = config.minAngle || _default.Gauge.minAngle;
      this.config.maxAngle = config.maxAngle || _default.Gauge.maxAngle;
      this.config.ticks = config.ticks || _default.Gauge.ticks;
      this.config.ringWidth = config.ringWidth || _default.Gauge.ringWidth;
      this.config.ringMargin = config.ringMargin || _default.Gauge.ringMargin;
      this.config.labelInset = config.labelInset || _default.Gauge.labelInset;
      this.config.needleNutRadius = config.needleNutRadius || _default.Gauge.needleNutRadius;
      this.config.needleLenghtRatio = config.needleLenghtRatio || _default.Gauge.needleLenghtRatio;
      this.config.invertColorScale = typeof config.invertColorScale === 'undefined' ? _default.Gauge.invertColorScale : config.invertColorScale;
      this.config.numericIndicator = typeof config.numericIndicator === 'undefined' ? _default.Gauge.numericIndicator : config.numericIndicator;
      //Just for testing purposes
      return this;
    }
  }]);

  return SvgGaugeStrategy;
}(SvgChart);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgSunburstStrategy = function (_SvgChart) {
  _inherits(SvgSunburstStrategy, _SvgChart);

  function SvgSunburstStrategy(chartContext) {
    _classCallCheck(this, SvgSunburstStrategy);

    return _possibleConstructorReturn(this, (SvgSunburstStrategy.__proto__ || Object.getPrototypeOf(SvgSunburstStrategy)).call(this, chartContext));
  }

  /**
   * Renders a barchart based on data object
   * @param  {Object} data Data Object. Contains an array with x and y properties.
   * 
   */


  _createClass(SvgSunburstStrategy, [{
    key: 'draw',
    value: function draw(data) {
      var _this2 = this;

      if (!this._initialized) {
        this._initialize();
      }

      // Remove all the paths before redrawing
      this._removePaths();

      // Create layout partition
      var partition = d3.partition();
      var root = d3.hierarchy(data).sum(function (d) {
        return d.value;
      });
      partition(root);

      // Create arc generator
      this.arcGen = d3.arc().startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, _this2.x(d.x0)));
      }).endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, _this2.x(d.x1)));
      }).innerRadius(function (d) {
        return Math.max(0, _this2.y(d.y0));
      }).outerRadius(function (d) {
        return Math.max(0, _this2.y(d.y1));
      });

      // Draw the paths (arcs)
      var paths = this.svg.selectAll('path').data(root.descendants()).enter().append('path').attr('d', this.arcGen).style('fill', function (d) {
        if (!d.parent) {
          return 'white';
        } else {
          return _this2.colorScale(d.data.name);
        }
      });

      // Create infobox
      var infobox = this.svg.append('g').attr('class', 'infobox').attr('pointer-events', 'none');
      // Append central circle
      infobox.append('text').attr('class', 'name').attr('x', 0).attr('y', 0).attr('pointer-events', 'none');
      infobox.append('text').attr('class', 'value').attr('x', 0).attr('y', 0).attr('pointer-events', 'none');

      paths.on('mouseover', function (d) {
        var ancestors = _this2._getAncestors(d);
        // Fade all the arcs
        if (ancestors.length > 0) {
          d3.selectAll('path').style('opacity', 0.3);
        }
        d3.selectAll('path').filter(function (node) {
          return ancestors.indexOf(node) >= 0;
        }).style('opacity', 1);
        // Hightlight the hovered arc
        _this2.svg.select('.infobox .name').text(d.data.name);
        _this2.svg.select('.infobox .value').text(d.value);
      }).on('mouseout', function (d) {
        d3.selectAll('path').style('opacity', 1);
        d3.select('.infobox .name').style('font-weight', 'normal');
        d3.select('.infobox .name').text('');
        d3.select('.infobox .value').text('');
      });

      d3.select(self.frameElement).style('height', this.height + 'px');

      this._applyCSS();
    }

    /**
     * Zooms into the clicked arc.
     * From: https://bl.ocks.org/mbostock/4348373
     * @param d Current arc data
     * @private
     */

  }, {
    key: '_zoom',
    value: function _zoom(d) {
      var _this3 = this;

      this.svg.transition().duration(450).tween('scale', function () {
        var xd = d3.interpolate(_this3.x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(_this3.y.domain(), [d.y, 1]),
            yr = d3.interpolate(_this3.y.range(), [d.y ? 30 : 0, _this3.radius]);
        return function (t) {
          _this3.x.domain(xd(t));
          _this3.y.domain(yd(t)).range(yr(t));
        };
      }).selectAll('path').attrTween('d', function (d) {
        return function () {
          return _this3.arcGen(d);
        };
      });
    }

    /**
     * From: http://bl.ocks.org/kerryrodden/7090426
     * @param node
     * @returns {Array}
     * @private
     */

  }, {
    key: '_getAncestors',
    value: function _getAncestors(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    }

    /**
     * Removes all the paths (arcs). Doing this before each redraw prevents the
     * transition to mess up the arcs.
     * @private
     */

  }, {
    key: '_removePaths',
    value: function _removePaths() {
      this.svg.selectAll('path').remove();
    }
  }, {
    key: '_initialize',
    value: function _initialize() {
      // super._initialize();

      var width = this.width + this.margin.left + this.margin.right;
      var height = this.height + this.margin.left + this.margin.right;
      this.radius = Math.min(width, height) / 2 - 10; // TODO 10 = margin

      // Create scales
      this.x = d3.scaleLinear().range([0, 2 * Math.PI]);
      this.y = d3.scaleSqrt().range([0, this.radius]);

      // Create a global 'g' (group) element
      this.svg = d3.select(this.selector).append('svg').attr('width', this.width).attr('height', this.height).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

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
      _get(SvgSunburstStrategy.prototype.__proto__ || Object.getPrototypeOf(SvgSunburstStrategy.prototype), '_loadConfigOnContext', this).call(this, config);

      //Just for testing purposes
      return this;
    }
  }]);

  return SvgSunburstStrategy;
}(SvgChart);
'use strict';
/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chart = function () {
    function Chart(d, config) {
        _classCallCheck(this, Chart);

        var clazz = this.constructor.name;
        if (clazz === 'Chart' || clazz === 'Basic' || clazz === 'Flow' || clazz === 'Temporal' || clazz === 'Hierarchical') {
            throw new Error(clazz + ' is non-instanciable');
        }

        this.events = {};
        this.reactor = new Reactor();

        if (!d && !config) {
            throw new Error('Missing constructor parameters');
        }

        var dataFormat = d.constructor.name;
        var nArguments = d && config ? 2 : 1;

        switch (dataFormat) {
            case 'WebsocketDatasource':
                this.datasource = d;
                this.data = [];
                this._configureDatasource();
                break;
            case 'Array':
                this.data = d;
                break;
            case 'Object':
                this.data = d;
                break;
            default:
                throw TypeError('Wrong data format');
        }
        //if only 1 parameter is specified, take default config. Else, take the second argument as config.
        this.config = nArguments === 1 ? _default[this.constructor.name] : config;

        this._initializeSVGContext();
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
         * Renders data on barchart. Only allowed when data is an array of static data.
         * @param  {Array} data Array of data
         */

    }, {
        key: 'draw',
        value: function draw() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

            var config = this.config,
                sort = config.sort,
                p = null,
                desc = null;

            if (sort) {
                p = config.sort.field;
                desc = config.sort.desc;
                data.sort(function (e1, e2) {
                    var a = e1[p];
                    var b = e2[p];
                    return a < b ? -1 : a > b ? 1 : 0;
                });
            }
            if (!utils.isArray(data) && !utils.isObject(data)) {
                throw new TypeError('draw method is only allowed with static data.');
            }
            data = JSON.parse(JSON.stringify(data));
            this._svg.draw(data);
        }

        /**
         * Returns a PNG image of the current graph
         * @return {String} Image - in data-url format
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
            if (!eventName || typeof eventName !== 'string') {
                throw Error('eventName should be a string. Instead: ' + eventName);
            }
            if (!action || !utils.isFunction(action)) {
                throw Error('action should be a function. Instead: ' + eventName);
            }

            this.events[eventName] = action;
            this._svg.on(this.events);
            return this;
        }
    }, {
        key: '_configureDatasource',
        value: function _configureDatasource() {
            var _this = this;

            this.datasource.configure(this.reactor);
            this.reactor.registerEvent('onmessage');
            this.reactor.registerEvent('onerror');
            this.reactor.registerEvent('onopen');

            this.reactor.addEventListener('onmessage', function (data) {
                _this.keepDrawing(data);
            });

            this.reactor.addEventListener('onopen', function (e) {
                console.debug('Connected to websocket endpoint.', e);
            });

            this.reactor.addEventListener('onerror', function (error) {
                console.error('An error has occured: ', error);
            });
        }
    }, {
        key: 'pause',
        value: function pause() {
            if (!this.datasource) {
                throw 'You need a datasource to pause a streaming';
            }
            this.reactor.removeEventListener('onmessage');
        }
    }, {
        key: 'resume',
        value: function resume() {
            var _this2 = this;

            if (!this.datasource) {
                throw 'You need a datasource to resume a streaming';
            }

            this.reactor.addEventListener('onmessage', function (data) {
                _this2.keepDrawing(data);
            });
        }
    }]);

    return Chart;
}();
'use strict';

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Basic = function (_Chart) {
  _inherits(Basic, _Chart);

  function Basic(data, config) {
    _classCallCheck(this, Basic);

    return _possibleConstructorReturn(this, (Basic.__proto__ || Object.getPrototypeOf(Basic)).call(this, data, config));
  }

  _createClass(Basic, [{
    key: 'keepDrawing',
    value: function keepDrawing(datum, mode) {
      var config = this.config;
      var maxNumberOfElements = config.maxNumberOfElements;
      var d = null;

      if (!datum) {
        console.warn('attemp to draw null datum');
        return;
      }

      for (var i in datum) {
        d = datum[i];

        //Find serie or initialize this.
        var serie = utils.findElement(this.data, 'key', d.key);
        if (!serie || !serie.values) {
          serie = {
            key: d.key,
            values: []
          };
          this.data.push(serie);
        }

        this._addByMode(serie, d, mode);
      }

      //Loop series and check the maxNumberOfElements
      for (var _i in this.data) {
        var _serie = this.data[_i];
        while (_serie.values.length > maxNumberOfElements) {
          _serie.values.splice(0, 1);
        }
      }

      this.draw(this.data);
    }

    /**
     * Add data to a serie depending on its mode (add or replace)
     */

  }, {
    key: '_addByMode',
    value: function _addByMode(serie, d, mode) {
      if (mode === 'add') {
        serie.values = serie.values.concat(d.values);
      } else if (mode === 'replace') {
        serie.values = d.values;
      } else {
        throw Error('Unknow keepDrawing mode:  ' + mode);
      }
    }
  }]);

  return Basic;
}(Chart);
'use strict';

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Flow = function (_Chart) {
    _inherits(Flow, _Chart);

    function Flow(data, config) {
        _classCallCheck(this, Flow);

        return _possibleConstructorReturn(this, (Flow.__proto__ || Object.getPrototypeOf(Flow)).call(this, data, config));
    }

    _createClass(Flow, [{
        key: 'draw',
        value: function draw(data) {
            //hack to clone object. It is because flow chart (like streamgraph) modify the original dataset to create itself. 
            //It could be a problem in streaming scenario, where data is concatenated with new data. We need to keep the original dataset.
            data = JSON.parse(JSON.stringify(data));
            _get(Flow.prototype.__proto__ || Object.getPrototypeOf(Flow.prototype), 'draw', this).call(this, data);
        }
    }]);

    return Flow;
}(Chart);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Temporal = function (_Chart) {
  _inherits(Temporal, _Chart);

  function Temporal() {
    _classCallCheck(this, Temporal);

    return _possibleConstructorReturn(this, (Temporal.__proto__ || Object.getPrototypeOf(Temporal)).apply(this, arguments));
  }

  return Temporal;
}(Chart);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hierarchical = function (_Chart) {
    _inherits(Hierarchical, _Chart);

    function Hierarchical(data, config) {
        _classCallCheck(this, Hierarchical);

        return _possibleConstructorReturn(this, (Hierarchical.__proto__ || Object.getPrototypeOf(Hierarchical)).call(this, data, config));
    }

    _createClass(Hierarchical, [{
        key: 'draw',
        value: function draw() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

            data = JSON.parse(JSON.stringify(data));
            this._svg.draw(data);
        }
    }]);

    return Hierarchical;
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

    return _possibleConstructorReturn(this, (Barchart.__proto__ || Object.getPrototypeOf(Barchart)).call(this, data, config));
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data - This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Barchart, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Barchart.prototype.__proto__ || Object.getPrototypeOf(Barchart.prototype), 'draw', this).call(this, data);
    }
  }, {
    key: 'fire',
    value: function fire(event, data) {
      //TODO: improve this section
      if (event === 'transition') {
        if (data === 'grouped') {
          this._svg.strategy.transition2Grouped();
        } else if (data === 'stacked') {
          this._svg.strategy.transition2Stacked();
        }

        this._svg.strategy.draw();
      }
      // var element = this._svg.strategy.svg;
      // if (!element || !element[0][0]) {
      //   throw Error('Cannot fire events because SVG dom element is not yet initialized');
      // }
      // element[0][0].dispatchEvent(new CustomEvent(event, { detail: { type: data } }));
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {Object} datum - data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      _get(Barchart.prototype.__proto__ || Object.getPrototypeOf(Barchart.prototype), 'keepDrawing', this).call(this, datum, 'replace');
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

    return _possibleConstructorReturn(this, (Linechart.__proto__ || Object.getPrototypeOf(Linechart)).call(this, data, config));
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

      _get(Linechart.prototype.__proto__ || Object.getPrototypeOf(Linechart.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {Object} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      _get(Linechart.prototype.__proto__ || Object.getPrototypeOf(Linechart.prototype), 'keepDrawing', this).call(this, datum, 'add');
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
  function Streamgraph(data, config) {
    _classCallCheck(this, Streamgraph);

    return _possibleConstructorReturn(this, (Streamgraph.__proto__ || Object.getPrototypeOf(Streamgraph)).call(this, data, config));
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

      _get(Streamgraph.prototype.__proto__ || Object.getPrototypeOf(Streamgraph.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {Object} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      if (!this.datum) {
        this.datum = [];
      }
      this.datum = this.datum.concat(datum);
      _get(Streamgraph.prototype.__proto__ || Object.getPrototypeOf(Streamgraph.prototype), 'draw', this).call(this, this.datum);
    }
  }]);

  return Streamgraph;
}(Flow);
'use strict';

/**
 * Gauge implementation. This charts belongs to 'Basic' family.
 * It is inherited on 'Basic'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gauge = function (_Basic) {
  _inherits(Gauge, _Basic);

  /**
   * Gauge constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  function Gauge(data, config) {
    _classCallCheck(this, Gauge);

    return _possibleConstructorReturn(this, (Gauge.__proto__ || Object.getPrototypeOf(Gauge)).call(this, data, config));
  }

  /**
   * Renders a data object on the chart.
   * @param  {Object} data This object contains the data that will be rendered on chart. If you do not
   * specify this param, this.data will be used instead.
   */


  _createClass(Gauge, [{
    key: 'draw',
    value: function draw() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? this.data : arguments[0];

      _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'draw', this).call(this, data);
    }

    /**
     * Add new data to the current graph. If it is empty, this creates a new one.
     * @param  {Object} datum data to be rendered
     */

  }, {
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      this.data = [datum[0]];
      _get(Gauge.prototype.__proto__ || Object.getPrototypeOf(Gauge.prototype), 'draw', this).call(this);
    }
  }]);

  return Gauge;
}(Basic);
'use strict';

/**
 * Sunburst implementation. This charts belongs to 'Hierarchical' family.
 * It is inherited on 'Hierarchical'.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sunburst = function (_Hierarchical) {
  _inherits(Sunburst, _Hierarchical);

  /**
   * Sunburst constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  function Sunburst(data, config) {
    _classCallCheck(this, Sunburst);

    return _possibleConstructorReturn(this, (Sunburst.__proto__ || Object.getPrototypeOf(Sunburst)).call(this, data, config));
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {Object} datum data to be rendered
   */


  _createClass(Sunburst, [{
    key: 'keepDrawing',
    value: function keepDrawing(datum) {
      if (this.data.constructor === Array) {
        this.data = {};
      }
      var config = this.config;
      if (!datum) {
        console.warn('attemp to draw null datum');
        return;
      }

      this._buildTree(datum[datum.length - 1].path, datum[datum.length - 1].value, this.data);

      this.draw();

      return this.data;
    }

    /**
     * Inserts the new nodes into the existing tree.
     * From: http://bl.ocks.org/kerryrodden/7090426
     *
     * @param pathString
     * @param value
     * @param data
     * @private
     */

  }, {
    key: '_buildTree',
    value: function _buildTree(pathString, value, data) {
      var path = pathString.split('/');
      var current = data;
      for (var i = 1; i < path.length; i++) {
        var children = current.children;
        var name = path[i];
        var child;
        if (i + 1 < path.length) {
          var foundChild = false;
          for (var j = 0; children !== undefined && j < children.length; j++) {
            if (children[j].name === name) {
              child = children[j];
              foundChild = true;
              break;
            }
          }
          if (!foundChild) {
            child = {
              'name': name,
              'children': []
            };
            if (children === undefined) {
              current.children = [];
            }
            delete current.value;
            current.children.push(child);
          }
          current = child;
        } else {
          child = {
            'name': name,
            'value': value
          };
          if (children === undefined) {
            current.children = [];
          }
          delete current.value;
          current.children.push(child);
        }
      }
    }
  }]);

  return Sunburst;
}(Hierarchical);
'use strict';

(function () {
  window.ProteusFactory = {
    create: function create(params) {
      switch (params.type) {
        case 'Linechart':
          return new Linechart(params.data, params.config);
        case 'Barchart':
          return new Barchart(params.data, params.config);
        case 'Gauge':
          return new Gauge(params.data, params.config);
        case 'Streamgraph':
          return new Streamgraph(params.data, params.config);
        case 'Sunburst':
          return new Sunburst(params.data, params.config);
        case 'StackedArea':
          return new StackedArea(params.data, params.config);
        default:
          throw TypeError('Unknow chart type' + params.type);
      }
    }
  };
})();