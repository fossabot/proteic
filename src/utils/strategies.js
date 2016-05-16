const strategies = {
  Barchart(chartContext) {
    return new SvgBarchartStrategy(chartContext);
  },
  Linechart(chartContext) {
    return new SvgLinechartStrategy(chartContext);
  },
  Streamgraph(chartContext) {
    return new SvgStreamgraphStrategy(chartContext);
  },
  MultiSeriesLinechart(chartContext) {
    return new SvgMultiSeriesLinechartStrategy(chartContext);
  },
  Gauge(chartContext) {
    return new SvgGaugeStrategy(chartContext);
  }
};
