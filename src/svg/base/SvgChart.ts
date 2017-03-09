import Container from "../components/Container";
import Config from "../../Config";

abstract class SvgChart {

    protected container: Container;
    protected config: Config;

    constructor() {

    }

    public initialize() {
        this.container = new Container(this.config);
    }

    public setConfig(config: Config) {
        this.config = config;
    }

    abstract draw(data: [{}]): void;


    public addLoading() {
        this.container.addLoadingIcon();
    }

    public removeLoading() {
        this.container.removeLoadingIcon();
    }

    public remove() {
        console.log('removing strategy');
        this.container.svg.node().parentNode.remove();
    }
}

export default SvgChart;