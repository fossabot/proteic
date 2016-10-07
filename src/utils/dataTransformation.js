export function simple2stacked(data) {
  return d3.nest().key((d) => d.x).rollup((array) => {
    let r = {};
    for (let i in array) {
      let object = array[i];
      r[array[i].key] = array[i].y;
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


export function convertPropretiesToTimeFormat (data, properties, format) {
    data.forEach((d) => {
      properties.map((p) => {
        d[p] = d3.timeParse(format)(d[p]);
      });
    });
}

export function convertByXYFormat(data, config) {
  var xType = config.x.type,
    yType = config.y.type,
    xFormat = config.x.format,
    yFormat = config.y.format;

  data.forEach((d) => {
    //parse x coordinate
    switch (xType) {
      case 'time':
        d.x = d3.timeParse(xFormat)(d.x);
        break;
      case 'linear':
        d.x = +d.x;
        break;
    }
    //parse Y coordinate
    switch (yType) {
      case 'time':
        d.y = d3.timeParse(yFormat)(d.y);
        break;
      case 'linear':
        d.y = +d.y;
        break;
    }
  });

  return data;
}