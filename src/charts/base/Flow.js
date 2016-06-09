'use strict';

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */
class Flow extends Chart {
    constructor(data, config) {
        super(data, config);
    }

    draw(data) {
        //hack to clone object. It is because flow chart (like streamgraph) modify the original dataset to create itself. 
        //It could be a problem in streaming scenario, where data is concatenated with new data. We need to keep the original dataset.
        data = JSON.parse(JSON.stringify(data));
        super.draw(data);
    }
}