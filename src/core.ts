import { Observable } from 'rxjs';
import Injector from './Injector';
import StorageService from './services/StorageService';
import Chart from './charts/Chart'
import * as charts from './charts/'
import * as colors from './utils/colors'

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
    
    
    // return  ;
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