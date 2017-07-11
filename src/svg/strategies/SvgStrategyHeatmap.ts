import { Data } from './../../data/Data';
import { sortByField } from '../../utils/data/sorting';
import SvgStrategy from '../base/SvgStrategy';
import ColorLegend from '../components/ColorLegend';
import TileSet from '../components/TileSet';
import XYAxes from '../components/XYAxes';

class SvgStrategyHeatmap extends SvgStrategy {

    private axes: XYAxes;
    private tiles: TileSet;
    private legend: ColorLegend;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.tiles = new TileSet(this.axes.x, this.axes.y);
    }

    public draw(data: Data): void {
        let xAxisFormat = this.config.get('xAxisFormat');
        let xAxisType = this.config.get('xAxisType');
        let yAxisFormat = this.config.get('yAxisFormat');
        let yAxisType = this.config.get('yAxisType');
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');

        this.container.updateComponents(data);
    }

    public initialize(): void {
        let legend = this.config.get('legend');

        super.initialize();
        this.container.add(this.axes).add(this.tiles);

        if (legend) {
            this.legend = new ColorLegend();
            this.container.add(this.legend);
        }
    }

}

export default SvgStrategyHeatmap;
