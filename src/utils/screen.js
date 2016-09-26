var utils = utils || {};

utils.screen = utils.screen || {
  calculateWidth(width, selector) {
    if (width === 'auto') {
      return d3.select(selector)
        .node()
        .getBoundingClientRect()
        .width;
    }
    else if (utils.isNumeric(width)) {
      //check container width TODO
      return width;
    }
    else if (utils.isPercentage(width)) {
      let containerWidth, percentage;
      containerWidth = d3.select(selector)
        .node()
        .getBoundingClientRect()
        .width;
      percentage = width.split('%')[0];
      return Math.round(percentage * containerWidth / 100);
    } else {
      throw Error('Unknow chart width: ' + width);
    }

  }
};