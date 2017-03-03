import { Injectable } from './../../Injectable';
import Config from '../../Config';
import SvgStrategy from '../base/SvgStrategy';
import inject from '../../inject';

export class SvgContext implements Injectable {

    @inject('Strategy')
    public strategy: SvgStrategy;

    public draw(data: [{}]): void {
        this.strategy.draw(data);
    }

    public addLoading() {
        this.strategy.addLoading();
    }
    public removeLoading() {
        this.strategy.removeLoading();
    }

    public initialize() {
        console.log('Injecting', this.constructor.name);
    }
}