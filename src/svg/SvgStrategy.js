import {SvgLinechartStrategy} from './strategy_linechart';
import {SvgBarchartStrategy} from './strategy_barchart';
import {SvgStreamgraphStrategy} from './strategy_streamgraph';
import {SvgStackedAreaStrategy} from './strategy_stackedArea';
import {SvgSwimlaneStrategy} from './strategy_swimlane';
import {SvgGaugeStrategy} from './strategy_gauge';
import {SvgNetworkgraphStrategy} from './strategy_networkgraph';
import {SvgSunburstStrategy} from './strategy_sunburst';

/**
 * SvgStrategy wrapper class
 */
export class SvgStrategy {
    constructor(strategy) {
        this.strategy = strategy;
    }
    draw(data) {
        this.strategy.draw(data);
    }
    on(events){
        this.strategy.on(events);
    }
}

export const strategies = {
  Barchart(chartContext) {
    return new SvgBarchartStrategy(chartContext);
  },
  Linechart(chartContext) {
    return new SvgLinechartStrategy(chartContext);
  },
  Streamgraph(chartContext) {
    return new SvgStreamgraphStrategy(chartContext);
  },
  Gauge(chartContext) {
    return new SvgGaugeStrategy(chartContext);
  },
  Sunburst(chartContext) {
    return new SvgSunburstStrategy(chartContext);
  },
  Swimlane(chartContext) {
    return new SvgSwimlaneStrategy(chartContext);
  },
  StackedArea(chartContext) {
    return new SvgStackedAreaStrategy(chartContext);
  },
  Networkgraph(chartContext) {
    return new SvgNetworkgraphStrategy(chartContext);
  }
};