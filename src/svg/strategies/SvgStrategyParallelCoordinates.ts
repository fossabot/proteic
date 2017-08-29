import SvgStrategy from '../base/SvgStrategy';
import Config from '../../Config';
import ParallelCoordinates from '../components/ParallelCoordinates';
import Spinner from '../components/Spinner';
import PauseSet from '../components/PauseSet';

class SvgStrategyParallelCoordinates extends SvgStrategy {

    private axes: ParallelCoordinates;
    private spinner: Spinner;
    private pauseButton: PauseSet;

    constructor() {
        super();
        this.axes = new ParallelCoordinates();
    }

    public draw(data: [{}]) {}

    public initialize(): void {
        super.initialize();

        this.container.add(this.axes);
    }

}

export default SvgStrategyParallelCoordinates;
