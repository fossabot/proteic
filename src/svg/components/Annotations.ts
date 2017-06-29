import Component from "./Component";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import { max, min } from "d3-array";
import Globals from "../../Globals";
import * as d3Annotation from 'd3-svg-annotation';
import Annotation from 'd3-svg-annotation';
import { copy, isValuesInObjectKeys, hasValuesWithKeys, filterKeys } from "../../utils/functions";

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

    render() {
        let annotations = this.svg.append('g')
            .attr('class', 'annotations')
            .attr('clip-path', 'url(#' + this.config.get('proteicID') + ')');
    }

    public update(data: [any], events: Map<string, any>) {
        let propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            propertyZ = this.config.get('propertyZ'),
            y = this.y.yAxis.scale(),
            x = this.x.xAxis.scale(),
            minX = min(data, (d) => d[propertyX]),
            minY = min(data, (d) => d[propertyY]),
            maxX = max(data, (d) => d[propertyX]),
            maxY = max(data, (d) => d[propertyY]),
            datum = null;

        if (!this.annotations) {
            return;
        }

        let annotation: any = d3Annotation.annotation()
            .annotations(this.annotations.map((a: any) => {
                let annotation = null;
                switch (a.type) {
                    case 'threshold':
                        if (a.variable) {
                            a.value = events.get(a.variable);
                        }
                        if (a.value) {
                            annotation = this.makeThresholdAnnotation(a);
                        }
                        break;
                    case 'band':
                        a.value = events.get(a.variable);
                        if (a.value && a.width) {
                            let width = a.width;
                            if (typeof a.width == 'string') {
                                width = events.get(a.width);
                            }
                            if (width !== 0) {
                                annotation = this.makeBandAnnotation(a.value, width, a.text, minY);
                            }
                        }
                        break;
                    default:
                        console.warn('Unknown annotation type', a.type);
                }
                return annotation;
            }).filter((a: any) => a)); // Filter nulls

        this.svg.select('.annotations')
            .call(annotation)
            .on('dblclick', () => annotation.editMode(!annotation.editMode()).update());
    }

    private makeBandAnnotation(value: number, width: number, text: string, minY: number) {
        let chartWidth: number = this.config.get('width'),
            chartHeight: number = this.config.get('height'),
            annotation = null,
            y = this.y.yAxis.scale(),
            annotationHeight = y((value - width)) - y((value + width)),
            annotationY = y(value) - annotationHeight / 2;

        annotation = this.makeAreaAnnotation(
            annotationY,
            chartWidth,
            annotationHeight,
            text
        );

        return annotation;
    }

    private makeThresholdAnnotation(annotationData: any) {
        let propertyX = this.config.get('propertyX'),
            propertyY = this.config.get('propertyY'),
            width: number = this.config.get('width'),
            height: number = this.config.get('height'),
            annotation = null,
            y = this.y.yAxis.scale(),
            x = this.x.xAxis.scale();

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
            y: y, // Rect Y
            type: d3Annotation.annotationCalloutRect,
            dy: 80, // Label Y
            dx: width + 20, // Label X
            subject: {
                width: width, // Width of the rect
                height: height // Height of the rect
            },
            note: {
                label: text,
            }
        }
    }

    private makeXThresholdAnnotation(x: number, y: number, text: string) {
        return {
            x: x,
            y: y,
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
            x: x,
            y: y,
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

    public transition() {
     ///   console.log('no transition for annotations');
    }
}

export default Annotations;