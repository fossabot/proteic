'use strict';

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

class Basic extends Chart {
    constructor() {
        super();
    }

    keepDrawing(datum) {
        let config = this.config;
        let maxNumberOfElements = config.maxNumberOfElements;

        if (!datum) {
            console.warn('attemp to draw null datum');
            return;
        }

        if (datum.constructor.name === 'Array') {
            for (let i in datum) {
                this.keepDrawing(datum[i]);
            }
        }
        else {
            //Find serie or initialize this.
            let serie = utils.findElement(this.data, 'key', datum.key);
            if (!serie || !serie.values) {
                serie = {
                    key: datum.key,
                    values: []
                };
                this.data.push(serie);
            }
            //use addToSerie()

            serie.values = serie.values.concat(datum.values);
        }
        this.draw(this.data);
        return this.data;
    }
}
