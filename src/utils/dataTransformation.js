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
  simple2nested(data, key = 'key'){
    return d3.nest().key((d) => d[key]).entries(data);
  }
}