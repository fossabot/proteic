import SvgStrategy from '../base/SvgStrategy';
import RadialAxes from '../components/RadialAxes';
import SunburstDisk from '../components/SunburstDisk';
import TextIndicator from '../components/TextIndicator';
import PauseSet from '../components/PauseSet';

class SvgStrategySunburst extends SvgStrategy {

    private axes: RadialAxes;
    private disk: SunburstDisk;
    private textIndicator: TextIndicator;
    private pauseButton: PauseSet;

    constructor() {
        super();
        this.axes = new RadialAxes();
        this.disk = new SunburstDisk(
            this.axes.x, this.axes.y
        );
        this.textIndicator = new TextIndicator();
    }

    public draw(data: [{}]) {
        this.container.translate(
            this.config.get('width') / 2,
            this.config.get('height') / 2
        );
        this.container.updateComponents(data);
    }

    public initialize(): void {
        super.initialize();
        let pauseButton = this.config.get('pauseButton');

        this.container
            .add(this.axes)
            .add(this.disk)
            .add(this.textIndicator);

        if (pauseButton) {
            this.pauseButton = new PauseSet();
            this.container.add(this.pauseButton);
            this.pauseButton.translate(-10 , this.config.get('height') / 2);
        }
    }

}

export default SvgStrategySunburst;
