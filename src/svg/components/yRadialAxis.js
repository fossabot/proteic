
export class YRadialAxis {

  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for XRadialAxis');
    }

    let radius = (Math.min(config.width, config.height) / 2) - 10;

    this.yRadialAxis = d3.scaleSqrt()
      .range([0, radius]);
  }
}