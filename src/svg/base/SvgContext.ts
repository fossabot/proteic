import Config from '../../Config';
import SvgStrategy from '../base/SvgStrategy';
import inject from '../../inject';

export class SvgContext {

    @inject('Strategy')
    public strategy: SvgStrategy;

    public draw(data: [{}], events: Map<string, any>): void {
        this.strategy.draw(data, events);
    }

    public clear(){
        this.strategy.clear();
    }

    public addLoading() {
        this.strategy.addLoading();
    }
    public removeLoading() {
        this.strategy.removeLoading();
    }


}