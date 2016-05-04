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