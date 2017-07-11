import { Data } from './../../data/Data';
import SvgStrategy from '../base/SvgStrategy';
import Legend from '../components/Legend';
import SectorSet from '../components/SectorSet';

class SvgStrategyPieChart extends SvgStrategy {

    private sectors: SectorSet;
    private legend: Legend;

    constructor() {
        super();
        this.sectors = new SectorSet();
    }

    public draw(data: Data) {
        this.container.translate(
            this.config.get('width') / 2,
            this.config.get('height') / 2
        );
        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        this.container
            .add(this.sectors);

        let legend = this.config.get('legend');
        if (legend) {
            this.legend = new Legend();
            this.container.add(this.legend);
        }

    }

}

export default SvgStrategyPieChart;
