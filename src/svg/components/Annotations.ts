import { max, min } from 'd3-array';
import * as d3Annotation from 'd3-svg-annotation';
import Annotation from 'd3-svg-annotation';
import Globals from '../../Globals';
import { copy, filterKeys, hasValuesWithKeys, isValuesInObjectKeys } from '../../utils/functions';
import Component from './Component';
import XAxis from './XAxis';
import YAxis from './YAxis';

class Annotations extends Component {
    private y: YAxis;
    private x: XAxis;
    private thresholdConfig: any;
    private annotations: any;

    constructor(x: XAxis, y: YAxis, annotations: any) {
        super();
        this.x = x;
        this.y = y;
        this.annotations = annotations;
    }

    public render() {
        let annotations = this.svg.append('g')
            .attr('class', 'annotations')
            .attr('clip-path', 'url(#' + this.config.get('proteicID') + ')');
    }

    public update(data: [any], events: Map<string, any>) {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let propertyZ = this.config.get('propertyZ');
        let y = this.y.yAxis.scale();
        let x = this.x.xAxis.scale();
        let minX = min(data, (d) => d[propertyX]);
        let minY = min(data, (d) => d[propertyY]);
        let maxX = max(data, (d) => d[propertyX]);
        let maxY = max(data, (d) => d[propertyY]);
        let datum = null;

        if (!this.annotations) {
            return;
        }

        let annotation: any = d3Annotation.annotation()
            .annotations(this.annotations.map((a: any) => {
                switch (a.type) {
                    case 'threshold':
                        if (a.variable) {
                            a.value = events.get(a.variable);
                        }
                        if (a.value) {
                            return this.makeThresholdAnnotation(a);
                        }
                        break;
                    case 'band':
                        a.value = events.get(a.variable);
                        if (a.value && a.width) {
                            let width = a.width;
                            if (typeof a.width === 'string') {
                                width = events.get(a.width);
                            }
                            if (width !== 0) {
                                return this.makeBandAnnotation(a.value, width, a.text, minY);
                            }
                        }
                        break;
                    default:
                        throw new Error(`Unknown annotation type: ${a.type}`);
                }
                return annotation;
            }).filter((a: any) => a)); // Filter nulls

        this.svg.select('.annotations')
            .call(annotation)
            .on('dblclick', () => annotation.editMode(!annotation.editMode()).update());
    }

    private makeBandAnnotation(value: number, width: number, text: string, minY: number) {
        let chartWidth: number = this.config.get('width');
        let chartHeight: number = this.config.get('height');
        let annotation = null;
        let y = this.y.yAxis.scale();
        let annotationHeight = y((value - width)) - y((value + width));
        let annotationY = y(value) - annotationHeight / 2;

        annotation = this.makeAreaAnnotation(
            annotationY,
            chartWidth,
            annotationHeight,
            text
        );

        return annotation;
    }

    private makeThresholdAnnotation(annotationData: any) {
        let propertyX = this.config.get('propertyX');
        let propertyY = this.config.get('propertyY');
        let width: number = this.config.get('width');
        let height: number = this.config.get('height');
        let annotation = null;
        let y = this.y.yAxis.scale();
        let x = this.x.xAxis.scale();

        switch (annotationData.axis) {
            case 'y':
                annotation = this.makeYThresholdAnnotation(width, y(annotationData.value), annotationData.text);
                break;
            case 'x':
                annotation = this.makeXThresholdAnnotation(x(annotationData.value), height, annotationData.text);
                break;
            default:
                throw new SyntaxError(`Unknown annotation axis: ${annotationData.axis}`);
        }

        return annotation;
    }

    private makeAreaAnnotation(y: number, width: number, height: number, text: string) {
        return {
            x: 0, // Rect X
            y, // Rect Y
            type: d3Annotation.annotationCalloutRect,
            dy: 80, // Label Y
            dx: width + 20, // Label X
            subject: {
                width, // Width of the rect
                height // Height of the rect
            },
            note: {
                label: text,
            }
        };
    }

    private makeXThresholdAnnotation(x: number, y: number, text: string) {
        return {
            x,
            y,
            type: d3Annotation.annotationXYThreshold,
            dy: 30,
            dx: 0,
            subject: {
                y1: 0,
                y2: y
            },
            note: {
                label: text,
            }
        };
    }

    private makeYThresholdAnnotation(x: number, y: number, text: string) {
        return {
            x,
            y,
            type: d3Annotation.annotationXYThreshold,
            // dy: 120,
            dx: 20,
            subject: {
                x1: 0,
                x2: x
            },
            note: {
                label: text,
            }
        };
    }

    public clear() {
        this.svg.selectAll('.annotation').remove();
    }

    public transition() { }
}

export default Annotations;
