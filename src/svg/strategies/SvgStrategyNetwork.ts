import LinkedNodeset from '../components/LinkedNodeset';
import Legend from '../components/Legend';

import Config from '../../Config';
import SvgChart from '../base/SvgChart';
import { sortByField } from '../../utils/dataSorting';

class SvgStrategyNetwork extends SvgChart {

    private nodes: LinkedNodeset;
    private legend: Legend;

    constructor() {
        super();
    }

    public draw(data: [{}]) {
        this.container.updateComponents(data);
    }


    public initialize(): void {
        super.initialize();
        let legend = this.config.get('legend');

        this.nodes = new LinkedNodeset();
        this.container.add(this.nodes);
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }
    }
}

export default SvgStrategyNetwork;