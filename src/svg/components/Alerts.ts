import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Globals from '../../Globals';
import { easeLinear } from 'd3';

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

    public update(data: any[]) {
        let propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            propertyKey = this.config.get('propertyKey'),
            y = this.y.yAxis.scale(),
            x = this.x.xAxis.scale(),
            alertVariable: string = this.config.get('alertVariable'),
            alertFunction = this.config.get('alertFunction'),
            alertCallback = this.config.get('alertCallback'),
            alertEvents = this.config.get('alertEvents');

        let events = this.config.get('events');

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

        // ENTER
        this.elementEnter = alerts.enter().append('circle')
        .attr('class', 'alert')
        .attr('cx', (d: any) => x(d[propertyX]))
        .attr('cy', (d: any) => y(d[propertyY]))
        .attr('r', 5)
        .call((s: any) => {
            if (alertCallback) {
                return s.each((d: any) => {
                    alertCallback(d);
                });
            }
        });

        // EXIT
        this.elementExit = alerts.exit().remove();

        // Update old data
        this.elementUpdate = this.svg.selectAll('.alert')
            .data(alertSerie);

        if (alertEvents) {
            for (let e of Object.keys(alertEvents)) {
                alerts.on(e, alertEvents[e]);
            }
        }
    }

    public clear() {
        this.svg.selectAll('.alert').remove();
    }

    public transition() {
        if (this.elementUpdate && this.elementEnter && this.elementExit) {
            let propertyX = this.config.get('propertyX'),
                propertyY = this.config.get('propertyY'),
                y = this.y.yAxis.scale(),
                x = this.x.xAxis.scale();

            this.elementUpdate
                .attr('cx', (d: any) => x(d[propertyX]))
                .attr('cy', (d: any) => y(d[propertyY]))
                .transition()
                .duration(Globals.COMPONENT_TRANSITION_TIME);

            this.elementEnter
                .transition()
                .duration(Globals.COMPONENT_TRANSITION_TIME);

            this.elementExit
                .transition()
                .duration(Globals.COMPONENT_TRANSITION_TIME);
        }
    }
}

export default Alerts;
