import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Globals from '../../Globals';
import {
    easeLinear,
    map,
    nest
} from 'd3';

class Alerts extends Component {
    private x: XAxis;
    private y: YAxis;
    private alertsContainer: any;

    /**
    * The last index of current data
    * Now, alerts is only used to Linechart, and its data is concated.
    * If data is concated, get the latest data by slicing incoming data from this index
    * @private
    * @memberof Alerts
    */
    private currentDataIndex: number;

    /**
    * An array of the data which makes alert (the value is over than confidence-interval)
    * @private
    * @memberof Alerts
    */
    private alertsData: any[];

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
    }

    private initialize() {
        this.currentDataIndex = 0;
        this.alertsData = [];
    }

    public render() {
        this.alertsContainer = this.svg.append('g')
            .attr('class', 'alerts');

        this.initialize();
    }

    /**
    * Alerts only takes confidence-band into account
    */
    public update(data: any[]) {
        let latestData = data;
        if (data.length > this.currentDataIndex) {
            latestData = data.slice(this.currentDataIndex);
            this.currentDataIndex = data.length;
        } else {
            return;
        }

        let propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            propertyKey = this.config.get('propertyKey'),
            y = this.y.yAxis.scale(),
            x = this.x.xAxis.scale(),
            alertVariable: string = this.config.get('alertVariable'),
            alertFunction = this.config.get('alertFunction'),
            alertCallback = this.config.get('alertCallback'),
            alertEvents = this.config.get('alertEvents');

        let events = this.makeEvents(data);

        if (!alertVariable || !events) {
            return;
        }

        let alertSerie = latestData
            .filter((d) => {
                return d[propertyKey] === alertVariable &&
                    alertFunction(d[propertyY], events);
            });

        if (alertSerie.length > 0) {
            let filterAlerts: any[] = [];
            alertSerie.map((alert) => {
                let duplicatedAlert = this.alertsData.find((datum) => alert[propertyX] <= datum[propertyX]);
                if (!duplicatedAlert) {
                    filterAlerts.push(alert);
                }
            });

            this.alertsData = this.alertsData.concat(filterAlerts);
        }

        // JOIN new and old data
        let alerts = this.alertsContainer.selectAll(`.alert`)
        .data(this.alertsData);

        // ENTER
        this.elementEnter = alerts.enter().append('circle')
        .attr('class', 'alert')
        .attr('datax', (d: any) => d[propertyX])
        .attr('datay', (d: any) => d[propertyY])
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
            .data(this.alertsData);

        if (alertEvents) {
            for (let e of Object.keys(alertEvents)) {
                alerts.on(e, alertEvents[e]);
            }
        }
    }

    private makeEvents(data: any[]): Map<string, any> {
        let statisticsConfig = this.config.get('statistics');
        let events: Map<string, any> = new Map(),
            eventKeys: EventKeys = new EventKeys();
        let propertyKey = this.config.get('propertyKey'),
            propertyY = this.config.get('propertyY');

        if (statisticsConfig) {
            statisticsConfig.forEach((s: any) => {
                if (s.variable) {
                    eventKeys.variable.push(s.variable);
                }
                if (s.confidence) {
                    eventKeys.confidence.push(s.confidence);
                }
            });

            let nestedData = nest().key((d: any) => d[propertyKey]).entries(data);
            // optimize by using key-nested data to loop only number of key times
            nestedData.map((d) => {
                let latestData = d.values[d.values.length - 1];

                eventKeys.variable.map((v) => {
                    if (v == latestData[propertyKey]) {
                        events.set(v, latestData[propertyY]);
                    }
                });
                eventKeys.confidence.map((c) => {
                    if (latestData[c]) {
                        events.set(c, latestData[c]);
                    }
                });
            });
        }
        return events;
    }

    public clear() {
        this.svg.selectAll('.alert').remove();

        this.initialize();
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

class EventKeys {
    variable: string[] = new Array<string>();
    confidence: string[] = new Array<string>();
}


export default Alerts;
