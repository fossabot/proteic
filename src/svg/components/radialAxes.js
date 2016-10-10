import {XRadialAxis} from './xRadialAxis'
import {YRadialAxis} from './yRadialAxis'
//
export class RadialAxes {
  constructor(config) {
    if (config === null) {
      throw new Error('No chart context specified for RadialAxis');
    }

    this.x = new XRadialAxis(config);
    this.y = new YRadialAxis(config);
  }
}