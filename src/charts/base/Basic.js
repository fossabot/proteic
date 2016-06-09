'use strict';

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

class Basic extends Chart {
  constructor(data, config) {
    super(data, config);
  }

  keepDrawing(datum, mode) {
    let config = this.config;
    let maxNumberOfElements = config.maxNumberOfElements;

    if (!datum) {
      console.warn('attemp to draw null datum');
      return;
    }

    for (let i in datum) {
      var d = datum[i];

      //Find serie or initialize this.
      let serie = utils.findElement(this.data, 'key', d.key);
      if (!serie || !serie.values) {
        serie = {
          key: d.key,
          values: []
        };
        this.data.push(serie);
      }

      this._addByMode(serie, d, mode);

    }
    this.draw(this.data);
    return this.data;
  }


  _addByMode(serie, d, mode) {
    if (mode === 'add') {
      serie.values = serie.values.concat(d.values);
    }
    else if (mode === 'replace') {
      serie.values = d.values;
    }
    else {
      throw Error('Unknow keepDrawing mode:  ' + mode);
    }
  }
}
