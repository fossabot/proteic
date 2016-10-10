import {SvgLinechartStrategy} from './strategy_linechart';
import {SvgBarchartStrategy} from './strategy_barchart';
import {SvgStreamgraphStrategy} from './strategy_streamgraph';
import {SvgStackedAreaStrategy} from './strategy_stackedArea';
import {SvgSwimlaneStrategy} from './strategy_swimlane';
import {SvgGaugeStrategy} from './strategy_gauge';
<<<<<<< HEAD
import {SvgNetworkgraphStrategy} from './strategy_networkgraph';
=======
import {SvgSunburstStrategy} from './strategy_sunburst';
>>>>>>> f9e2266e2f8a92dd8d3e70dfd3fda4e84c735911

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
<<<<<<< HEAD
  Networkgraph(chartContext) {
    return new SvgNetworkgraphStrategy(chartContext);
=======
  Sunburst(chartContext) {
    return new SvgSunburstStrategy(chartContext);
>>>>>>> f9e2266e2f8a92dd8d3e70dfd3fda4e84c735911
  }
};