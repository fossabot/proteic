import { Observable } from 'rxjs';
import Injector from './Injector';
import StorageService from './services/StorageService';
import Chart from './charts/Chart'
import * as charts from './charts/'
import * as colors from './utils/colors'
import * as defaults from './utils/defaults/'

//Events
let visibilityChangeSource = Observable.fromEvent(window, 'visibilitychange');
let resizeSource = Observable.fromEvent(window, 'resize');

//Services
let localStorageService = new StorageService('local');
let sessionStorageService = new StorageService('session');


//Add the hidden document attribute to the visibilitychange custom event
visibilityChangeSource.subscribe((event: any) => {
    event.hidden = document.hidden;
});

Injector.register('onVisibilityChange', visibilityChangeSource);
Injector.register('onResize', resizeSource);

Injector.register('localStorageService', localStorageService);
Injector.register('sessionStorageService', sessionStorageService);

// /** 
//  * Get the list of visualizations available in Proteic.js
//  */
export function getAvailableVisualizations(): String[] {
    let visualizations = new Set<String>();

    for (let property in charts) {
        if (typeof property == 'string' && property !== Chart.name) {
            visualizations.add(property);
        }
    }

    return Array.from(visualizations);
}

export function getDefaultOptions(visualization: string) {
    let options = null;

    switch (visualization) {
        case "Linechart":
            options = defaults.LinechartDefaults;
        break;
        case "Barchart":
            options = defaults.BarchartDefaults;
        break;
        case "Gauge":
            options = defaults.GaugeDefaults;
        break;
        case "Heatmap":
            options = defaults.HeatmapDefaults;
        break;
        case "Scatterplot":
            options = defaults.ScatterplotDefaults;
        break;
        case "Streamgraph":
            options = defaults.StreamgraphDefaults;
        break;
        case "StackedArea":
            options = defaults.StackedAreaDefaults;
        break;
        case "Swimlane":
            options = defaults.SwimlaneDefaults;
        break;
        case "Sunburst":
            options = defaults.SunburstDefaults;
        break;
        case "Network":
            options = defaults.NetworkDefaults;
        break;
        case "PieChart":
            options = defaults.PieChartDefaults;
        break;
        default:
            throw new Error('Unrecognised visualization.');
    }
    return options;
}

export function getColorScales() {
    let colorScales = new Set<String>();

    for (let property in colors) {
        if (typeof property == 'string') {
            colorScales.add(property);
        }
    }

    return Array.from(colorScales);
}