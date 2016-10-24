import {nest, timeParse} from 'd3';

export function simple2stacked(data) {
  return nest().key((d) => d.x).rollup((array) => {
    let r = {};
    for (let i = 0; i < array.length; i++) {
      let object = array[i];
      if (object) {
        r[object.key] = object.y;
      }
    }
    return r;
  }).entries(data);
}

export function simple2nested(data, key = 'key') {
  return nest().key((d) => d[key]).entries(data);
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

export function simple2Linked(data) {
  var linkedData = { links: [], nodes: [] };
  data.map((d) => d.key === 'link' ? linkedData.links.push(d) : linkedData.nodes.push(d));
  return linkedData;
}


export function convertPropretiesToTimeFormat(data, properties, format) {
  data.forEach((d) => {
    properties.map((p) => {
      d[p] = timeParse(format)(d[p]);
    });
  });
}

export function convertByXYFormat(data, config) {
  data.forEach((d) => {
    //parse x coordinate
    switch (config.xAxisType) {
      case 'time':
        d.x = timeParse(config.xAxisFormat)(d.x);
        break;
      case 'linear':
        d.x = +d.x;
        break;
    }
    //parse Y coordinate
    switch (config.yAxisType) {
      case 'time':
        d.y = timeParse(config.yAxisFormat)(d.y);
        break;
      case 'linear':
        d.y = +d.y;
        break;
    }
  });
  return data;
}