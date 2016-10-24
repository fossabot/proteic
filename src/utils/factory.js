/*jshint -W117 */ // TODO investigate not defined errors
import Linechart from '../charts/linechart.js';
import Barchart from '../charts/barchart.js';
import Gauge from '../charts/gauge.js';
import Streamgraph from '../charts/streamgraph.js';
import StackedArea from '../charts/stackedArea.js';
import Sunburst from '../charts/sunburst.js';

(() => {
  window.ProteusFactory = {
    create(params) {
      switch (params.type) {
        case 'Linechart':
          return new Linechart(params.data, params.config);
        case 'Barchart':
          return new Barchart(params.data, params.config);
        case 'Gauge':
          return new Gauge(params.data, params.config);
        case 'Streamgraph':
          return new Streamgraph(params.data, params.config);
        case 'Sunburst':
          return new Sunburst(params.data, params.config);
        case 'StackedArea':
          return new StackedArea(params.data, params.config);
        default:
          throw TypeError('Unknow chart type' + params.type);
      }
    }
  };
})();