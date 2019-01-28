var Charts = (function (exports, React) {
  'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  var e10 = Math.sqrt(50),
      e5 = Math.sqrt(10),
      e2 = Math.sqrt(2);

  function ticks(start, stop, count) {
    var reverse,
        i = -1,
        n,
        ticks,
        step;

    stop = +stop, start = +start, count = +count;
    if (start === stop && count > 0) return [start];
    if (reverse = stop < start) n = start, start = stop, stop = n;
    if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

    if (step > 0) {
      start = Math.ceil(start / step);
      stop = Math.floor(stop / step);
      ticks = new Array(n = Math.ceil(stop - start + 1));
      while (++i < n) ticks[i] = (start + i) * step;
    } else {
      start = Math.floor(start * step);
      stop = Math.ceil(stop * step);
      ticks = new Array(n = Math.ceil(start - stop + 1));
      while (++i < n) ticks[i] = (start - i) / step;
    }

    if (reverse) ticks.reverse();

    return ticks;
  }

  function tickIncrement(start, stop, count) {
    var step = (stop - start) / Math.max(0, count),
        power = Math.floor(Math.log(step) / Math.LN10),
        error = step / Math.pow(10, power);
    return power >= 0
        ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
        : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  function tickStep(start, stop, count) {
    var step0 = Math.abs(stop - start) / Math.max(0, count),
        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
        error = step0 / step1;
    if (error >= e10) step1 *= 10;
    else if (error >= e5) step1 *= 5;
    else if (error >= e2) step1 *= 2;
    return stop < start ? -step1 : step1;
  }

  var prefix = "$";

  function Map$1() {}

  Map$1.prototype = map$1.prototype = {
    constructor: Map$1,
    has: function(key) {
      return (prefix + key) in this;
    },
    get: function(key) {
      return this[prefix + key];
    },
    set: function(key, value) {
      this[prefix + key] = value;
      return this;
    },
    remove: function(key) {
      var property = prefix + key;
      return property in this && delete this[property];
    },
    clear: function() {
      for (var property in this) if (property[0] === prefix) delete this[property];
    },
    keys: function() {
      var keys = [];
      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
      return keys;
    },
    values: function() {
      var values = [];
      for (var property in this) if (property[0] === prefix) values.push(this[property]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
      return entries;
    },
    size: function() {
      var size = 0;
      for (var property in this) if (property[0] === prefix) ++size;
      return size;
    },
    empty: function() {
      for (var property in this) if (property[0] === prefix) return false;
      return true;
    },
    each: function(f) {
      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
    }
  };

  function map$1(object, f) {
    var map = new Map$1;

    // Copy constructor.
    if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

    // Index array by numeric index or specified key function.
    else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;

      if (f == null) while (++i < n) map.set(i, object[i]);
      else while (++i < n) map.set(f(o = object[i], i, object), o);
    }

    // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);

    return map;
  }

  function Set() {}

  var proto = map$1.prototype;

  Set.prototype = set$1.prototype = {
    constructor: Set,
    has: proto.has,
    add: function(value) {
      value += "";
      this[prefix + value] = value;
      return this;
    },
    remove: proto.remove,
    clear: proto.clear,
    values: proto.keys,
    size: proto.size,
    empty: proto.empty,
    each: proto.each
  };

  function set$1(object, f) {
    var set = new Set;

    // Copy constructor.
    if (object instanceof Set) object.each(function(value) { set.add(value); });

    // Otherwise, assume it’s an array.
    else if (object) {
      var i = -1, n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);
      else while (++i < n) set.add(f(object[i], i, object));
    }

    return set;
  }

  var array$1 = Array.prototype;

  var map$2 = array$1.map;
  var slice$1 = array$1.slice;

  var implicit = {name: "implicit"};

  function ordinal(range) {
    var index = map$1(),
        domain = [],
        unknown = implicit;

    range = range == null ? [] : slice$1.call(range);

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = map$1();
      var i = -1, n = _.length, d, key;
      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal()
          .domain(domain)
          .range(range)
          .unknown(unknown);
    };

    return scale;
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex3 = /^#([0-9a-f]{3})$/,
      reHex6 = /^#([0-9a-f]{6})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: function() {
      return this.rgb().hex();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: function() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  // https://beta.observablehq.com/@mbostock/lab-and-rgb
  var K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y; else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(
        lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
        lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
        lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert(this).rgb();
    }
  }));

  var A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;

  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant$1(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
  }

  var rgb$1 = (function rgbGamma(y) {
    var color$$1 = gamma(y);

    function rgb$$1(start, end) {
      var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
          g = color$$1(start.g, end.g),
          b = color$$1(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$$1.gamma = rgbGamma;

    return rgb$$1;
  })(1);

  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color$$1;
      for (i = 0; i < n; ++i) {
        color$$1 = rgb(colors[i]);
        r[i] = color$$1.r || 0;
        g[i] = color$$1.g || 0;
        b[i] = color$$1.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color$$1.opacity = 1;
      return function(t) {
        color$$1.r = r(t);
        color$$1.g = g(t);
        color$$1.b = b(t);
        return color$$1 + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);

  function array$2(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function number$1(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = value(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: number$1(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant$1(b)
        : (t === "number" ? number$1
        : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
        : b instanceof color ? rgb$1
        : b instanceof Date ? date
        : Array.isArray(b) ? array$2
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : number$1)(a, b);
  }

  function interpolateRound(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var rho = Math.SQRT2;

  function cubehelix$1(hue$$1) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix$$1(start, end) {
        var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix$$1.gamma = cubehelixGamma;

      return cubehelix$$1;
    })(1);
  }

  cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);

  function constant$2(x) {
    return function() {
      return x;
    };
  }

  function number$2(x) {
    return +x;
  }

  var unit = [0, 1];

  function deinterpolateLinear(a, b) {
    return (b -= (a = +a))
        ? function(x) { return (x - a) / b; }
        : constant$2(b);
  }

  function deinterpolateClamp(deinterpolate) {
    return function(a, b) {
      var d = deinterpolate(a = +a, b = +b);
      return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
    };
  }

  function reinterpolateClamp(reinterpolate) {
    return function(a, b) {
      var r = reinterpolate(a = +a, b = +b);
      return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
    };
  }

  function bimap(domain, range$$1, deinterpolate, reinterpolate) {
    var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
    else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
    return function(x) { return r0(d0(x)); };
  }

  function polymap(domain, range$$1, deinterpolate, reinterpolate) {
    var j = Math.min(domain.length, range$$1.length) - 1,
        d = new Array(j),
        r = new Array(j),
        i = -1;

    // Reverse descending domains.
    if (domain[j] < domain[0]) {
      domain = domain.slice().reverse();
      range$$1 = range$$1.slice().reverse();
    }

    while (++i < j) {
      d[i] = deinterpolate(domain[i], domain[i + 1]);
      r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
    }

    return function(x) {
      var i = bisectRight(domain, x, 1, j) - 1;
      return r[i](d[i](x));
    };
  }

  function copy(source, target) {
    return target
        .domain(source.domain())
        .range(source.range())
        .interpolate(source.interpolate())
        .clamp(source.clamp());
  }

  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
  function continuous(deinterpolate, reinterpolate) {
    var domain = unit,
        range$$1 = unit,
        interpolate$$1 = value,
        clamp = false,
        piecewise$$1,
        output,
        input;

    function rescale() {
      piecewise$$1 = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
      output = input = null;
      return scale;
    }

    function scale(x) {
      return (output || (output = piecewise$$1(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
    }

    scale.invert = function(y) {
      return (input || (input = piecewise$$1(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
    };

    scale.domain = function(_) {
      return arguments.length ? (domain = map$2.call(_, number$2), rescale()) : domain.slice();
    };

    scale.range = function(_) {
      return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
    };

    scale.rangeRound = function(_) {
      return range$$1 = slice$1.call(_), interpolate$$1 = interpolateRound, rescale();
    };

    scale.clamp = function(_) {
      return arguments.length ? (clamp = !!_, rescale()) : clamp;
    };

    scale.interpolate = function(_) {
      return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
    };

    return rescale();
  }

  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function formatNumerals(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
    var match;
    this.fill = match[1] || " ";
    this.align = match[2] || ">";
    this.sign = match[3] || "-";
    this.symbol = match[4] || "";
    this.zero = !!match[5];
    this.width = match[6] && +match[6];
    this.comma = !!match[7];
    this.precision = match[8] && +match[8].slice(1);
    this.trim = !!match[9];
    this.type = match[10] || "";
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + (this.trim ? "~" : "")
        + this.type;
  };

  // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
  function formatTrim(s) {
    out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
      }
    }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  var formatTypes = {
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };

  function identity$2(x) {
    return x;
  }

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

  function formatLocale(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$2,
        currency = locale.currency,
        decimal = locale.decimal,
        numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$2,
        percent = locale.percent || "%";

    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          trim = specifier.trim,
          type = specifier.type;

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // The "" type, and any invalid type, is an alias for ".12~g".
      else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? 6
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      function format(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix,
            i, n, c;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Perform the initial formatting.
          var valueNegative = value < 0;
          value = formatType(Math.abs(value), precision);

          // Trim insignificant zeros.
          if (trim) value = formatTrim(value);

          // If a negative value rounds to zero during formatting, treat as positive.
          if (valueNegative && +value === 0) valueNegative = false;

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": value = valuePrefix + value + valueSuffix + padding; break;
          case "=": value = valuePrefix + padding + value + valueSuffix; break;
          case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
          default: value = padding + valuePrefix + value + valueSuffix; break;
        }

        return numerals(value);
      }

      format.toString = function() {
        return specifier + "";
      };

      return format;
    }

    function formatPrefix(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: newFormat,
      formatPrefix: formatPrefix
    };
  }

  var locale;
  var format;
  var formatPrefix;

  defaultLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    step = Math.abs(step), max = Math.abs(max) - step;
    return Math.max(0, exponent(max) - exponent(step)) + 1;
  }

  function tickFormat(domain, count, specifier) {
    var start = domain[0],
        stop = domain[domain.length - 1],
        step = tickStep(start, stop, count == null ? 10 : count),
        precision;
    specifier = formatSpecifier(specifier == null ? ",f" : specifier);
    switch (specifier.type) {
      case "s": {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
        return formatPrefix(specifier, value);
      }
      case "":
      case "e":
      case "g":
      case "p":
      case "r": {
        if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }
      case "f":
      case "%": {
        if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
    }
    return format(specifier);
  }

  function linearish(scale) {
    var domain = scale.domain;

    scale.ticks = function(count) {
      var d = domain();
      return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
    };

    scale.tickFormat = function(count, specifier) {
      return tickFormat(domain(), count, specifier);
    };

    scale.nice = function(count) {
      if (count == null) count = 10;

      var d = domain(),
          i0 = 0,
          i1 = d.length - 1,
          start = d[i0],
          stop = d[i1],
          step;

      if (stop < start) {
        step = start, start = stop, stop = step;
        step = i0, i0 = i1, i1 = step;
      }

      step = tickIncrement(start, stop, count);

      if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
        step = tickIncrement(start, stop, count);
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
        step = tickIncrement(start, stop, count);
      }

      if (step > 0) {
        d[i0] = Math.floor(start / step) * step;
        d[i1] = Math.ceil(stop / step) * step;
        domain(d);
      } else if (step < 0) {
        d[i0] = Math.ceil(start * step) / step;
        d[i1] = Math.floor(stop * step) / step;
        domain(d);
      }

      return scale;
    };

    return scale;
  }

  function linear$1() {
    var scale = continuous(deinterpolateLinear, number$1);

    scale.copy = function() {
      return copy(scale, linear$1());
    };

    return linearish(scale);
  }

  var t0$1 = new Date,
      t1$1 = new Date;

  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
    };

    interval.round = function(date) {
      var d0 = interval(date),
          d1 = interval.ceil(date);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [], previous;
      start = interval.ceil(start);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
      while (previous < start && start < stop);
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        if (date >= date) {
          if (step < 0) while (++step <= 0) {
            while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
          } else while (--step >= 0) {
            while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
          }
        }
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0$1.setTime(+start), t1$1.setTime(+end);
        floori(t0$1), floori(t1$1);
        return Math.floor(count(t0$1, t1$1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  }

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };
  var milliseconds = millisecond.range;

  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var second = newInterval(function(date) {
    date.setTime(Math.floor(date / durationSecond) * durationSecond);
  }, function(date, step) {
    date.setTime(+date + step * durationSecond);
  }, function(start, end) {
    return (end - start) / durationSecond;
  }, function(date) {
    return date.getUTCSeconds();
  });
  var seconds = second.range;

  var minute = newInterval(function(date) {
    date.setTime(Math.floor(date / durationMinute) * durationMinute);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getMinutes();
  });
  var minutes = minute.range;

  var hour = newInterval(function(date) {
    var offset = date.getTimezoneOffset() * durationMinute % durationHour;
    if (offset < 0) offset += durationHour;
    date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getHours();
  });
  var hours = hour.range;

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function(date) {
    return date.getDate() - 1;
  });
  var days = day.range;

  function weekday(i) {
    return newInterval(function(date) {
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var sundays = sunday.range;

  var month = newInterval(function(date) {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });
  var months = month.range;

  var year = newInterval(function(date) {
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  // An optimized implementation for this simple case.
  year.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step * k);
    });
  };
  var years = year.range;

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationMinute);
  }, function(start, end) {
    return (end - start) / durationMinute;
  }, function(date) {
    return date.getUTCMinutes();
  });
  var utcMinutes = utcMinute.range;

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * durationHour);
  }, function(start, end) {
    return (end - start) / durationHour;
  }, function(date) {
    return date.getUTCHours();
  });
  var utcHours = utcHour.range;

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / durationDay;
  }, function(date) {
    return date.getUTCDate() - 1;
  });
  var utcDays = utcDay.range;

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / durationWeek;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcSundays = utcSunday.range;

  var utcMonth = newInterval(function(date) {
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });
  var utcMonths = utcMonth.range;

  var utcYear = newInterval(function(date) {
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  // An optimized implementation for this simple case.
  utcYear.every = function(k) {
    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step * k);
    });
  };
  var utcYears = utcYear.range;

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  function formatLocale$1(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodRe = formatRe(locale_periods),
        periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "f": formatMicroseconds,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatSeconds,
      "u": formatWeekdayNumberMonday,
      "U": formatWeekNumberSunday,
      "V": formatWeekNumberISO,
      "w": formatWeekdayNumberSunday,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "f": formatUTCMicroseconds,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "Q": formatUnixTimestamp,
      "s": formatUnixTimestampSeconds,
      "S": formatUTCSeconds,
      "u": formatUTCWeekdayNumberMonday,
      "U": formatUTCWeekNumberSunday,
      "V": formatUTCWeekNumberISO,
      "w": formatUTCWeekdayNumberSunday,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "f": parseMicroseconds,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "Q": parseUnixTimestamp,
      "s": parseUnixTimestampSeconds,
      "S": parseSeconds,
      "u": parseWeekdayNumberMonday,
      "U": parseWeekNumberSunday,
      "V": parseWeekNumberISO,
      "w": parseWeekdayNumberSunday,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        if (!(date instanceof Date)) date = new Date(+date);

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            else pad = c === "e" ? " " : "0";
            if (format = formats[c]) c = format(date, pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string += "", 0),
            week, day$$1;
        if (i != string.length) return null;

        // If a UNIX timestamp is specified, return it.
        if ("Q" in d) return new Date(d.Q);

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // Convert day-of-week and week-of-year to day-of-year.
        if ("V" in d) {
          if (d.V < 1 || d.V > 53) return null;
          if (!("w" in d)) d.w = 1;
          if ("Z" in d) {
            week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
            week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
            week = utcDay.offset(week, (d.V - 1) * 7);
            d.y = week.getUTCFullYear();
            d.m = week.getUTCMonth();
            d.d = week.getUTCDate() + (d.w + 6) % 7;
          } else {
            week = newDate(newYear(d.y)), day$$1 = week.getDay();
            week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
            week = day.offset(week, (d.V - 1) * 7);
            d.y = week.getFullYear();
            d.m = week.getMonth();
            d.d = week.getDate() + (d.w + 6) % 7;
          }
        } else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
          day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
          d.m = 0;
          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
        }

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parsePeriod(d, string, i) {
      var n = periodRe.exec(string.slice(i));
      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.toString = function() { return specifier; };
        return f;
      },
      parse: function(specifier) {
        var p = newParse(specifier += "", localDate);
        p.toString = function() { return specifier; };
        return p;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.toString = function() { return specifier; };
        return f;
      },
      utcParse: function(specifier) {
        var p = newParse(specifier, utcDate);
        p.toString = function() { return specifier; };
        return p;
      }
    };
  }

  var pads = {"-": "", "_": " ", "0": "0"},
      numberRe = /^\s*\d+/, // note: ignores next directive
      percentRe = /^%/,
      requoteRe = /[\\^$*+?|[\]().{}]/g;

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function formatLookup(names) {
    var map = {}, i = -1, n = names.length;
    while (++i < n) map[names[i].toLowerCase()] = i;
    return map;
  }

  function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }

  function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatWeekdayNumberMonday(d) {
    var day$$1 = d.getDay();
    return day$$1 === 0 ? 7 : day$$1;
  }

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatWeekNumberISO(d, p) {
    var day$$1 = d.getDay();
    d = (day$$1 >= 4 || day$$1 === 0) ? thursday(d) : thursday.ceil(d);
    return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }

  function formatWeekdayNumberSunday(d) {
    return d.getDay();
  }

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d), d), p, 2);
  }

  function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return dow === 0 ? 7 : dow;
  }

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekNumberISO(d, p) {
    var day$$1 = d.getUTCDay();
    d = (day$$1 >= 4 || day$$1 === 0) ? utcThursday(d) : utcThursday.ceil(d);
    return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }

  function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
  }

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  }

  function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function formatUTCZone() {
    return "+0000";
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUnixTimestamp(d) {
    return +d;
  }

  function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
  }

  var locale$1;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;

  defaultLocale$1({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  function defaultLocale$1(definition) {
    locale$1 = formatLocale$1(definition);
    timeFormat = locale$1.format;
    timeParse = locale$1.parse;
    utcFormat = locale$1.utcFormat;
    utcParse = locale$1.utcParse;
    return locale$1;
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

  function formatIsoNative(date) {
    return date.toISOString();
  }

  var formatIso = Date.prototype.toISOString
      ? formatIsoNative
      : utcFormat(isoSpecifier);

  function parseIsoNative(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  }

  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
      ? parseIsoNative
      : utcParse(isoSpecifier);

  function colors(specifier) {
    var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
    while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
    return colors;
  }

  colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

  colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

  colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

  var schemePaired = colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

  colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

  colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

  colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

  colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

  colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

  function ramp(scheme) {
    return rgbBasis(scheme[scheme.length - 1]);
  }

  var scheme = new Array(3).concat(
    "d8b365f5f5f55ab4ac",
    "a6611adfc27d80cdc1018571",
    "a6611adfc27df5f5f580cdc1018571",
    "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
    "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
    "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
    "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
    "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
    "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
  ).map(colors);

  ramp(scheme);

  var scheme$1 = new Array(3).concat(
    "af8dc3f7f7f77fbf7b",
    "7b3294c2a5cfa6dba0008837",
    "7b3294c2a5cff7f7f7a6dba0008837",
    "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
    "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
    "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
    "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
    "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
    "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
  ).map(colors);

  ramp(scheme$1);

  var scheme$2 = new Array(3).concat(
    "e9a3c9f7f7f7a1d76a",
    "d01c8bf1b6dab8e1864dac26",
    "d01c8bf1b6daf7f7f7b8e1864dac26",
    "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
    "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
    "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
    "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
    "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
    "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
  ).map(colors);

  ramp(scheme$2);

  var scheme$3 = new Array(3).concat(
    "998ec3f7f7f7f1a340",
    "5e3c99b2abd2fdb863e66101",
    "5e3c99b2abd2f7f7f7fdb863e66101",
    "542788998ec3d8daebfee0b6f1a340b35806",
    "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
    "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
    "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
    "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
    "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
  ).map(colors);

  ramp(scheme$3);

  var scheme$4 = new Array(3).concat(
    "ef8a62f7f7f767a9cf",
    "ca0020f4a58292c5de0571b0",
    "ca0020f4a582f7f7f792c5de0571b0",
    "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
    "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
    "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
    "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
    "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
    "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
  ).map(colors);

  ramp(scheme$4);

  var scheme$5 = new Array(3).concat(
    "ef8a62ffffff999999",
    "ca0020f4a582bababa404040",
    "ca0020f4a582ffffffbababa404040",
    "b2182bef8a62fddbc7e0e0e09999994d4d4d",
    "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
    "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
    "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
    "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
    "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
  ).map(colors);

  ramp(scheme$5);

  var scheme$6 = new Array(3).concat(
    "fc8d59ffffbf91bfdb",
    "d7191cfdae61abd9e92c7bb6",
    "d7191cfdae61ffffbfabd9e92c7bb6",
    "d73027fc8d59fee090e0f3f891bfdb4575b4",
    "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
    "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
    "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
    "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
    "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
  ).map(colors);

  ramp(scheme$6);

  var scheme$7 = new Array(3).concat(
    "fc8d59ffffbf91cf60",
    "d7191cfdae61a6d96a1a9641",
    "d7191cfdae61ffffbfa6d96a1a9641",
    "d73027fc8d59fee08bd9ef8b91cf601a9850",
    "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
    "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
    "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
    "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
    "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
  ).map(colors);

  ramp(scheme$7);

  var scheme$8 = new Array(3).concat(
    "fc8d59ffffbf99d594",
    "d7191cfdae61abdda42b83ba",
    "d7191cfdae61ffffbfabdda42b83ba",
    "d53e4ffc8d59fee08be6f59899d5943288bd",
    "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
    "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
    "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
    "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
    "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
  ).map(colors);

  ramp(scheme$8);

  var scheme$9 = new Array(3).concat(
    "e5f5f999d8c92ca25f",
    "edf8fbb2e2e266c2a4238b45",
    "edf8fbb2e2e266c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a42ca25f006d2c",
    "edf8fbccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
    "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
  ).map(colors);

  ramp(scheme$9);

  var scheme$a = new Array(3).concat(
    "e0ecf49ebcda8856a7",
    "edf8fbb3cde38c96c688419d",
    "edf8fbb3cde38c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
    "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
    "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
  ).map(colors);

  ramp(scheme$a);

  var scheme$b = new Array(3).concat(
    "e0f3dba8ddb543a2ca",
    "f0f9e8bae4bc7bccc42b8cbe",
    "f0f9e8bae4bc7bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
    "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
    "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
  ).map(colors);

  ramp(scheme$b);

  var scheme$c = new Array(3).concat(
    "fee8c8fdbb84e34a33",
    "fef0d9fdcc8afc8d59d7301f",
    "fef0d9fdcc8afc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59e34a33b30000",
    "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
    "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
  ).map(colors);

  ramp(scheme$c);

  var scheme$d = new Array(3).concat(
    "ece2f0a6bddb1c9099",
    "f6eff7bdc9e167a9cf02818a",
    "f6eff7bdc9e167a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
    "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
    "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
  ).map(colors);

  ramp(scheme$d);

  var scheme$e = new Array(3).concat(
    "ece7f2a6bddb2b8cbe",
    "f1eef6bdc9e174a9cf0570b0",
    "f1eef6bdc9e174a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
    "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
    "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
  ).map(colors);

  ramp(scheme$e);

  var scheme$f = new Array(3).concat(
    "e7e1efc994c7dd1c77",
    "f1eef6d7b5d8df65b0ce1256",
    "f1eef6d7b5d8df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0dd1c77980043",
    "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
    "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
  ).map(colors);

  ramp(scheme$f);

  var scheme$g = new Array(3).concat(
    "fde0ddfa9fb5c51b8a",
    "feebe2fbb4b9f768a1ae017e",
    "feebe2fbb4b9f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
    "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
    "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
  ).map(colors);

  ramp(scheme$g);

  var scheme$h = new Array(3).concat(
    "edf8b17fcdbb2c7fb8",
    "ffffcca1dab441b6c4225ea8",
    "ffffcca1dab441b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
    "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
    "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
  ).map(colors);

  ramp(scheme$h);

  var scheme$i = new Array(3).concat(
    "f7fcb9addd8e31a354",
    "ffffccc2e69978c679238443",
    "ffffccc2e69978c67931a354006837",
    "ffffccd9f0a3addd8e78c67931a354006837",
    "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
    "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
  ).map(colors);

  ramp(scheme$i);

  var scheme$j = new Array(3).concat(
    "fff7bcfec44fd95f0e",
    "ffffd4fed98efe9929cc4c02",
    "ffffd4fed98efe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929d95f0e993404",
    "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
    "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
  ).map(colors);

  ramp(scheme$j);

  var scheme$k = new Array(3).concat(
    "ffeda0feb24cf03b20",
    "ffffb2fecc5cfd8d3ce31a1c",
    "ffffb2fecc5cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cf03b20bd0026",
    "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
    "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
  ).map(colors);

  ramp(scheme$k);

  var scheme$l = new Array(3).concat(
    "deebf79ecae13182bd",
    "eff3ffbdd7e76baed62171b5",
    "eff3ffbdd7e76baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed63182bd08519c",
    "eff3ffc6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
    "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
  ).map(colors);

  ramp(scheme$l);

  var scheme$m = new Array(3).concat(
    "e5f5e0a1d99b31a354",
    "edf8e9bae4b374c476238b45",
    "edf8e9bae4b374c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47631a354006d2c",
    "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
    "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
  ).map(colors);

  ramp(scheme$m);

  var scheme$n = new Array(3).concat(
    "f0f0f0bdbdbd636363",
    "f7f7f7cccccc969696525252",
    "f7f7f7cccccc969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696636363252525",
    "f7f7f7d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
    "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
  ).map(colors);

  ramp(scheme$n);

  var scheme$o = new Array(3).concat(
    "efedf5bcbddc756bb1",
    "f2f0f7cbc9e29e9ac86a51a3",
    "f2f0f7cbc9e29e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
    "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
    "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
  ).map(colors);

  ramp(scheme$o);

  var scheme$p = new Array(3).concat(
    "fee0d2fc9272de2d26",
    "fee5d9fcae91fb6a4acb181d",
    "fee5d9fcae91fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
    "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
    "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
  ).map(colors);

  ramp(scheme$p);

  var scheme$q = new Array(3).concat(
    "fee6cefdae6be6550d",
    "feeddefdbe85fd8d3cd94701",
    "feeddefdbe85fd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3ce6550da63603",
    "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
    "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
  ).map(colors);

  ramp(scheme$q);

  cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

  var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

  var c = cubehelix();

  var c$1 = rgb(),
      pi_1_3 = Math.PI / 3,
      pi_2_3 = Math.PI * 2 / 3;

  function ramp$1(range) {
    var n = range.length;
    return function(t) {
      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
    };
  }

  ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

  var magma = ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

  var inferno = ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

  var plasma = ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var colorName = {
  	"aliceblue": [240, 248, 255],
  	"antiquewhite": [250, 235, 215],
  	"aqua": [0, 255, 255],
  	"aquamarine": [127, 255, 212],
  	"azure": [240, 255, 255],
  	"beige": [245, 245, 220],
  	"bisque": [255, 228, 196],
  	"black": [0, 0, 0],
  	"blanchedalmond": [255, 235, 205],
  	"blue": [0, 0, 255],
  	"blueviolet": [138, 43, 226],
  	"brown": [165, 42, 42],
  	"burlywood": [222, 184, 135],
  	"cadetblue": [95, 158, 160],
  	"chartreuse": [127, 255, 0],
  	"chocolate": [210, 105, 30],
  	"coral": [255, 127, 80],
  	"cornflowerblue": [100, 149, 237],
  	"cornsilk": [255, 248, 220],
  	"crimson": [220, 20, 60],
  	"cyan": [0, 255, 255],
  	"darkblue": [0, 0, 139],
  	"darkcyan": [0, 139, 139],
  	"darkgoldenrod": [184, 134, 11],
  	"darkgray": [169, 169, 169],
  	"darkgreen": [0, 100, 0],
  	"darkgrey": [169, 169, 169],
  	"darkkhaki": [189, 183, 107],
  	"darkmagenta": [139, 0, 139],
  	"darkolivegreen": [85, 107, 47],
  	"darkorange": [255, 140, 0],
  	"darkorchid": [153, 50, 204],
  	"darkred": [139, 0, 0],
  	"darksalmon": [233, 150, 122],
  	"darkseagreen": [143, 188, 143],
  	"darkslateblue": [72, 61, 139],
  	"darkslategray": [47, 79, 79],
  	"darkslategrey": [47, 79, 79],
  	"darkturquoise": [0, 206, 209],
  	"darkviolet": [148, 0, 211],
  	"deeppink": [255, 20, 147],
  	"deepskyblue": [0, 191, 255],
  	"dimgray": [105, 105, 105],
  	"dimgrey": [105, 105, 105],
  	"dodgerblue": [30, 144, 255],
  	"firebrick": [178, 34, 34],
  	"floralwhite": [255, 250, 240],
  	"forestgreen": [34, 139, 34],
  	"fuchsia": [255, 0, 255],
  	"gainsboro": [220, 220, 220],
  	"ghostwhite": [248, 248, 255],
  	"gold": [255, 215, 0],
  	"goldenrod": [218, 165, 32],
  	"gray": [128, 128, 128],
  	"green": [0, 128, 0],
  	"greenyellow": [173, 255, 47],
  	"grey": [128, 128, 128],
  	"honeydew": [240, 255, 240],
  	"hotpink": [255, 105, 180],
  	"indianred": [205, 92, 92],
  	"indigo": [75, 0, 130],
  	"ivory": [255, 255, 240],
  	"khaki": [240, 230, 140],
  	"lavender": [230, 230, 250],
  	"lavenderblush": [255, 240, 245],
  	"lawngreen": [124, 252, 0],
  	"lemonchiffon": [255, 250, 205],
  	"lightblue": [173, 216, 230],
  	"lightcoral": [240, 128, 128],
  	"lightcyan": [224, 255, 255],
  	"lightgoldenrodyellow": [250, 250, 210],
  	"lightgray": [211, 211, 211],
  	"lightgreen": [144, 238, 144],
  	"lightgrey": [211, 211, 211],
  	"lightpink": [255, 182, 193],
  	"lightsalmon": [255, 160, 122],
  	"lightseagreen": [32, 178, 170],
  	"lightskyblue": [135, 206, 250],
  	"lightslategray": [119, 136, 153],
  	"lightslategrey": [119, 136, 153],
  	"lightsteelblue": [176, 196, 222],
  	"lightyellow": [255, 255, 224],
  	"lime": [0, 255, 0],
  	"limegreen": [50, 205, 50],
  	"linen": [250, 240, 230],
  	"magenta": [255, 0, 255],
  	"maroon": [128, 0, 0],
  	"mediumaquamarine": [102, 205, 170],
  	"mediumblue": [0, 0, 205],
  	"mediumorchid": [186, 85, 211],
  	"mediumpurple": [147, 112, 219],
  	"mediumseagreen": [60, 179, 113],
  	"mediumslateblue": [123, 104, 238],
  	"mediumspringgreen": [0, 250, 154],
  	"mediumturquoise": [72, 209, 204],
  	"mediumvioletred": [199, 21, 133],
  	"midnightblue": [25, 25, 112],
  	"mintcream": [245, 255, 250],
  	"mistyrose": [255, 228, 225],
  	"moccasin": [255, 228, 181],
  	"navajowhite": [255, 222, 173],
  	"navy": [0, 0, 128],
  	"oldlace": [253, 245, 230],
  	"olive": [128, 128, 0],
  	"olivedrab": [107, 142, 35],
  	"orange": [255, 165, 0],
  	"orangered": [255, 69, 0],
  	"orchid": [218, 112, 214],
  	"palegoldenrod": [238, 232, 170],
  	"palegreen": [152, 251, 152],
  	"paleturquoise": [175, 238, 238],
  	"palevioletred": [219, 112, 147],
  	"papayawhip": [255, 239, 213],
  	"peachpuff": [255, 218, 185],
  	"peru": [205, 133, 63],
  	"pink": [255, 192, 203],
  	"plum": [221, 160, 221],
  	"powderblue": [176, 224, 230],
  	"purple": [128, 0, 128],
  	"rebeccapurple": [102, 51, 153],
  	"red": [255, 0, 0],
  	"rosybrown": [188, 143, 143],
  	"royalblue": [65, 105, 225],
  	"saddlebrown": [139, 69, 19],
  	"salmon": [250, 128, 114],
  	"sandybrown": [244, 164, 96],
  	"seagreen": [46, 139, 87],
  	"seashell": [255, 245, 238],
  	"sienna": [160, 82, 45],
  	"silver": [192, 192, 192],
  	"skyblue": [135, 206, 235],
  	"slateblue": [106, 90, 205],
  	"slategray": [112, 128, 144],
  	"slategrey": [112, 128, 144],
  	"snow": [255, 250, 250],
  	"springgreen": [0, 255, 127],
  	"steelblue": [70, 130, 180],
  	"tan": [210, 180, 140],
  	"teal": [0, 128, 128],
  	"thistle": [216, 191, 216],
  	"tomato": [255, 99, 71],
  	"turquoise": [64, 224, 208],
  	"violet": [238, 130, 238],
  	"wheat": [245, 222, 179],
  	"white": [255, 255, 255],
  	"whitesmoke": [245, 245, 245],
  	"yellow": [255, 255, 0],
  	"yellowgreen": [154, 205, 50]
  };

  var isArrayish = function isArrayish(obj) {
  	if (!obj || typeof obj === 'string') {
  		return false;
  	}

  	return obj instanceof Array || Array.isArray(obj) ||
  		(obj.length >= 0 && (obj.splice instanceof Function ||
  			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
  };

  var simpleSwizzle = createCommonjsModule(function (module) {



  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  var swizzle = module.exports = function swizzle(args) {
  	var results = [];

  	for (var i = 0, len = args.length; i < len; i++) {
  		var arg = args[i];

  		if (isArrayish(arg)) {
  			// http://jsperf.com/javascript-array-concat-vs-push/98
  			results = concat.call(results, slice.call(arg));
  		} else {
  			results.push(arg);
  		}
  	}

  	return results;
  };

  swizzle.wrap = function (fn) {
  	return function () {
  		return fn(swizzle(arguments));
  	};
  };
  });

  var colorString = createCommonjsModule(function (module) {
  /* MIT license */



  var reverseNames = {};

  // create a list of reverse color names
  for (var name in colorName) {
  	if (colorName.hasOwnProperty(name)) {
  		reverseNames[colorName[name]] = name;
  	}
  }

  var cs = module.exports = {
  	to: {},
  	get: {}
  };

  cs.get = function (string) {
  	var prefix = string.substring(0, 3).toLowerCase();
  	var val;
  	var model;
  	switch (prefix) {
  		case 'hsl':
  			val = cs.get.hsl(string);
  			model = 'hsl';
  			break;
  		case 'hwb':
  			val = cs.get.hwb(string);
  			model = 'hwb';
  			break;
  		default:
  			val = cs.get.rgb(string);
  			model = 'rgb';
  			break;
  	}

  	if (!val) {
  		return null;
  	}

  	return {model: model, value: val};
  };

  cs.get.rgb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var abbr = /^#([a-f0-9]{3,4})$/i;
  	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
  	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var keyword = /(\D+)/;

  	var rgb = [0, 0, 0, 1];
  	var match;
  	var i;
  	var hexAlpha;

  	if (match = string.match(hex)) {
  		hexAlpha = match[2];
  		match = match[1];

  		for (i = 0; i < 3; i++) {
  			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
  			var i2 = i * 2;
  			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
  		}
  	} else if (match = string.match(abbr)) {
  		match = match[1];
  		hexAlpha = match[3];

  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i] + match[i], 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
  		}
  	} else if (match = string.match(rgba)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i + 1], 0);
  		}

  		if (match[4]) {
  			rgb[3] = parseFloat(match[4]);
  		}
  	} else if (match = string.match(per)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
  		}

  		if (match[4]) {
  			rgb[3] = parseFloat(match[4]);
  		}
  	} else if (match = string.match(keyword)) {
  		if (match[1] === 'transparent') {
  			return [0, 0, 0, 0];
  		}

  		rgb = colorName[match[1]];

  		if (!rgb) {
  			return null;
  		}

  		rgb[3] = 1;

  		return rgb;
  	} else {
  		return null;
  	}

  	for (i = 0; i < 3; i++) {
  		rgb[i] = clamp(rgb[i], 0, 255);
  	}
  	rgb[3] = clamp(rgb[3], 0, 1);

  	return rgb;
  };

  cs.get.hsl = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var match = string.match(hsl);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = (parseFloat(match[1]) + 360) % 360;
  		var s = clamp(parseFloat(match[2]), 0, 100);
  		var l = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

  		return [h, s, l, a];
  	}

  	return null;
  };

  cs.get.hwb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var match = string.match(hwb);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
  		var w = clamp(parseFloat(match[2]), 0, 100);
  		var b = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
  		return [h, w, b, a];
  	}

  	return null;
  };

  cs.to.hex = function () {
  	var rgba = simpleSwizzle(arguments);

  	return (
  		'#' +
  		hexDouble(rgba[0]) +
  		hexDouble(rgba[1]) +
  		hexDouble(rgba[2]) +
  		(rgba[3] < 1
  			? (hexDouble(Math.round(rgba[3] * 255)))
  			: '')
  	);
  };

  cs.to.rgb = function () {
  	var rgba = simpleSwizzle(arguments);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
  		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
  };

  cs.to.rgb.percent = function () {
  	var rgba = simpleSwizzle(arguments);

  	var r = Math.round(rgba[0] / 255 * 100);
  	var g = Math.round(rgba[1] / 255 * 100);
  	var b = Math.round(rgba[2] / 255 * 100);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
  		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
  };

  cs.to.hsl = function () {
  	var hsla = simpleSwizzle(arguments);
  	return hsla.length < 4 || hsla[3] === 1
  		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
  		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
  };

  // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
  // (hwb have alpha optional & 1 is default value)
  cs.to.hwb = function () {
  	var hwba = simpleSwizzle(arguments);

  	var a = '';
  	if (hwba.length >= 4 && hwba[3] !== 1) {
  		a = ', ' + hwba[3];
  	}

  	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
  };

  cs.to.keyword = function (rgb) {
  	return reverseNames[rgb.slice(0, 3)];
  };

  // helpers
  function clamp(num, min, max) {
  	return Math.min(Math.max(min, num), max);
  }

  function hexDouble(num) {
  	var str = num.toString(16).toUpperCase();
  	return (str.length < 2) ? '0' + str : str;
  }
  });
  var colorString_1 = colorString.to;
  var colorString_2 = colorString.get;

  var conversions = createCommonjsModule(function (module) {
  /* MIT license */


  // NOTE: conversions should only return primitive values (i.e. arrays, or
  //       values that give correct `typeof` results).
  //       do not use box values types (i.e. Number(), String(), etc.)

  var reverseKeywords = {};
  for (var key in colorName) {
  	if (colorName.hasOwnProperty(key)) {
  		reverseKeywords[colorName[key]] = key;
  	}
  }

  var convert = module.exports = {
  	rgb: {channels: 3, labels: 'rgb'},
  	hsl: {channels: 3, labels: 'hsl'},
  	hsv: {channels: 3, labels: 'hsv'},
  	hwb: {channels: 3, labels: 'hwb'},
  	cmyk: {channels: 4, labels: 'cmyk'},
  	xyz: {channels: 3, labels: 'xyz'},
  	lab: {channels: 3, labels: 'lab'},
  	lch: {channels: 3, labels: 'lch'},
  	hex: {channels: 1, labels: ['hex']},
  	keyword: {channels: 1, labels: ['keyword']},
  	ansi16: {channels: 1, labels: ['ansi16']},
  	ansi256: {channels: 1, labels: ['ansi256']},
  	hcg: {channels: 3, labels: ['h', 'c', 'g']},
  	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
  	gray: {channels: 1, labels: ['gray']}
  };

  // hide .channels and .labels properties
  for (var model in convert) {
  	if (convert.hasOwnProperty(model)) {
  		if (!('channels' in convert[model])) {
  			throw new Error('missing channels property: ' + model);
  		}

  		if (!('labels' in convert[model])) {
  			throw new Error('missing channel labels property: ' + model);
  		}

  		if (convert[model].labels.length !== convert[model].channels) {
  			throw new Error('channel and label counts mismatch: ' + model);
  		}

  		var channels = convert[model].channels;
  		var labels = convert[model].labels;
  		delete convert[model].channels;
  		delete convert[model].labels;
  		Object.defineProperty(convert[model], 'channels', {value: channels});
  		Object.defineProperty(convert[model], 'labels', {value: labels});
  	}
  }

  convert.rgb.hsl = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var min = Math.min(r, g, b);
  	var max = Math.max(r, g, b);
  	var delta = max - min;
  	var h;
  	var s;
  	var l;

  	if (max === min) {
  		h = 0;
  	} else if (r === max) {
  		h = (g - b) / delta;
  	} else if (g === max) {
  		h = 2 + (b - r) / delta;
  	} else if (b === max) {
  		h = 4 + (r - g) / delta;
  	}

  	h = Math.min(h * 60, 360);

  	if (h < 0) {
  		h += 360;
  	}

  	l = (min + max) / 2;

  	if (max === min) {
  		s = 0;
  	} else if (l <= 0.5) {
  		s = delta / (max + min);
  	} else {
  		s = delta / (2 - max - min);
  	}

  	return [h, s * 100, l * 100];
  };

  convert.rgb.hsv = function (rgb) {
  	var rdif;
  	var gdif;
  	var bdif;
  	var h;
  	var s;

  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var v = Math.max(r, g, b);
  	var diff = v - Math.min(r, g, b);
  	var diffc = function (c) {
  		return (v - c) / 6 / diff + 1 / 2;
  	};

  	if (diff === 0) {
  		h = s = 0;
  	} else {
  		s = diff / v;
  		rdif = diffc(r);
  		gdif = diffc(g);
  		bdif = diffc(b);

  		if (r === v) {
  			h = bdif - gdif;
  		} else if (g === v) {
  			h = (1 / 3) + rdif - bdif;
  		} else if (b === v) {
  			h = (2 / 3) + gdif - rdif;
  		}
  		if (h < 0) {
  			h += 1;
  		} else if (h > 1) {
  			h -= 1;
  		}
  	}

  	return [
  		h * 360,
  		s * 100,
  		v * 100
  	];
  };

  convert.rgb.hwb = function (rgb) {
  	var r = rgb[0];
  	var g = rgb[1];
  	var b = rgb[2];
  	var h = convert.rgb.hsl(rgb)[0];
  	var w = 1 / 255 * Math.min(r, Math.min(g, b));

  	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

  	return [h, w * 100, b * 100];
  };

  convert.rgb.cmyk = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var c;
  	var m;
  	var y;
  	var k;

  	k = Math.min(1 - r, 1 - g, 1 - b);
  	c = (1 - r - k) / (1 - k) || 0;
  	m = (1 - g - k) / (1 - k) || 0;
  	y = (1 - b - k) / (1 - k) || 0;

  	return [c * 100, m * 100, y * 100, k * 100];
  };

  /**
   * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
   * */
  function comparativeDistance(x, y) {
  	return (
  		Math.pow(x[0] - y[0], 2) +
  		Math.pow(x[1] - y[1], 2) +
  		Math.pow(x[2] - y[2], 2)
  	);
  }

  convert.rgb.keyword = function (rgb) {
  	var reversed = reverseKeywords[rgb];
  	if (reversed) {
  		return reversed;
  	}

  	var currentClosestDistance = Infinity;
  	var currentClosestKeyword;

  	for (var keyword in colorName) {
  		if (colorName.hasOwnProperty(keyword)) {
  			var value = colorName[keyword];

  			// Compute comparative distance
  			var distance = comparativeDistance(rgb, value);

  			// Check if its less, if so set as closest
  			if (distance < currentClosestDistance) {
  				currentClosestDistance = distance;
  				currentClosestKeyword = keyword;
  			}
  		}
  	}

  	return currentClosestKeyword;
  };

  convert.keyword.rgb = function (keyword) {
  	return colorName[keyword];
  };

  convert.rgb.xyz = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;

  	// assume sRGB
  	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  	return [x * 100, y * 100, z * 100];
  };

  convert.rgb.lab = function (rgb) {
  	var xyz = convert.rgb.xyz(rgb);
  	var x = xyz[0];
  	var y = xyz[1];
  	var z = xyz[2];
  	var l;
  	var a;
  	var b;

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  	l = (116 * y) - 16;
  	a = 500 * (x - y);
  	b = 200 * (y - z);

  	return [l, a, b];
  };

  convert.hsl.rgb = function (hsl) {
  	var h = hsl[0] / 360;
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var t1;
  	var t2;
  	var t3;
  	var rgb;
  	var val;

  	if (s === 0) {
  		val = l * 255;
  		return [val, val, val];
  	}

  	if (l < 0.5) {
  		t2 = l * (1 + s);
  	} else {
  		t2 = l + s - l * s;
  	}

  	t1 = 2 * l - t2;

  	rgb = [0, 0, 0];
  	for (var i = 0; i < 3; i++) {
  		t3 = h + 1 / 3 * -(i - 1);
  		if (t3 < 0) {
  			t3++;
  		}
  		if (t3 > 1) {
  			t3--;
  		}

  		if (6 * t3 < 1) {
  			val = t1 + (t2 - t1) * 6 * t3;
  		} else if (2 * t3 < 1) {
  			val = t2;
  		} else if (3 * t3 < 2) {
  			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
  		} else {
  			val = t1;
  		}

  		rgb[i] = val * 255;
  	}

  	return rgb;
  };

  convert.hsl.hsv = function (hsl) {
  	var h = hsl[0];
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var smin = s;
  	var lmin = Math.max(l, 0.01);
  	var sv;
  	var v;

  	l *= 2;
  	s *= (l <= 1) ? l : 2 - l;
  	smin *= lmin <= 1 ? lmin : 2 - lmin;
  	v = (l + s) / 2;
  	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  	return [h, sv * 100, v * 100];
  };

  convert.hsv.rgb = function (hsv) {
  	var h = hsv[0] / 60;
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;
  	var hi = Math.floor(h) % 6;

  	var f = h - Math.floor(h);
  	var p = 255 * v * (1 - s);
  	var q = 255 * v * (1 - (s * f));
  	var t = 255 * v * (1 - (s * (1 - f)));
  	v *= 255;

  	switch (hi) {
  		case 0:
  			return [v, t, p];
  		case 1:
  			return [q, v, p];
  		case 2:
  			return [p, v, t];
  		case 3:
  			return [p, q, v];
  		case 4:
  			return [t, p, v];
  		case 5:
  			return [v, p, q];
  	}
  };

  convert.hsv.hsl = function (hsv) {
  	var h = hsv[0];
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;
  	var vmin = Math.max(v, 0.01);
  	var lmin;
  	var sl;
  	var l;

  	l = (2 - s) * v;
  	lmin = (2 - s) * vmin;
  	sl = s * vmin;
  	sl /= (lmin <= 1) ? lmin : 2 - lmin;
  	sl = sl || 0;
  	l /= 2;

  	return [h, sl * 100, l * 100];
  };

  // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
  convert.hwb.rgb = function (hwb) {
  	var h = hwb[0] / 360;
  	var wh = hwb[1] / 100;
  	var bl = hwb[2] / 100;
  	var ratio = wh + bl;
  	var i;
  	var v;
  	var f;
  	var n;

  	// wh + bl cant be > 1
  	if (ratio > 1) {
  		wh /= ratio;
  		bl /= ratio;
  	}

  	i = Math.floor(6 * h);
  	v = 1 - bl;
  	f = 6 * h - i;

  	if ((i & 0x01) !== 0) {
  		f = 1 - f;
  	}

  	n = wh + f * (v - wh); // linear interpolation

  	var r;
  	var g;
  	var b;
  	switch (i) {
  		default:
  		case 6:
  		case 0: r = v; g = n; b = wh; break;
  		case 1: r = n; g = v; b = wh; break;
  		case 2: r = wh; g = v; b = n; break;
  		case 3: r = wh; g = n; b = v; break;
  		case 4: r = n; g = wh; b = v; break;
  		case 5: r = v; g = wh; b = n; break;
  	}

  	return [r * 255, g * 255, b * 255];
  };

  convert.cmyk.rgb = function (cmyk) {
  	var c = cmyk[0] / 100;
  	var m = cmyk[1] / 100;
  	var y = cmyk[2] / 100;
  	var k = cmyk[3] / 100;
  	var r;
  	var g;
  	var b;

  	r = 1 - Math.min(1, c * (1 - k) + k);
  	g = 1 - Math.min(1, m * (1 - k) + k);
  	b = 1 - Math.min(1, y * (1 - k) + k);

  	return [r * 255, g * 255, b * 255];
  };

  convert.xyz.rgb = function (xyz) {
  	var x = xyz[0] / 100;
  	var y = xyz[1] / 100;
  	var z = xyz[2] / 100;
  	var r;
  	var g;
  	var b;

  	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  	// assume sRGB
  	r = r > 0.0031308
  		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
  		: r * 12.92;

  	g = g > 0.0031308
  		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
  		: g * 12.92;

  	b = b > 0.0031308
  		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
  		: b * 12.92;

  	r = Math.min(Math.max(0, r), 1);
  	g = Math.min(Math.max(0, g), 1);
  	b = Math.min(Math.max(0, b), 1);

  	return [r * 255, g * 255, b * 255];
  };

  convert.xyz.lab = function (xyz) {
  	var x = xyz[0];
  	var y = xyz[1];
  	var z = xyz[2];
  	var l;
  	var a;
  	var b;

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  	l = (116 * y) - 16;
  	a = 500 * (x - y);
  	b = 200 * (y - z);

  	return [l, a, b];
  };

  convert.lab.xyz = function (lab) {
  	var l = lab[0];
  	var a = lab[1];
  	var b = lab[2];
  	var x;
  	var y;
  	var z;

  	y = (l + 16) / 116;
  	x = a / 500 + y;
  	z = y - b / 200;

  	var y2 = Math.pow(y, 3);
  	var x2 = Math.pow(x, 3);
  	var z2 = Math.pow(z, 3);
  	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

  	x *= 95.047;
  	y *= 100;
  	z *= 108.883;

  	return [x, y, z];
  };

  convert.lab.lch = function (lab) {
  	var l = lab[0];
  	var a = lab[1];
  	var b = lab[2];
  	var hr;
  	var h;
  	var c;

  	hr = Math.atan2(b, a);
  	h = hr * 360 / 2 / Math.PI;

  	if (h < 0) {
  		h += 360;
  	}

  	c = Math.sqrt(a * a + b * b);

  	return [l, c, h];
  };

  convert.lch.lab = function (lch) {
  	var l = lch[0];
  	var c = lch[1];
  	var h = lch[2];
  	var a;
  	var b;
  	var hr;

  	hr = h / 360 * 2 * Math.PI;
  	a = c * Math.cos(hr);
  	b = c * Math.sin(hr);

  	return [l, a, b];
  };

  convert.rgb.ansi16 = function (args) {
  	var r = args[0];
  	var g = args[1];
  	var b = args[2];
  	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

  	value = Math.round(value / 50);

  	if (value === 0) {
  		return 30;
  	}

  	var ansi = 30
  		+ ((Math.round(b / 255) << 2)
  		| (Math.round(g / 255) << 1)
  		| Math.round(r / 255));

  	if (value === 2) {
  		ansi += 60;
  	}

  	return ansi;
  };

  convert.hsv.ansi16 = function (args) {
  	// optimization here; we already know the value and don't need to get
  	// it converted for us.
  	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };

  convert.rgb.ansi256 = function (args) {
  	var r = args[0];
  	var g = args[1];
  	var b = args[2];

  	// we use the extended greyscale palette here, with the exception of
  	// black and white. normal palette only has 4 greyscale shades.
  	if (r === g && g === b) {
  		if (r < 8) {
  			return 16;
  		}

  		if (r > 248) {
  			return 231;
  		}

  		return Math.round(((r - 8) / 247) * 24) + 232;
  	}

  	var ansi = 16
  		+ (36 * Math.round(r / 255 * 5))
  		+ (6 * Math.round(g / 255 * 5))
  		+ Math.round(b / 255 * 5);

  	return ansi;
  };

  convert.ansi16.rgb = function (args) {
  	var color = args % 10;

  	// handle greyscale
  	if (color === 0 || color === 7) {
  		if (args > 50) {
  			color += 3.5;
  		}

  		color = color / 10.5 * 255;

  		return [color, color, color];
  	}

  	var mult = (~~(args > 50) + 1) * 0.5;
  	var r = ((color & 1) * mult) * 255;
  	var g = (((color >> 1) & 1) * mult) * 255;
  	var b = (((color >> 2) & 1) * mult) * 255;

  	return [r, g, b];
  };

  convert.ansi256.rgb = function (args) {
  	// handle greyscale
  	if (args >= 232) {
  		var c = (args - 232) * 10 + 8;
  		return [c, c, c];
  	}

  	args -= 16;

  	var rem;
  	var r = Math.floor(args / 36) / 5 * 255;
  	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  	var b = (rem % 6) / 5 * 255;

  	return [r, g, b];
  };

  convert.rgb.hex = function (args) {
  	var integer = ((Math.round(args[0]) & 0xFF) << 16)
  		+ ((Math.round(args[1]) & 0xFF) << 8)
  		+ (Math.round(args[2]) & 0xFF);

  	var string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert.hex.rgb = function (args) {
  	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  	if (!match) {
  		return [0, 0, 0];
  	}

  	var colorString = match[0];

  	if (match[0].length === 3) {
  		colorString = colorString.split('').map(function (char) {
  			return char + char;
  		}).join('');
  	}

  	var integer = parseInt(colorString, 16);
  	var r = (integer >> 16) & 0xFF;
  	var g = (integer >> 8) & 0xFF;
  	var b = integer & 0xFF;

  	return [r, g, b];
  };

  convert.rgb.hcg = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var max = Math.max(Math.max(r, g), b);
  	var min = Math.min(Math.min(r, g), b);
  	var chroma = (max - min);
  	var grayscale;
  	var hue;

  	if (chroma < 1) {
  		grayscale = min / (1 - chroma);
  	} else {
  		grayscale = 0;
  	}

  	if (chroma <= 0) {
  		hue = 0;
  	} else
  	if (max === r) {
  		hue = ((g - b) / chroma) % 6;
  	} else
  	if (max === g) {
  		hue = 2 + (b - r) / chroma;
  	} else {
  		hue = 4 + (r - g) / chroma + 4;
  	}

  	hue /= 6;
  	hue %= 1;

  	return [hue * 360, chroma * 100, grayscale * 100];
  };

  convert.hsl.hcg = function (hsl) {
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var c = 1;
  	var f = 0;

  	if (l < 0.5) {
  		c = 2.0 * s * l;
  	} else {
  		c = 2.0 * s * (1.0 - l);
  	}

  	if (c < 1.0) {
  		f = (l - 0.5 * c) / (1.0 - c);
  	}

  	return [hsl[0], c * 100, f * 100];
  };

  convert.hsv.hcg = function (hsv) {
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;

  	var c = s * v;
  	var f = 0;

  	if (c < 1.0) {
  		f = (v - c) / (1 - c);
  	}

  	return [hsv[0], c * 100, f * 100];
  };

  convert.hcg.rgb = function (hcg) {
  	var h = hcg[0] / 360;
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	if (c === 0.0) {
  		return [g * 255, g * 255, g * 255];
  	}

  	var pure = [0, 0, 0];
  	var hi = (h % 1) * 6;
  	var v = hi % 1;
  	var w = 1 - v;
  	var mg = 0;

  	switch (Math.floor(hi)) {
  		case 0:
  			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
  		case 1:
  			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
  		case 2:
  			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
  		case 3:
  			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
  		case 4:
  			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
  		default:
  			pure[0] = 1; pure[1] = 0; pure[2] = w;
  	}

  	mg = (1.0 - c) * g;

  	return [
  		(c * pure[0] + mg) * 255,
  		(c * pure[1] + mg) * 255,
  		(c * pure[2] + mg) * 255
  	];
  };

  convert.hcg.hsv = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	var v = c + g * (1.0 - c);
  	var f = 0;

  	if (v > 0.0) {
  		f = c / v;
  	}

  	return [hcg[0], f * 100, v * 100];
  };

  convert.hcg.hsl = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	var l = g * (1.0 - c) + 0.5 * c;
  	var s = 0;

  	if (l > 0.0 && l < 0.5) {
  		s = c / (2 * l);
  	} else
  	if (l >= 0.5 && l < 1.0) {
  		s = c / (2 * (1 - l));
  	}

  	return [hcg[0], s * 100, l * 100];
  };

  convert.hcg.hwb = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;
  	var v = c + g * (1.0 - c);
  	return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };

  convert.hwb.hcg = function (hwb) {
  	var w = hwb[1] / 100;
  	var b = hwb[2] / 100;
  	var v = 1 - b;
  	var c = v - w;
  	var g = 0;

  	if (c < 1) {
  		g = (v - c) / (1 - c);
  	}

  	return [hwb[0], c * 100, g * 100];
  };

  convert.apple.rgb = function (apple) {
  	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
  };

  convert.rgb.apple = function (rgb) {
  	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
  };

  convert.gray.rgb = function (args) {
  	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };

  convert.gray.hsl = convert.gray.hsv = function (args) {
  	return [0, 0, args[0]];
  };

  convert.gray.hwb = function (gray) {
  	return [0, 100, gray[0]];
  };

  convert.gray.cmyk = function (gray) {
  	return [0, 0, 0, gray[0]];
  };

  convert.gray.lab = function (gray) {
  	return [gray[0], 0, 0];
  };

  convert.gray.hex = function (gray) {
  	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
  	var integer = (val << 16) + (val << 8) + val;

  	var string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert.rgb.gray = function (rgb) {
  	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  	return [val / 255 * 100];
  };
  });
  var conversions_1 = conversions.rgb;
  var conversions_2 = conversions.hsl;
  var conversions_3 = conversions.hsv;
  var conversions_4 = conversions.hwb;
  var conversions_5 = conversions.cmyk;
  var conversions_6 = conversions.xyz;
  var conversions_7 = conversions.lab;
  var conversions_8 = conversions.lch;
  var conversions_9 = conversions.hex;
  var conversions_10 = conversions.keyword;
  var conversions_11 = conversions.ansi16;
  var conversions_12 = conversions.ansi256;
  var conversions_13 = conversions.hcg;
  var conversions_14 = conversions.apple;
  var conversions_15 = conversions.gray;

  /*
  	this function routes a model to all other models.

  	all functions that are routed have a property `.conversion` attached
  	to the returned synthetic function. This property is an array
  	of strings, each with the steps in between the 'from' and 'to'
  	color models (inclusive).

  	conversions that are not possible simply are not included.
  */

  function buildGraph() {
  	var graph = {};
  	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
  	var models = Object.keys(conversions);

  	for (var len = models.length, i = 0; i < len; i++) {
  		graph[models[i]] = {
  			// http://jsperf.com/1-vs-infinity
  			// micro-opt, but this is simple.
  			distance: -1,
  			parent: null
  		};
  	}

  	return graph;
  }

  // https://en.wikipedia.org/wiki/Breadth-first_search
  function deriveBFS(fromModel) {
  	var graph = buildGraph();
  	var queue = [fromModel]; // unshift -> queue -> pop

  	graph[fromModel].distance = 0;

  	while (queue.length) {
  		var current = queue.pop();
  		var adjacents = Object.keys(conversions[current]);

  		for (var len = adjacents.length, i = 0; i < len; i++) {
  			var adjacent = adjacents[i];
  			var node = graph[adjacent];

  			if (node.distance === -1) {
  				node.distance = graph[current].distance + 1;
  				node.parent = current;
  				queue.unshift(adjacent);
  			}
  		}
  	}

  	return graph;
  }

  function link(from, to) {
  	return function (args) {
  		return to(from(args));
  	};
  }

  function wrapConversion(toModel, graph) {
  	var path = [graph[toModel].parent, toModel];
  	var fn = conversions[graph[toModel].parent][toModel];

  	var cur = graph[toModel].parent;
  	while (graph[cur].parent) {
  		path.unshift(graph[cur].parent);
  		fn = link(conversions[graph[cur].parent][cur], fn);
  		cur = graph[cur].parent;
  	}

  	fn.conversion = path;
  	return fn;
  }

  var route = function (fromModel) {
  	var graph = deriveBFS(fromModel);
  	var conversion = {};

  	var models = Object.keys(graph);
  	for (var len = models.length, i = 0; i < len; i++) {
  		var toModel = models[i];
  		var node = graph[toModel];

  		if (node.parent === null) {
  			// no possible conversion, or this node is the source model.
  			continue;
  		}

  		conversion[toModel] = wrapConversion(toModel, graph);
  	}

  	return conversion;
  };

  var convert = {};

  var models = Object.keys(conversions);

  function wrapRaw(fn) {
  	var wrappedFn = function (args) {
  		if (args === undefined || args === null) {
  			return args;
  		}

  		if (arguments.length > 1) {
  			args = Array.prototype.slice.call(arguments);
  		}

  		return fn(args);
  	};

  	// preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  function wrapRounded(fn) {
  	var wrappedFn = function (args) {
  		if (args === undefined || args === null) {
  			return args;
  		}

  		if (arguments.length > 1) {
  			args = Array.prototype.slice.call(arguments);
  		}

  		var result = fn(args);

  		// we're assuming the result is an array here.
  		// see notice in conversions.js; don't use box types
  		// in conversion functions.
  		if (typeof result === 'object') {
  			for (var len = result.length, i = 0; i < len; i++) {
  				result[i] = Math.round(result[i]);
  			}
  		}

  		return result;
  	};

  	// preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  models.forEach(function (fromModel) {
  	convert[fromModel] = {};

  	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
  	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

  	var routes = route(fromModel);
  	var routeModels = Object.keys(routes);

  	routeModels.forEach(function (toModel) {
  		var fn = routes[toModel];

  		convert[fromModel][toModel] = wrapRounded(fn);
  		convert[fromModel][toModel].raw = wrapRaw(fn);
  	});
  });

  var colorConvert = convert;

  var _slice = [].slice;

  var skippedModels = [
  	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
  	'keyword',

  	// gray conflicts with some method names, and has its own method defined.
  	'gray',

  	// shouldn't really be in color-convert either...
  	'hex'
  ];

  var hashedModelKeys = {};
  Object.keys(colorConvert).forEach(function (model) {
  	hashedModelKeys[_slice.call(colorConvert[model].labels).sort().join('')] = model;
  });

  var limiters = {};

  function Color$1(obj, model) {
  	if (!(this instanceof Color$1)) {
  		return new Color$1(obj, model);
  	}

  	if (model && model in skippedModels) {
  		model = null;
  	}

  	if (model && !(model in colorConvert)) {
  		throw new Error('Unknown model: ' + model);
  	}

  	var i;
  	var channels;

  	if (typeof obj === 'undefined') {
  		this.model = 'rgb';
  		this.color = [0, 0, 0];
  		this.valpha = 1;
  	} else if (obj instanceof Color$1) {
  		this.model = obj.model;
  		this.color = obj.color.slice();
  		this.valpha = obj.valpha;
  	} else if (typeof obj === 'string') {
  		var result = colorString.get(obj);
  		if (result === null) {
  			throw new Error('Unable to parse color from string: ' + obj);
  		}

  		this.model = result.model;
  		channels = colorConvert[this.model].channels;
  		this.color = result.value.slice(0, channels);
  		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
  	} else if (obj.length) {
  		this.model = model || 'rgb';
  		channels = colorConvert[this.model].channels;
  		var newArr = _slice.call(obj, 0, channels);
  		this.color = zeroArray(newArr, channels);
  		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
  	} else if (typeof obj === 'number') {
  		// this is always RGB - can be converted later on.
  		obj &= 0xFFFFFF;
  		this.model = 'rgb';
  		this.color = [
  			(obj >> 16) & 0xFF,
  			(obj >> 8) & 0xFF,
  			obj & 0xFF
  		];
  		this.valpha = 1;
  	} else {
  		this.valpha = 1;

  		var keys = Object.keys(obj);
  		if ('alpha' in obj) {
  			keys.splice(keys.indexOf('alpha'), 1);
  			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
  		}

  		var hashedKeys = keys.sort().join('');
  		if (!(hashedKeys in hashedModelKeys)) {
  			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
  		}

  		this.model = hashedModelKeys[hashedKeys];

  		var labels = colorConvert[this.model].labels;
  		var color = [];
  		for (i = 0; i < labels.length; i++) {
  			color.push(obj[labels[i]]);
  		}

  		this.color = zeroArray(color);
  	}

  	// perform limitations (clamping, etc.)
  	if (limiters[this.model]) {
  		channels = colorConvert[this.model].channels;
  		for (i = 0; i < channels; i++) {
  			var limit = limiters[this.model][i];
  			if (limit) {
  				this.color[i] = limit(this.color[i]);
  			}
  		}
  	}

  	this.valpha = Math.max(0, Math.min(1, this.valpha));

  	if (Object.freeze) {
  		Object.freeze(this);
  	}
  }

  Color$1.prototype = {
  	toString: function () {
  		return this.string();
  	},

  	toJSON: function () {
  		return this[this.model]();
  	},

  	string: function (places) {
  		var self = this.model in colorString.to ? this : this.rgb();
  		self = self.round(typeof places === 'number' ? places : 1);
  		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to[self.model](args);
  	},

  	percentString: function (places) {
  		var self = this.rgb().round(typeof places === 'number' ? places : 1);
  		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to.rgb.percent(args);
  	},

  	array: function () {
  		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
  	},

  	object: function () {
  		var result = {};
  		var channels = colorConvert[this.model].channels;
  		var labels = colorConvert[this.model].labels;

  		for (var i = 0; i < channels; i++) {
  			result[labels[i]] = this.color[i];
  		}

  		if (this.valpha !== 1) {
  			result.alpha = this.valpha;
  		}

  		return result;
  	},

  	unitArray: function () {
  		var rgb = this.rgb().color;
  		rgb[0] /= 255;
  		rgb[1] /= 255;
  		rgb[2] /= 255;

  		if (this.valpha !== 1) {
  			rgb.push(this.valpha);
  		}

  		return rgb;
  	},

  	unitObject: function () {
  		var rgb = this.rgb().object();
  		rgb.r /= 255;
  		rgb.g /= 255;
  		rgb.b /= 255;

  		if (this.valpha !== 1) {
  			rgb.alpha = this.valpha;
  		}

  		return rgb;
  	},

  	round: function (places) {
  		places = Math.max(places || 0, 0);
  		return new Color$1(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
  	},

  	alpha: function (val) {
  		if (arguments.length) {
  			return new Color$1(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
  		}

  		return this.valpha;
  	},

  	// rgb
  	red: getset('rgb', 0, maxfn(255)),
  	green: getset('rgb', 1, maxfn(255)),
  	blue: getset('rgb', 2, maxfn(255)),

  	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

  	saturationl: getset('hsl', 1, maxfn(100)),
  	lightness: getset('hsl', 2, maxfn(100)),

  	saturationv: getset('hsv', 1, maxfn(100)),
  	value: getset('hsv', 2, maxfn(100)),

  	chroma: getset('hcg', 1, maxfn(100)),
  	gray: getset('hcg', 2, maxfn(100)),

  	white: getset('hwb', 1, maxfn(100)),
  	wblack: getset('hwb', 2, maxfn(100)),

  	cyan: getset('cmyk', 0, maxfn(100)),
  	magenta: getset('cmyk', 1, maxfn(100)),
  	yellow: getset('cmyk', 2, maxfn(100)),
  	black: getset('cmyk', 3, maxfn(100)),

  	x: getset('xyz', 0, maxfn(100)),
  	y: getset('xyz', 1, maxfn(100)),
  	z: getset('xyz', 2, maxfn(100)),

  	l: getset('lab', 0, maxfn(100)),
  	a: getset('lab', 1),
  	b: getset('lab', 2),

  	keyword: function (val) {
  		if (arguments.length) {
  			return new Color$1(val);
  		}

  		return colorConvert[this.model].keyword(this.color);
  	},

  	hex: function (val) {
  		if (arguments.length) {
  			return new Color$1(val);
  		}

  		return colorString.to.hex(this.rgb().round().color);
  	},

  	rgbNumber: function () {
  		var rgb = this.rgb().color;
  		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
  	},

  	luminosity: function () {
  		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
  		var rgb = this.rgb().color;

  		var lum = [];
  		for (var i = 0; i < rgb.length; i++) {
  			var chan = rgb[i] / 255;
  			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
  		}

  		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  	},

  	contrast: function (color2) {
  		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
  		var lum1 = this.luminosity();
  		var lum2 = color2.luminosity();

  		if (lum1 > lum2) {
  			return (lum1 + 0.05) / (lum2 + 0.05);
  		}

  		return (lum2 + 0.05) / (lum1 + 0.05);
  	},

  	level: function (color2) {
  		var contrastRatio = this.contrast(color2);
  		if (contrastRatio >= 7.1) {
  			return 'AAA';
  		}

  		return (contrastRatio >= 4.5) ? 'AA' : '';
  	},

  	isDark: function () {
  		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
  		var rgb = this.rgb().color;
  		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  		return yiq < 128;
  	},

  	isLight: function () {
  		return !this.isDark();
  	},

  	negate: function () {
  		var rgb = this.rgb();
  		for (var i = 0; i < 3; i++) {
  			rgb.color[i] = 255 - rgb.color[i];
  		}
  		return rgb;
  	},

  	lighten: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[2] += hsl.color[2] * ratio;
  		return hsl;
  	},

  	darken: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[2] -= hsl.color[2] * ratio;
  		return hsl;
  	},

  	saturate: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[1] += hsl.color[1] * ratio;
  		return hsl;
  	},

  	desaturate: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[1] -= hsl.color[1] * ratio;
  		return hsl;
  	},

  	whiten: function (ratio) {
  		var hwb = this.hwb();
  		hwb.color[1] += hwb.color[1] * ratio;
  		return hwb;
  	},

  	blacken: function (ratio) {
  		var hwb = this.hwb();
  		hwb.color[2] += hwb.color[2] * ratio;
  		return hwb;
  	},

  	grayscale: function () {
  		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
  		var rgb = this.rgb().color;
  		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
  		return Color$1.rgb(val, val, val);
  	},

  	fade: function (ratio) {
  		return this.alpha(this.valpha - (this.valpha * ratio));
  	},

  	opaquer: function (ratio) {
  		return this.alpha(this.valpha + (this.valpha * ratio));
  	},

  	rotate: function (degrees) {
  		var hsl = this.hsl();
  		var hue = hsl.color[0];
  		hue = (hue + degrees) % 360;
  		hue = hue < 0 ? 360 + hue : hue;
  		hsl.color[0] = hue;
  		return hsl;
  	},

  	mix: function (mixinColor, weight) {
  		// ported from sass implementation in C
  		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
  		var color1 = mixinColor.rgb();
  		var color2 = this.rgb();
  		var p = weight === undefined ? 0.5 : weight;

  		var w = 2 * p - 1;
  		var a = color1.alpha() - color2.alpha();

  		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
  		var w2 = 1 - w1;

  		return Color$1.rgb(
  				w1 * color1.red() + w2 * color2.red(),
  				w1 * color1.green() + w2 * color2.green(),
  				w1 * color1.blue() + w2 * color2.blue(),
  				color1.alpha() * p + color2.alpha() * (1 - p));
  	}
  };

  // model conversion methods and static constructors
  Object.keys(colorConvert).forEach(function (model) {
  	if (skippedModels.indexOf(model) !== -1) {
  		return;
  	}

  	var channels = colorConvert[model].channels;

  	// conversion methods
  	Color$1.prototype[model] = function () {
  		if (this.model === model) {
  			return new Color$1(this);
  		}

  		if (arguments.length) {
  			return new Color$1(arguments, model);
  		}

  		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
  		return new Color$1(assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha), model);
  	};

  	// 'static' construction methods
  	Color$1[model] = function (color) {
  		if (typeof color === 'number') {
  			color = zeroArray(_slice.call(arguments), channels);
  		}
  		return new Color$1(color, model);
  	};
  });

  function roundTo(num, places) {
  	return Number(num.toFixed(places));
  }

  function roundToPlace(places) {
  	return function (num) {
  		return roundTo(num, places);
  	};
  }

  function getset(model, channel, modifier) {
  	model = Array.isArray(model) ? model : [model];

  	model.forEach(function (m) {
  		(limiters[m] || (limiters[m] = []))[channel] = modifier;
  	});

  	model = model[0];

  	return function (val) {
  		var result;

  		if (arguments.length) {
  			if (modifier) {
  				val = modifier(val);
  			}

  			result = this[model]();
  			result.color[channel] = val;
  			return result;
  		}

  		result = this[model]().color[channel];
  		if (modifier) {
  			result = modifier(result);
  		}

  		return result;
  	};
  }

  function maxfn(max) {
  	return function (v) {
  		return Math.max(0, Math.min(max, v));
  	};
  }

  function assertArray(val) {
  	return Array.isArray(val) ? val : [val];
  }

  function zeroArray(arr, length) {
  	for (var i = 0; i < length; i++) {
  		if (typeof arr[i] !== 'number') {
  			arr[i] = 0;
  		}
  	}

  	return arr;
  }

  var color$1 = Color$1;

  function isClassComponent(component) {
    return typeof component === 'function' && !!component.prototype.isReactComponent ? true : false;
  }
  function isFunctionComponent(component) {
    return typeof component === 'function' && String(component).includes('return React.createElement') ? true : false;
  }
  function isReactComponent(component) {
    return isClassComponent(component) || isFunctionComponent(component) ? true : false;
  }
  function isElement(element) {
    return React__default.isValidElement(element);
  }
  function isDOMTypeElement(element) {
    return isElement(element) && typeof element.type === 'string';
  }

  var FunnelChart = function FunnelChart(_ref) {
    var width = _ref.width,
        height = _ref.height,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$extractValue = _ref.extractValue,
        extractValue = _ref$extractValue === void 0 ? function (d) {
      return d.value;
    } : _ref$extractValue,
        _ref$extractLabel = _ref.extractLabel,
        extractLabel = _ref$extractLabel === void 0 ? function (d) {
      return d.name;
    } : _ref$extractLabel,
        _ref$label = _ref.label,
        label = _ref$label === void 0 ? true : _ref$label,
        _ref$valueFormat = _ref.valueFormat,
        valueFormat = _ref$valueFormat === void 0 ? '.2s' : _ref$valueFormat,
        _ref$colorScale = _ref.colorScale,
        colorScale = _ref$colorScale === void 0 ? ordinal(schemePaired) : _ref$colorScale,
        _ref$minItemWidth = _ref.minItemWidth,
        minItemWidth = _ref$minItemWidth === void 0 ? 10 : _ref$minItemWidth,
        _ref$margins = _ref.margins,
        margins = _ref$margins === void 0 ? {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    } : _ref$margins,
        _ref$gap = _ref.gap,
        gap = _ref$gap === void 0 ? 4 : _ref$gap,
        _ref$ry = _ref.ry,
        ry = _ref$ry === void 0 ? 0.02 : _ref$ry,
        _ref$hoverShift = _ref.hoverShift,
        _ref$luminosityThresh = _ref.luminosityThreshold,
        luminosityThreshold = _ref$luminosityThresh === void 0 ? 0.4 : _ref$luminosityThresh;

    var _useState = React.useState(null),
        _useState2 = _slicedToArray(_useState, 2),
        hover = _useState2[0],
        setHover = _useState2[1];

    var colors = data.reduce(function (a, c) {
      a[c.name] = colorScale(c.name);
      return a;
    }, {});
    var w = width - margins.left - margins.right;
    var h = height - margins.top - margins.bottom - ry * w * 1.4;

    var prepareData = function prepareData(data) {
      var ih = Math.floor(h / data.length);
      var maxValue = Math.max.apply(Math, _toConsumableArray(data.map(extractValue)));
      var sumValue = data.map(extractValue).reduce(function (a, c) {
        return a + c;
      });
      var scale = linear$1().domain([0, maxValue]).range([minItemWidth, w]);
      return data.map(function (item, i, a) {
        var value = extractValue(item);
        var iw = Math.floor(scale(value));
        var x = Math.floor((w - iw) / 2);
        var y = Math.floor(ih * (a.length - i - 1) + ry * w);
        var cc = colors[item.name];
        return {
          value: value,
          x: x,
          y: y,
          percent: value / sumValue,
          height: ih,
          width: iw,
          color: cc,
          textColor: new color$1(cc).luminosity() > luminosityThreshold ? '#000000' : '#FFFFFF',
          item: item
        };
      });
    };

    var d = prepareData(data.sort(function (a, b) {
      return a.value - b.value;
    }));

    var renderLabel = function renderLabel(item, i) {
      if (typeof label === 'boolean' && label) {
        var sc = new color$1(item.textColor).negate();
        var scale = linear$1().domain([20, 500]).range([20, 24]);
        return React__default.createElement("text", {
          x: item.x + item.width / 2,
          y: item.y + item.height / 2 + item.width * ry,
          fill: item.textColor,
          stroke: 'none',
          strokeWidth: 0,
          fontWeight: 900,
          fontSize: scale(item.height),
          style: {
            textShadow: "1px 1px 0 ".concat(sc, ",-1px 1px 0 ").concat(sc, ",1px -1px 0 ").concat(sc, ",-1px -1px 0 ").concat(sc)
          },
          dominantBaseline: "middle",
          textAnchor: "middle"
        }, extractLabel(item.item), ": ", format(valueFormat)(extractValue(item.item)), "(", format('2.0%')(item.percent), ")");
      } else if (isReactComponent(label)) {
        return label(item, i);
      } else if (isDOMTypeElement(label)) {
        return label;
      }

      if (typeof label === 'string') {
        return React__default.createElement("text", {
          x: item.x + item.width / 2,
          y: item.y + item.height / 2,
          fill: item.textColor,
          dominantBaseline: "middle",
          textAnchor: "middle"
        }, "label");
      } else {
        return null;
      }
    }; //
    // render segments from bottom to top
    //


    var bottomW = d[0].width * 0.67;

    var renderItem = function renderItem(item, i, a) {
      var d = [item.x, item.y, item.x + item.width, item.y, Math.floor((w + bottomW) / 2), item.height - gap + item.y, Math.floor((w - bottomW) / 2), item.height - gap + item.y];
      var points = "M".concat(d[0], ",").concat(d[1], " L").concat(d[2], ",").concat(d[3], " ") + "Q".concat(Math.floor((d[2] + 2 * d[4]) / 3), ",").concat(Math.floor((d[5] + d[3]) / 2), ",").concat(d[4], ",").concat(d[5], " ") + "A".concat(Math.floor(bottomW / 2), ",").concat(Math.floor(bottomW * ry), ",0,1,1,").concat(d[6], ",").concat(d[7], " ") + "Q".concat(Math.floor((d[0] + 2 * d[6]) / 3), ",").concat(Math.floor((d[7] + d[1]) / 2), ",").concat(d[0], ",").concat(d[1]); //console.log(points);

      bottomW = item.width;
      return React__default.createElement("g", {
        className: "chart-funnel-item",
        key: "p-".concat(i),
        stroke: "black",
        strokeWidth: 0.14,
        onMouseEnter: function onMouseEnter() {
          setHover(item.item.name);
        },
        onMouseLeave: function onMouseLeave() {
          setHover(null);
        }
      }, React__default.createElement("path", {
        d: points,
        fill: "url(#color-".concat(i, ")")
      }), React__default.createElement("ellipse", {
        cx: Math.floor(w / 2),
        cy: item.y,
        rx: (d[2] - d[0]) / 2,
        ry: item.width * ry,
        fill: colors[item.item.name]
      }), renderLabel(item, i));
    };

    var gradientItem = function gradientItem(item, i) {
      var color0 = new color$1(item.color).lighten(0.3);
      var color1 = new color$1(item.color).darken(0.6);
      return React__default.createElement("linearGradient", {
        key: "color-".concat(i),
        id: "color-".concat(i),
        x1: "0",
        x2: "1",
        y1: "0",
        y2: "0"
      }, React__default.createElement("stop", {
        offset: "0%",
        stopColor: item.color
      }), React__default.createElement("stop", {
        offset: "33%",
        stopColor: color0
      }), React__default.createElement("stop", {
        offset: "66%",
        stopColor: item.color
      }), React__default.createElement("stop", {
        offset: "100%",
        stopColor: color1
      }));
    };

    return React__default.createElement("svg", {
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      x: "0px",
      y: "0px",
      viewBox: "0 0 ".concat(width, " ").concat(height)
    }, React__default.createElement("defs", null, d.map(gradientItem)), React__default.createElement("g", {
      className: "chart-funnel",
      transform: "translate(".concat(margins.left, ",").concat(margins.top, ")")
    }, d.map(renderItem)));
  };

  exports.FunnelChart = FunnelChart;

  return exports;

}({}, React));
