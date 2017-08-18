
import Config from '../../Config';
import SvgStrategy from '../base/SvgStrategy';
import { sortByField } from '../../utils/data/sorting';
import { convertByXYFormat } from '../../utils/data/transforming';
import Dial from '../components/Dial';
import DialNeedle from '../components/DialNeedle';
import TextIndicator from '../components/TextIndicator';
import PauseSet from '../components/PauseSet';

class SvgStrategyGauge extends SvgStrategy {

    private dial: Dial;
    private dialNeedle: DialNeedle;
    private textIndicator: TextIndicator;
    private pauseButton: PauseSet;

    constructor() {
        super();
        this.dial = new Dial();
        this.dialNeedle = new DialNeedle();
        this.textIndicator = new TextIndicator();
    }

    public draw(data: [{}]) {
        this.container.updateComponents(data);
    }


    public initialize(): void {
        super.initialize();

        this.container.add(this.dial).add(this.dialNeedle);
        if (this.config.get('numericIndicator')) {
            let width = this.config.get('width'),
                height = this.config.get('height');
            let r = (
                    (width > height) ? height : width
                ) / 2;
            let indicatorOffset = r + 75;
            this.container.add(this.textIndicator);
            this.textIndicator.translate(r, indicatorOffset);

            let pauseButton: boolean = this.config.get('pauseButton'),
                buttonXposition: number = r - 100,
                buttonYposition: number = r + 55;

            if (pauseButton) {
                this.pauseButton = new PauseSet();
                this.container.add(this.pauseButton);
                this.pauseButton.translate(buttonXposition, buttonYposition);
            }
        }

    }
}

export default SvgStrategyGauge;
