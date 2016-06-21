'use strict';

class Hierarchical extends Chart {
    constructor(data, config) {
        super(data, config);
    }

    draw(data = this.data) {
        data = JSON.parse(JSON.stringify(data));
        this._svg.draw(data);
    }
}