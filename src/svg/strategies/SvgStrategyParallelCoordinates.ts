import SvgStrategy from '../base/SvgStrategy';
import Config from '../../Config';
import ParallelCoordinates from '../components/ParallelCoordinates';
import ParallelLineset from '../components/ParallelLineset';
import Spinner from '../components/Spinner';
import PauseSet from '../components/PauseSet';

class SvgStrategyParallelCoordinates extends SvgStrategy {

    /**
     *
     * Parallel Coordinates. Consist of Dimension and Parallel Axes.
     *
     * @private
     * @type {ParallelCoordinates}
     */
    private axes: ParallelCoordinates;

    /**
     *
     * Set of Parallel Line. Lines for Parallel Coordinates.
     *
     * @private
     * @type {ParallelLineset}
     */
    private lines: ParallelLineset;

    private spinner: Spinner;
    private pauseButton: PauseSet;

    constructor() {
        super();
        this.axes = new ParallelCoordinates();
        this.lines = new ParallelLineset(this.axes);
    }

    public draw(data: [{}]) {
        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();

        this.container
            .add(this.axes)
            .add(this.lines);
    }

}

export default SvgStrategyParallelCoordinates;
