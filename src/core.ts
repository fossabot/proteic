import { Observable } from 'rxjs';
import Chart from './charts/Chart';
import GlobalInjector from './GlobalInjector';
import StorageService from './services/StorageService';

let visibilityChangeSource = Observable.fromEvent(window, 'visibilitychange');
let resizeSource = Observable.fromEvent(window, 'resize');

let localStorageService = new StorageService('local');
let sessionStorageService = new StorageService('session');

// Add the hidden document attribute to the visibilitychange custom event
visibilityChangeSource.subscribe((event: any) => {
    event.hidden = document.hidden;
});

GlobalInjector.register('onVisibilityChange', visibilityChangeSource);
GlobalInjector.register('onResize', resizeSource);
GlobalInjector.register('localStorageService', localStorageService);
GlobalInjector.register('sessionStorageService', sessionStorageService);
