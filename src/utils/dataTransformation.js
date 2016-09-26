var utils = utils || {};

utils.dataTransformation = utils.dataTransformation || {
  simple2stacked(data) {
    return d3.nest().key((d) => d.x).rollup((array) => {
      let r = {};
      for (let i in array) {
        let object = array[i];
        r[array[i].key] = array[i].y;
      }
      return r;
    }).entries(data);
  },
  simple2nested(data, key = 'key') {
    return d3.nest().key((d) => d[key]).entries(data);
  },
  nested2simple(data) {
    let array = Array();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].values.length; j++) {
        let key = data[i].key;
        let x = data[i].values[j].x;
        let y = data[i].values[j].y;
        array.push({key: key, x: x, y: y});
      }
    }
    return array;
  }
}