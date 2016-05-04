const palette_category1 = [
  '#e1c8df',
  '#9ecd9d',
  '#acd9d6',
  '#e4e36b',
  '#bfa1c5',
  '#e4d3b8',
  '#facba8',
  '#ced4ea',
  '#acd9d6'
];

/**
 * Colors utility class. Provides scales for each color palette.
 */
class Colors {

  /**
   * Returns an ordinal scale for category1 palette.
   * @returns {*} D3 scale for category1 palette.
   */
  static scaleCategory1() {
    return d3.scale.ordinal().range(palette_category1);
  }
}
