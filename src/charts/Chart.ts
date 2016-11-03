import {SvgContext, SvgStrategy} from '../svg/strategies/SvgStrategy';
abstract class Chart {

    private svg: SvgContext;

    constructor(strategy: SvgStrategy) {
        this.svg = new SvgContext(strategy);
    }
    
    public draw (){
        this.svg.draw();
    }

}

export default Chart;