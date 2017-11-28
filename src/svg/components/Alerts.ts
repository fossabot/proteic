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
    * The number of current data elements
    * Now, alerts is only used to Linechart, and its data is concated.
    * Get the latest data by slicing the number of current data from incoming data
    * @private
    * @memberof Alerts
    */
    private numberOfCurrentData: number;

    /**
    * The latest data sliced from concated incoming data
    * Alerts happens for latest data over than confidence-interval
    * Important: It assigns unique id for data-exit
    * @private
    * @type {LatestData}
    * @memberof Alerts
    */
    private latestData: LatestData;

    /**
    * The set of alertSerie (data for alerts)
    * It even contains data that should be exited -> @see exitDataId
    * @private
    * @type {AlertsDataSet[]}
    * @memberof Alerts
    */
    private alertSeries: AlertsDataSet[];

    /**
    * If data has more number of elements than max number of its,
    * It has important role to find out-dated data
    * @private
    * @memberof Alerts
    */
    private exitDataId: number;

    /**
    * An array of the data which makes alert (the value is over than confidence-interval)
    * @private
    * @memberof Alerts
    */
    private alertsData: any[];

    private enterNewDataTick: number;

    constructor(x: XAxis, y: YAxis) {
        super();
        this.x = x;
        this.y = y;
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
        let enterNewDataTick = this.config.get('enterNewDataTick'),
            detectNewData = false;

        let maxNumberOfElements: number = this.config.get('maxNumberOfElements'),
            numberOfElements: number = data.length;

        this.latestData.data = data;

        if (numberOfElements > this.numberOfCurrentData) {
            this.latestData.id++;
            this.latestData.data = data.slice(this.numberOfCurrentData);
            if (numberOfElements < maxNumberOfElements) {
                this.numberOfCurrentData = numberOfElements;
            // The number of elements is more than max-number of its and new data arrives (need to exit old data)
            } else if (enterNewDataTick > this.enterNewDataTick) {
                this.enterNewDataTick = enterNewDataTick;
                this.exitDataId++;
                detectNewData = true;
            }
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

        let alertSerie = this.latestData.data
            .filter((d) => {
                return d[propertyKey] === alertVariable &&
                    alertFunction(d[propertyY], events);
            });

        if (alertSerie.length > 0) {
            this.alertsData = this.alertsData.concat(alertSerie);
            this.alertSeries.push(new AlertsDataSet(this.latestData.id, alertSerie));
        }

        if (this.exitDataId > 0 && detectNewData == true) {
            let exitAlertSerie = this.alertSeries.find((alert) => alert.dataId == this.exitDataId);
            if (exitAlertSerie) {
                let numberOfExitElements = exitAlertSerie.alertData.length;
                this.alertsData = this.alertsData.slice(numberOfExitElements);
            }
        }

        // JOIN new and old data
        let alerts = this.alertsContainer.selectAll(`.alert`)
        .data(this.alertsData);

        // ENTER
        this.elementEnter = alerts.enter()
        .append('circle')
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
        // this.svg.selectAll('.alert').remove();
        this.initialize();
        this.update([]);
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

    private initialize() {
        this.numberOfCurrentData = 0;
        this.latestData = new LatestData();
        this.alertSeries = new Array<AlertsDataSet>();
        this.exitDataId = -1;
        this.alertsData = [];
        this.enterNewDataTick = 0;
    }
}

class LatestData {
    public id: number = 0;
    public data: any[];
}

class AlertsDataSet {

    constructor(
        public dataId: number,
        public alertData: any[],
    ) { }
}

class EventKeys {
    variable: string[] = new Array<string>();
    confidence: string[] = new Array<string>();
}

export default Alerts;
