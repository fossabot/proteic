import SvgChart from "../base/SvgChart";
import XYAxes from "../components/XYAxes";
import TileSet from "../components/TileSet";
import {sortByField} from "../../utils/data/sorting";

class SvgStrategyHeatmap extends SvgChart {

    private axes: XYAxes;
    private tiles: TileSet;

    constructor() {
        super();
        this.axes = new XYAxes();
        this.tiles = new TileSet(this.axes.x, this.axes.y);
    }

    draw(data: [{}]): void {
        let xAxisFormat = this.config.get('xAxisFormat'),
            xAxisType = this.config.get('xAxisType'),
            yAxisFormat = this.config.get('yAxisFormat'),
            yAxisType = this.config.get('yAxisType'),
            propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY');

        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        // TODO legend
        this.container.add(this.axes).add(this.tiles);
        // this.container.add(this.axes);
    }

}

export default SvgStrategyHeatmap;