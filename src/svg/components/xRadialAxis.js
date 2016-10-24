import {scaleLinear} from 'd3';

export class XRadialAxis {

  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for XRadialAxis');
    }

    this.xRadialAxis = scaleLinear().range([0, 2 * Math.PI]);
  }
}