/*jshint -W117 */ // TODO investigate not defined errors

const doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

function isExternal(url) {
  return url && url.lastIndexOf('http', 0) === 0 && url.lastIndexOf(window.location.host) === -1;
}

function inlineImages(el, callback) {
  let images = el.querySelectorAll('image');
  let left = images.length;
  if (left === 0) {
    callback();
  }
  for (var i = 0; i < images.length; i++) {
    (function (image) {
      var href = image.getAttribute('xlink:href');
      if (href) {
        if (isExternal(href.value)) {
          console.warn('Cannot render embedded images linking to external hosts: ' + href.value);
          return;
        }
      }
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      href = href || image.getAttribute('href');
      img.src = href;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        image.setAttribute('xlink:href', canvas.toDataURL('image/png'));
        left--;
        if (left === 0) {
          callback();
        }
      };
      img.onerror = function () {
        console.error('Could not load ' + href);
        left--;
        if (left === 0) {
          callback();
        }
      };
    })(images[i]);
  }
}

function styles(el, selectorRemap) {
  let css = '';
  let sheets = document.styleSheets;
  for (var i = 0; i < sheets.length; i++) {
    if (isExternal(sheets[i].href)) {
      console.warn('Cannot include styles from other hosts: ' + sheets[i].href);
      continue;
    }
    let rules = sheets[i].cssRules;
    if (rules !== null) {
      for (var j = 0; j < rules.length; j++) {
        let rule = rules[j];
        if (typeof (rule.style) !== 'undefined') {
          let match = null;
          try {
            match = el.querySelector(rule.selectorText);
          } catch (err) {
            console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
          }
          if (match) {
            var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
            css += selector + ' { ' + rule.style.cssText + ' }\n';
          } else if (rule.cssText.match(/^@font-face/)) {
            css += rule.cssText + '\n';
          }
        }
      }
    }
  }
  return css;
}

export function svgAsDataUri(el, options, cb) {
  options = options || {};
  options.scale = options.scale || 1;
  var xmlns = 'http://www.w3.org/2000/xmlns/';

  inlineImages(el, function () {
    var outer = document.createElement('div');
    var clone = el.cloneNode(true);
    var width, height;
    if (el.tagName === 'svg') {
      width = parseInt(clone.getAttribute('width') || clone.style.width || getComputedStyle(el).getPropertyValue('width'));
      height = parseInt(clone.getAttribute('height') || clone.style.height || getComputedStyle(el).getPropertyValue('height'));
    } else {
      let box = el.getBBox();
      width = box.x + box.width;
      height = box.y + box.height;
      clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

      let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.appendChild(clone);
      clone = svg;
    }

    clone.setAttribute('version', '1.1');
    clone.setAttributeNS(xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttributeNS(xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    clone.setAttribute('width', width * options.scale);
    clone.setAttribute('height', height * options.scale);
    clone.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    outer.appendChild(clone);

    let css = styles(el, options.selectorRemap);
    let s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.innerHTML = '<![CDATA[\n' + css + '\n]]>';
    let defs = document.createElement('defs');
    defs.appendChild(s);
    clone.insertBefore(defs, clone.firstChild);

    let svg = doctype + outer.innerHTML;
    let uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
    if (cb) {
      cb(uri);
    }
  });
}
