import {scaleSqrt} from 'd3';

export class YRadialAxis {

  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for XRadialAxis');
    }

    let radius = (Math.min(config.width, config.height) / 2) - 10;

    this.yRadialAxis = scaleSqrt()
      .range([0, radius]);
  }
}