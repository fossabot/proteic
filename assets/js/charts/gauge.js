            var data = [{x: 50}];
            //Default config uses #chart selector
            gauge = new Gauge(data, {selector: '#gaugegraph', min: 0, max: 100, numericIndicator: false});
            gauge.draw();