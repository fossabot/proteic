import { Data } from './../../data/Data';
import Config from '../../Config';
import inject from '../../inject';
import SvgStrategy from '../base/SvgStrategy';

export class SvgContext {

    @inject('Strategy')
    public strategy: SvgStrategy;
    
    public draw(data: Data, events: Map<string, any>): void {
        this.strategy.draw(data, events);
    }

    public clear() {
        this.strategy.clear();
    }

}
