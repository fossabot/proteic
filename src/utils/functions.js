var utils = utils || {
  isArray(d) {
    return d && d.constructor === Array && d instanceof Array;
  },

  isObject(d) {
    return d && d.constructor === Object && d instanceof Object;
  },

  getNumberOfDifferentArrayKeys(array, field) {
    var keys = [];

    if (!array || !array.length) {
      return 0;
    }

    for (let i = 0; i < array.length; i++) {
      var element = field ? array[i][field] : array[i];
      if (element) {
        keys.push(element);
      }
    }
    return d3.set(keys).size();
  },

  sortBy(array, o) {
    var _toString = Object.prototype.toString;
    var _parser = (x) => { return x; };
    var _getItem = (x) => {
      return _parser((x !== null && typeof x === "object" && x[o.prop]) || x);
    };

    if (!(array instanceof Array) || !array.length) {
      return [];
    }
    if (_toString.call(o) !== "[object Object]") {
      o = {};
    }
    if (typeof o.parser !== "function") {
      o.parser = _parser;
    }
    o.desc = o.desc ? -1 : 1;
    return array.sort((a, b) => {
      a = _getItem.call(o, a);
      b = _getItem.call(o, b);
      return o.desc * (a < b ? -1 : +(a > b));
    });
  }
};
