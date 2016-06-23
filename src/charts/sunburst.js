'use strict';

/**
 * Sunburst implementation. This charts belongs to 'Hierarchical' family.
 * It is inherited on 'Hierarchical'.
 */
class Sunburst extends Hierarchical {

  /**
   * Sunburst constructor. It needs (at least) one argument to start: data.
   * Optionally, you can indicate a second argument that includes all the chart options. If you
   * do not specify this, '_default' object is used by default.
   */
  constructor(data, config) {
    super(data, config);
  }

  /**
   * Add new data to the current graph. If it is empty, this creates a new one.
   * @param  {[Object]} datum data to be rendered
   */
  keepDrawing(datum) {
    if (this.data.constructor === Array) { this.data = {}; }
    let config = this.config;
    if (!datum) {
      console.warn('attemp to draw null datum');
      return;
    }

    this._buildTree(datum[datum.length - 1].path, datum[datum.length - 1].value, this.data);

    this.draw();
    return this.data;
  }

  /**
   * Inserts the new nodes into the existing tree.
   * From: http://bl.ocks.org/kerryrodden/7090426
   *
   * @param pathString
   * @param value
   * @param data
   * @private
   */
  _buildTree(pathString, value, data) {
    let path = pathString.split('/');
    var current = data;
    for (let i = 1; i < path.length; i++) {
      var children = current.children;
      var name = path[i];
      var child;
      if (i + 1 < path.length) {
        var foundChild = false;
        for (let j = 0; children !== undefined && j < children.length; j++) {
          if (children[j].name == name) {
            child = children[j];
            foundChild = true;
            break;
          }
        }
        if (!foundChild) {
          child = {
            "name": name,
            "children": []
          };
          if (children === undefined) {
            current.children = [];
          }
          delete current.value;
          current.children.push(child);
        }
        current = child;
      } else {
        child = {
          "name": name,
          "value": value
        };
        if (children === undefined) {
          current.children = [];
        }
        delete current.value;
        current.children.push(child);
      }
    }
  }

}