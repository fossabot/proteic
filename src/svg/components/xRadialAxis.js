
export class XRadialAxis {

  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for XRadialAxis');
    }

    this.xRadialAxis = d3.scaleLinear().range([0, 2 * Math.PI]);
  }
}