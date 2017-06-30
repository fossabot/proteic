import { nest, timeParse } from 'd3';
import { arrayDiff } from '../functions';

export function simple2stacked(
    data: Array<any>,
    xProperty: string,
    yProperty: string,
    keyProperty: string
): any {
    return nest().key((d: any) => d[xProperty]).rollup((values: any): any => {
        let r: any = {};
        for (let i = 0; i < values.length; i++) {
            let object = values[i];
            if (object) {
                r[object[keyProperty]] = object[yProperty];
            }
        }
        return r;
    }).entries(data);
}

export function simple2nested(data: any, key = 'key'): any {
    return nest().key((d: any) => d[key]).entries(data);
}

export function nested2simple(data: any) {
    let array = Array();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].values.length; j++) {
            let key = data[i].key;
            let x = data[i].values[j].x;
            let y = data[i].values[j].y;
            array.push({ key: key, x: x, y: y });
        }
    }
    return array;
}

export function simple2Linked(data: any) {
    let linkedData = { links: Array(), nodes: Array() };
    data.map((d: any) => d.class === 'link' ? linkedData.links.push(d) : linkedData.nodes.push(d));
    return linkedData;
}

export function convertPropretiesToTimeFormat(data: any, properties: Array<any>, format: string) {
    data.forEach((d: any) => {
        properties.map((p) => {
            d[p] = timeParse(format)(d[p]);
        });
    });
}

export function convertByXYFormat(
    data: any,
    xAxisFormat: string,
    xAxisType: string,
    yAxisFormat: string,
    yAxisType: string,
    propertyX: string,
    propertyY: string
) {
    data.forEach((d: any) => {
        switch (xAxisType) {
            case 'time':
                d[propertyX] = timeParse(xAxisFormat)(d[propertyX]);
                break;
            case 'linear':
                d[propertyX] = +d[propertyX];
                break;
        }
        switch (yAxisType) {
            case 'time':
                d[propertyY] = timeParse(yAxisFormat)(d[propertyY]);
                break;
            case 'linear':
                d[propertyY] = +d[propertyY];
                break;
        }
    });
    return data;
}

export function unwind(data: Array<any>, valueNames: string[]): Array<any> {
    if (
        !valueNames ||
        !valueNames.length ||
        !data ||
        !data.length ||
        data.constructor !== Array
        || valueNames.constructor !== Array
    ) {
        return data;
    }

    let unwinded = new Array();

    for (let i = 0; i < data.length; i++) {
        let result = unwindObject(data[i], valueNames);
        if (result && result.length) {
            unwinded = unwinded.concat(result);
        } else {
            unwinded = unwinded.concat(data[i]);
        }

    }
    return unwinded;
}

export function unwindObject(object: any, valueNames: string[]): Array<any> {
    let unwinded = new Array();

    let registerKeys = Object.getOwnPropertyNames(object);
    let keyDiffs = arrayDiff(valueNames, registerKeys);

    for (let j = 0; j < valueNames.length; j++) {
        let toPush: any = {};

        if (object.hasOwnProperty(valueNames[j])) {
            toPush[valueNames[j]] = object[valueNames[j]];
            for (let k = 0; k < keyDiffs.length; k++) {
                toPush[keyDiffs[k]] = object[keyDiffs[k]];
            }
            unwinded.push(toPush);
        }
        if (unwinded.length === 0) {
            unwinded = [];
        }
    }

    return unwinded;
}
