export function simple2stacked(data) {
  return d3.nest().key((d) => d.x).rollup((array) => {
    let r = {};
    for (let i in array) {
      let object = array[i];
      if (object) {
        r[object.key] = object.y;
      }
    }
    return r;
  }).entries(data);
}

export function simple2nested(data, key = 'key') {
  return d3.nest().key((d) => d[key]).entries(data);
}

export function nested2simple(data) {
  let array = Array();
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].values.length; j++) {
      let key = data[i].key;
      let x = data[i].values[j].x;
      let y = data[i].values[j].y;
      array.push({ key: key, x: x, y: y });
    }
  }
  return array;
}


export function parseDataXY(data, xDataFormat, yDataFormat, config) {
  data.forEach((d) => {
    //parse x coordinate
    switch (xDataFormat) {
      case 'time':
        d.x = d3.timeParse(config.x.format)(d.x);
        break;
      case 'linear':
        d.x = +d.x;
        break;
    }
    //parse Y coordinate
    switch (yDataFormat) {
      case 'time':
        d.y = d3.timeParse(config.y.format)(d.y);
        break;
      case 'linear':
        d.y = +d.y;
        break;
    }
  });
  return data;
}