import { easeLinear } from 'd3';
import Globals from '../../Globals';
import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';

class Alerts extends Component {
    private x: XAxis;
    private y: YAxis;
    private alertsContainer: any;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    public render() {
        this.alertsContainer = this.svg.append('g')
            .attr('class', 'alerts');
    }

    public update(data: Array<any>, events: Map<string, any>) {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let propertyKey = this.config.get('propertyKey');
        let y = this.y.yAxis.scale();
        let x = this.x.xAxis.scale();
        let alertVariable: string = this.config.get('alertVariable');
        let alertFunction = this.config.get('alertFunction');
        let alertCallback = this.config.get('alertCallback');
        let alertEvents = this.config.get('alertEvents');

        // TODO: safely remove this
        if (!alertVariable) {
            return;
        }

        let alertSerie = data
            .filter((d) => {
                return d[propertyKey] === alertVariable &&
                    alertFunction(d[propertyY], events);
            });

        // JOIN new and old data
        let alerts = this.alertsContainer.selectAll(`.alert`)
            .data(alertSerie);

        // EXIT
        alerts.exit().remove();

        // Update old data
        alerts
            .attr('cx', (d: any) => x(d[propertyX]))
            .attr('cy', (d: any) => y(d[propertyY]));

        // ENTER
        alerts = alerts.enter().append('circle')
            .attr('class', 'alert')
            .attr('cx', (d: any) => x(d[propertyX]))
            .attr('cy', (d: any) => y(d[propertyY]))
            // .attr('r', 20)
            // .transition(Globals.COMPONENT_ANIMATION_TIME)
            .attr('r', 5)
            .call((s: any) => {
                if (alertCallback) {
                    return s.each((d: any) => {
                        alertCallback(d);
                    });
                }
            });

        if (alertEvents) {
            for (let e of Object.keys(alertEvents)) {
                alerts.on(e, alertEvents[e]);
            }
        }
    }

    public clear() {
        this.svg.selectAll('.alert').remove();
    }

    public transition() { }
}

export default Alerts;
