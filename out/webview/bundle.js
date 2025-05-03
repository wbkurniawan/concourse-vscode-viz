"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/js-yaml/dist/js-yaml.mjs
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  function isObject(subject) {
    return typeof subject === "object" && subject !== null;
  }
  function toArray(sequence) {
    if (Array.isArray(sequence)) return sequence;
    else if (isNothing(sequence)) return [];
    return [sequence];
  }
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  function repeat(string, count) {
    var result2 = "", cycle;
    for (cycle = 0; cycle < count; cycle += 1) {
      result2 += string;
    }
    return result2;
  }
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  var isNothing_1 = isNothing;
  var isObject_1 = isObject;
  var toArray_1 = toArray;
  var repeat_1 = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1 = extend;
  var common = {
    isNothing: isNothing_1,
    isObject: isObject_1,
    toArray: toArray_1,
    repeat: repeat_1,
    isNegativeZero: isNegativeZero_1,
    extend: extend_1
  };
  function formatError(exception2, compact2) {
    var where2 = "", message = exception2.reason || "(unknown reason)";
    if (!exception2.mark) return message;
    if (exception2.mark.name) {
      where2 += 'in "' + exception2.mark.name + '" ';
    }
    where2 += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
    if (!compact2 && exception2.mark.snippet) {
      where2 += "\n\n" + exception2.mark.snippet;
    }
    return message + " " + where2;
  }
  function YAMLException$1(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;
  YAMLException$1.prototype.toString = function toString(compact2) {
    return this.name + ": " + formatError(this, compact2);
  };
  var exception = YAMLException$1;
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head = "";
    var tail = "";
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
    if (position - lineStart > maxHalfLength) {
      head = " ... ";
      lineStart = position - maxHalfLength + head.length;
    }
    if (lineEnd - position > maxHalfLength) {
      tail = " ...";
      lineEnd = position + maxHalfLength - tail.length;
    }
    return {
      str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
      pos: position - lineStart + head.length
      // relative position
    };
  }
  function padStart(string, max3) {
    return common.repeat(" ", max3 - string.length) + string;
  }
  function makeSnippet(mark, options) {
    options = Object.create(options || null);
    if (!mark.buffer) return null;
    if (!options.maxLength) options.maxLength = 79;
    if (typeof options.indent !== "number") options.indent = 1;
    if (typeof options.linesBefore !== "number") options.linesBefore = 3;
    if (typeof options.linesAfter !== "number") options.linesAfter = 2;
    var re = /\r?\n|\r|\0/g;
    var lineStarts = [0];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;
    while (match = re.exec(mark.buffer)) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);
      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }
    if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
    var result2 = "", i, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
    for (i = 1; i <= options.linesBefore; i++) {
      if (foundLineNo - i < 0) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo - i],
        lineEnds[foundLineNo - i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
        maxLineLength
      );
      result2 = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result2;
    }
    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result2 += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    result2 += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
    for (i = 1; i <= options.linesAfter; i++) {
      if (foundLineNo + i >= lineEnds.length) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo + i],
        lineEnds[foundLineNo + i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
        maxLineLength
      );
      result2 += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    }
    return result2.replace(/\n$/, "");
  }
  var snippet = makeSnippet;
  var TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ];
  var YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function compileStyleAliases(map3) {
    var result2 = {};
    if (map3 !== null) {
      Object.keys(map3).forEach(function(style) {
        map3[style].forEach(function(alias) {
          result2[String(alias)] = style;
        });
      });
    }
    return result2;
  }
  function Type$1(tag, options) {
    options = options || {};
    Object.keys(options).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.options = options;
    this.tag = tag;
    this.kind = options["kind"] || null;
    this.resolve = options["resolve"] || function() {
      return true;
    };
    this.construct = options["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options["instanceOf"] || null;
    this.predicate = options["predicate"] || null;
    this.represent = options["represent"] || null;
    this.representName = options["representName"] || null;
    this.defaultStyle = options["defaultStyle"] || null;
    this.multi = options["multi"] || false;
    this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  var type = Type$1;
  function compileList(schema2, name) {
    var result2 = [];
    schema2[name].forEach(function(currentType) {
      var newIndex = result2.length;
      result2.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
          newIndex = previousIndex;
        }
      });
      result2[newIndex] = currentType;
    });
    return result2;
  }
  function compileMap() {
    var result2 = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, index, length;
    function collectType(type3) {
      if (type3.multi) {
        result2.multi[type3.kind].push(type3);
        result2.multi["fallback"].push(type3);
      } else {
        result2[type3.kind][type3.tag] = result2["fallback"][type3.tag] = type3;
      }
    }
    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result2;
  }
  function Schema$1(definition) {
    return this.extend(definition);
  }
  Schema$1.prototype.extend = function extend2(definition) {
    var implicit = [];
    var explicit = [];
    if (definition instanceof type) {
      explicit.push(definition);
    } else if (Array.isArray(definition)) {
      explicit = explicit.concat(definition);
    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      if (definition.implicit) implicit = implicit.concat(definition.implicit);
      if (definition.explicit) explicit = explicit.concat(definition.explicit);
    } else {
      throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    }
    implicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      if (type$1.loadKind && type$1.loadKind !== "scalar") {
        throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
      if (type$1.multi) {
        throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
      }
    });
    explicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
    });
    var result2 = Object.create(Schema$1.prototype);
    result2.implicit = (this.implicit || []).concat(implicit);
    result2.explicit = (this.explicit || []).concat(explicit);
    result2.compiledImplicit = compileList(result2, "implicit");
    result2.compiledExplicit = compileList(result2, "explicit");
    result2.compiledTypeMap = compileMap(result2.compiledImplicit, result2.compiledExplicit);
    return result2;
  };
  var schema = Schema$1;
  var str = new type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(data) {
      return data !== null ? data : "";
    }
  });
  var seq = new type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(data) {
      return data !== null ? data : [];
    }
  });
  var map = new type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(data) {
      return data !== null ? data : {};
    }
  });
  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });
  function resolveYamlNull(data) {
    if (data === null) return true;
    var max3 = data.length;
    return max3 === 1 && data === "~" || max3 === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  function constructYamlNull() {
    return null;
  }
  function isNull(object2) {
    return object2 === null;
  }
  var _null = new type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  });
  function resolveYamlBoolean(data) {
    if (data === null) return false;
    var max3 = data.length;
    return max3 === 4 && (data === "true" || data === "True" || data === "TRUE") || max3 === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  function isBoolean(object2) {
    return Object.prototype.toString.call(object2) === "[object Boolean]";
  }
  var bool = new type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function(object2) {
        return object2 ? "true" : "false";
      },
      uppercase: function(object2) {
        return object2 ? "TRUE" : "FALSE";
      },
      camelcase: function(object2) {
        return object2 ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  });
  function isHexCode(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
  }
  function isOctCode(c) {
    return 48 <= c && c <= 55;
  }
  function isDecCode(c) {
    return 48 <= c && c <= 57;
  }
  function resolveYamlInteger(data) {
    if (data === null) return false;
    var max3 = data.length, index = 0, hasDigits = false, ch;
    if (!max3) return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max3) return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (; index < max3; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (ch !== "0" && ch !== "1") return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (; index < max3; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isHexCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "o") {
        index++;
        for (; index < max3; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
    }
    if (ch === "_") return false;
    for (; index < max3; index++) {
      ch = data[index];
      if (ch === "_") continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_") return false;
    return true;
  }
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-") sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
      if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
      if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
    }
    return sign * parseInt(value, 10);
  }
  function isInteger(object2) {
    return Object.prototype.toString.call(object2) === "[object Number]" && (object2 % 1 === 0 && !common.isNegativeZero(object2));
  }
  var int = new type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      },
      octal: function(obj) {
        return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
      },
      decimal: function(obj) {
        return obj.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
  var YAML_FLOAT_PATTERN = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function resolveYamlFloat(data) {
    if (data === null) return false;
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  function constructYamlFloat(data) {
    var value, sign;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }
  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  function representYamlFloat(object2, style) {
    var res;
    if (isNaN(object2)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object2) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object2) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object2)) {
      return "-0.0";
    }
    res = object2.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  function isFloat(object2) {
    return Object.prototype.toString.call(object2) === "[object Number]" && (object2 % 1 !== 0 || common.isNegativeZero(object2));
  }
  var float = new type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
  var json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });
  var core = json;
  var YAML_DATE_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  );
  var YAML_TIMESTAMP_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
  }
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null) throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 6e4;
      if (match[9] === "-") delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta) date.setTime(date.getTime() - delta);
    return date;
  }
  function representYamlTimestamp(object2) {
    return object2.toISOString();
  }
  var timestamp = new type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  var merge = new type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
  var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
  function resolveYamlBinary(data) {
    if (data === null) return false;
    var code, idx, bitlen = 0, max3 = data.length, map3 = BASE64_MAP;
    for (idx = 0; idx < max3; idx++) {
      code = map3.indexOf(data.charAt(idx));
      if (code > 64) continue;
      if (code < 0) return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max3 = input.length, map3 = BASE64_MAP, bits = 0, result2 = [];
    for (idx = 0; idx < max3; idx++) {
      if (idx % 4 === 0 && idx) {
        result2.push(bits >> 16 & 255);
        result2.push(bits >> 8 & 255);
        result2.push(bits & 255);
      }
      bits = bits << 6 | map3.indexOf(input.charAt(idx));
    }
    tailbits = max3 % 4 * 6;
    if (tailbits === 0) {
      result2.push(bits >> 16 & 255);
      result2.push(bits >> 8 & 255);
      result2.push(bits & 255);
    } else if (tailbits === 18) {
      result2.push(bits >> 10 & 255);
      result2.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result2.push(bits >> 4 & 255);
    }
    return new Uint8Array(result2);
  }
  function representYamlBinary(object2) {
    var result2 = "", bits = 0, idx, tail, max3 = object2.length, map3 = BASE64_MAP;
    for (idx = 0; idx < max3; idx++) {
      if (idx % 3 === 0 && idx) {
        result2 += map3[bits >> 18 & 63];
        result2 += map3[bits >> 12 & 63];
        result2 += map3[bits >> 6 & 63];
        result2 += map3[bits & 63];
      }
      bits = (bits << 8) + object2[idx];
    }
    tail = max3 % 3;
    if (tail === 0) {
      result2 += map3[bits >> 18 & 63];
      result2 += map3[bits >> 12 & 63];
      result2 += map3[bits >> 6 & 63];
      result2 += map3[bits & 63];
    } else if (tail === 2) {
      result2 += map3[bits >> 10 & 63];
      result2 += map3[bits >> 4 & 63];
      result2 += map3[bits << 2 & 63];
      result2 += map3[64];
    } else if (tail === 1) {
      result2 += map3[bits >> 2 & 63];
      result2 += map3[bits << 4 & 63];
      result2 += map3[64];
      result2 += map3[64];
    }
    return result2;
  }
  function isBinary(obj) {
    return Object.prototype.toString.call(obj) === "[object Uint8Array]";
  }
  var binary = new type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var _toString$2 = Object.prototype.toString;
  function resolveYamlOmap(data) {
    if (data === null) return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object2 = data;
    for (index = 0, length = object2.length; index < length; index += 1) {
      pair = object2[index];
      pairHasKey = false;
      if (_toString$2.call(pair) !== "[object Object]") return false;
      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey) pairHasKey = true;
          else return false;
        }
      }
      if (!pairHasKey) return false;
      if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
      else return false;
    }
    return true;
  }
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  var omap = new type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
  var _toString$1 = Object.prototype.toString;
  function resolveYamlPairs(data) {
    if (data === null) return true;
    var index, length, pair, keys2, result2, object2 = data;
    result2 = new Array(object2.length);
    for (index = 0, length = object2.length; index < length; index += 1) {
      pair = object2[index];
      if (_toString$1.call(pair) !== "[object Object]") return false;
      keys2 = Object.keys(pair);
      if (keys2.length !== 1) return false;
      result2[index] = [keys2[0], pair[keys2[0]]];
    }
    return true;
  }
  function constructYamlPairs(data) {
    if (data === null) return [];
    var index, length, pair, keys2, result2, object2 = data;
    result2 = new Array(object2.length);
    for (index = 0, length = object2.length; index < length; index += 1) {
      pair = object2[index];
      keys2 = Object.keys(pair);
      result2[index] = [keys2[0], pair[keys2[0]]];
    }
    return result2;
  }
  var pairs = new type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function resolveYamlSet(data) {
    if (data === null) return true;
    var key, object2 = data;
    for (key in object2) {
      if (_hasOwnProperty$2.call(object2, key)) {
        if (object2[key] !== null) return false;
      }
    }
    return true;
  }
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  var set = new type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
  var _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });
  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  function is_EOL(c) {
    return c === 10 || c === 13;
  }
  function is_WHITE_SPACE(c) {
    return c === 9 || c === 32;
  }
  function is_WS_OR_EOL(c) {
    return c === 9 || c === 32 || c === 10 || c === 13;
  }
  function is_FLOW_INDICATOR(c) {
    return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
  }
  function fromHexCode(c) {
    var lc;
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    lc = c | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  function escapedHexLen(c) {
    if (c === 120) {
      return 2;
    }
    if (c === 117) {
      return 4;
    }
    if (c === 85) {
      return 8;
    }
    return 0;
  }
  function fromDecimalCode(c) {
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    return -1;
  }
  function simpleEscapeSequence(c) {
    return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
  }
  function charFromCodepoint(c) {
    if (c <= 65535) {
      return String.fromCharCode(c);
    }
    return String.fromCharCode(
      (c - 65536 >> 10) + 55296,
      (c - 65536 & 1023) + 56320
    );
  }
  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  var i;
  function State$1(input, options) {
    this.input = input;
    this.filename = options["filename"] || null;
    this.schema = options["schema"] || _default;
    this.onWarning = options["onWarning"] || null;
    this.legacy = options["legacy"] || false;
    this.json = options["json"] || false;
    this.listener = options["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.firstTabInLine = -1;
    this.documents = [];
  }
  function generateError(state, message) {
    var mark = {
      name: state.filename,
      buffer: state.input.slice(0, -1),
      // omit trailing \0
      position: state.position,
      line: state.line,
      column: state.position - state.lineStart
    };
    mark.snippet = snippet(mark);
    return new exception(message, mark);
  }
  function throwError(state, message) {
    throw generateError(state, message);
  }
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  var directiveHandlers = {
    YAML: function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    },
    TAG: function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, "tag prefix is malformed: " + prefix);
      }
      state.tagMap[handle] = prefix;
    }
  };
  function captureSegment(state, start2, end, checkJson) {
    var _position, _length, _character, _result;
    if (start2 < end) {
      _result = state.input.slice(start2, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty$1.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      if (keyNode === "__proto__") {
        Object.defineProperty(_result, keyNode, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: valueNode
        });
      } else {
        _result[keyNode] = valueNode;
      }
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 9 && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat("\n", count - 1);
    }
  }
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      } else if (ch === 44) {
        throwError(state, "expected the node content, but found ','");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat("\n", emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat("\n", emptyLines);
        }
      } else {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          break;
        }
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33) return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, "tag name is malformed: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38) return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42) return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type3, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    } else if (state.tag === "?") {
      if (state.result !== null && state.kind !== "scalar") {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type3 = state.implicitTypes[typeIndex];
        if (type3.resolve(state.result)) {
          state.result = type3.construct(state.result);
          state.tag = type3.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== "!") {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type3 = state.typeMap[state.kind || "fallback"][state.tag];
      } else {
        type3 = null;
        typeList = state.typeMap.multi[state.kind || "fallback"];
        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type3 = typeList[typeIndex];
            break;
          }
        }
      }
      if (!type3) {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
      if (state.result !== null && type3.kind !== state.kind) {
        throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type3.kind + '", not "' + state.kind + '"');
      }
      if (!type3.resolve(state.result, state.tag)) {
        throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
      } else {
        state.result = type3.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = /* @__PURE__ */ Object.create(null);
    state.anchorMap = /* @__PURE__ */ Object.create(null);
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch)) break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0) readLineBreak(state);
      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += "\n";
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State$1(input, options);
    var nullpos = input.indexOf("\0");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\0";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
      options = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  function load$1(input, options) {
    var documents = loadDocuments(input, options);
    if (documents.length === 0) {
      return void 0;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception("expected a single document in the stream, but found more");
  }
  var loadAll_1 = loadAll$1;
  var load_1 = load$1;
  var loader = {
    loadAll: loadAll_1,
    load: load_1
  };
  var _toString = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CHAR_BOM = 65279;
  var CHAR_TAB = 9;
  var CHAR_LINE_FEED = 10;
  var CHAR_CARRIAGE_RETURN = 13;
  var CHAR_SPACE = 32;
  var CHAR_EXCLAMATION = 33;
  var CHAR_DOUBLE_QUOTE = 34;
  var CHAR_SHARP = 35;
  var CHAR_PERCENT = 37;
  var CHAR_AMPERSAND = 38;
  var CHAR_SINGLE_QUOTE = 39;
  var CHAR_ASTERISK = 42;
  var CHAR_COMMA = 44;
  var CHAR_MINUS = 45;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_GREATER_THAN = 62;
  var CHAR_QUESTION = 63;
  var CHAR_COMMERCIAL_AT = 64;
  var CHAR_LEFT_SQUARE_BRACKET = 91;
  var CHAR_RIGHT_SQUARE_BRACKET = 93;
  var CHAR_GRAVE_ACCENT = 96;
  var CHAR_LEFT_CURLY_BRACKET = 123;
  var CHAR_VERTICAL_LINE = 124;
  var CHAR_RIGHT_CURLY_BRACKET = 125;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = '\\"';
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  var DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function compileStyleMap(schema2, map3) {
    var result2, keys2, index, length, tag, style, type3;
    if (map3 === null) return {};
    result2 = {};
    keys2 = Object.keys(map3);
    for (index = 0, length = keys2.length; index < length; index += 1) {
      tag = keys2[index];
      style = String(map3[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type3 = schema2.compiledTypeMap["fallback"][tag];
      if (type3 && _hasOwnProperty.call(type3.styleAliases, style)) {
        style = type3.styleAliases[style];
      }
      result2[tag] = style;
    }
    return result2;
  }
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  var QUOTING_TYPE_SINGLE = 1;
  var QUOTING_TYPE_DOUBLE = 2;
  function State(options) {
    this.schema = options["schema"] || _default;
    this.indent = Math.max(1, options["indent"] || 2);
    this.noArrayIndent = options["noArrayIndent"] || false;
    this.skipInvalid = options["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
    this.sortKeys = options["sortKeys"] || false;
    this.lineWidth = options["lineWidth"] || 80;
    this.noRefs = options["noRefs"] || false;
    this.noCompatMode = options["noCompatMode"] || false;
    this.condenseFlow = options["condenseFlow"] || false;
    this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes = options["forceQuotes"] || false;
    this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result2 = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf("\n", position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== "\n") result2 += ind;
      result2 += line;
    }
    return result2;
  }
  function generateNextLine(state, level) {
    return "\n" + common.repeat(" ", state.indent * level);
  }
  function testImplicitResolving(state, str2) {
    var index, length, type3;
    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type3 = state.implicitTypes[index];
      if (type3.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }
  function isPrintable(c) {
    return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
  }
  function isNsCharOrWhitespace(c) {
    return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
  }
  function isPlainSafe(c, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
    return (
      // ns-plain-safe
      (inblock ? (
        // c = flow-in
        cIsNsCharOrWhitespace
      ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
    );
  }
  function isPlainSafeFirst(c) {
    return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }
  function isPlainSafeLast(c) {
    return !isWhitespace(c) && c !== CHAR_COLON;
  }
  function codePointAt(string, pos) {
    var first2 = string.charCodeAt(pos), second;
    if (first2 >= 55296 && first2 <= 56319 && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 56320 && second <= 57343) {
        return (first2 - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first2;
  }
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  var STYLE_PLAIN = 1;
  var STYLE_SINGLE = 2;
  var STYLE_LITERAL = 3;
  var STYLE_FOLDED = 4;
  var STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
    var i;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
    if (singleLineOnly || forceQuotes) {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
            i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = function() {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
        }
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      switch (chooseScalarStyle(
        string,
        singleLineOnly,
        state.indent,
        lineWidth,
        testAmbiguity,
        state.quotingType,
        state.forceQuotes && !iskey,
        inblock
      )) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception("impossible error: invalid scalar style");
      }
    }();
  }
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === "\n";
    var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + "\n";
  }
  function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
  }
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result2 = function() {
      var nextLF = string.indexOf("\n");
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }();
    var prevMoreIndented = string[0] === "\n" || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result2 += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result2;
  }
  function foldLine(line, width) {
    if (line === "" || line[0] === " ") return line;
    var breakRe = / [^ ]/g;
    var match;
    var start2 = 0, end, curr = 0, next = 0;
    var result2 = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start2 > width) {
        end = curr > start2 ? curr : next;
        result2 += "\n" + line.slice(start2, end);
        start2 = end + 1;
      }
      curr = next;
    }
    result2 += "\n";
    if (line.length - start2 > width && curr > start2) {
      result2 += line.slice(start2, curr) + "\n" + line.slice(curr + 1);
    } else {
      result2 += line.slice(start2);
    }
    return result2.slice(1);
  }
  function escapeString(string) {
    var result2 = "";
    var char = 0;
    var escapeSeq;
    for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      escapeSeq = ESCAPE_SEQUENCES[char];
      if (!escapeSeq && isPrintable(char)) {
        result2 += string[i];
        if (char >= 65536) result2 += string[i + 1];
      } else {
        result2 += escapeSeq || encodeHex(char);
      }
    }
    return result2;
  }
  function writeFlowSequence(state, level, object2) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object2.length; index < length; index += 1) {
      value = object2[index];
      if (state.replacer) {
        value = state.replacer.call(object2, String(index), value);
      }
      if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
        if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  function writeBlockSequence(state, level, object2, compact2) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object2.length; index < length; index += 1) {
      value = object2[index];
      if (state.replacer) {
        value = state.replacer.call(object2, String(index), value);
      }
      if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
        if (!compact2 || _result !== "") {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  function writeFlowMapping(state, level, object2) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object2), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (_result !== "") pairBuffer += ", ";
      if (state.condenseFlow) pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object2[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object2, objectKey, objectValue);
      }
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024) pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  function writeBlockMapping(state, level, object2, compact2) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object2), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new exception("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (!compact2 || _result !== "") {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object2[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object2, objectKey, objectValue);
      }
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  function detectType(state, object2, explicit) {
    var _result, typeList, index, length, type3, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length; index < length; index += 1) {
      type3 = typeList[index];
      if ((type3.instanceOf || type3.predicate) && (!type3.instanceOf || typeof object2 === "object" && object2 instanceof type3.instanceOf) && (!type3.predicate || type3.predicate(object2))) {
        if (explicit) {
          if (type3.multi && type3.representName) {
            state.tag = type3.representName(object2);
          } else {
            state.tag = type3.tag;
          }
        } else {
          state.tag = "?";
        }
        if (type3.represent) {
          style = state.styleMap[type3.tag] || type3.defaultStyle;
          if (_toString.call(type3.represent) === "[object Function]") {
            _result = type3.represent(object2, style);
          } else if (_hasOwnProperty.call(type3.represent, style)) {
            _result = type3.represent[style](object2, style);
          } else {
            throw new exception("!<" + type3.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  function writeNode(state, level, object2, block, compact2, iskey, isblockseq) {
    state.tag = null;
    state.dump = object2;
    if (!detectType(state, object2, false)) {
      detectType(state, object2, true);
    }
    var type3 = _toString.call(state.dump);
    var inblock = block;
    var tagStr;
    if (block) {
      block = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type3 === "[object Object]" || type3 === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object2);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact2 = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type3 === "[object Object]") {
        if (block && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact2);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type3 === "[object Array]") {
        if (block && state.dump.length !== 0) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact2);
          } else {
            writeBlockSequence(state, level, state.dump, compact2);
          }
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type3 === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type3 === "[object Undefined]") {
        return false;
      } else {
        if (state.skipInvalid) return false;
        throw new exception("unacceptable kind of an object to dump " + type3);
      }
      if (state.tag !== null && state.tag !== "?") {
        tagStr = encodeURI(
          state.tag[0] === "!" ? state.tag.slice(1) : state.tag
        ).replace(/!/g, "%21");
        if (state.tag[0] === "!") {
          tagStr = "!" + tagStr;
        } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
          tagStr = "!!" + tagStr.slice(18);
        } else {
          tagStr = "!<" + tagStr + ">";
        }
        state.dump = tagStr + " " + state.dump;
      }
    }
    return true;
  }
  function getDuplicateReferences(object2, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object2, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  function inspectNode(object2, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object2 !== null && typeof object2 === "object") {
      index = objects.indexOf(object2);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object2);
        if (Array.isArray(object2)) {
          for (index = 0, length = object2.length; index < length; index += 1) {
            inspectNode(object2[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object2);
          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object2[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  function dump$1(input, options) {
    options = options || {};
    var state = new State(options);
    if (!state.noRefs) getDuplicateReferences(input, state);
    var value = input;
    if (state.replacer) {
      value = state.replacer.call({ "": value }, "", value);
    }
    if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
    return "";
  }
  var dump_1 = dump$1;
  var dumper = {
    dump: dump_1
  };
  function renamed(from, to) {
    return function() {
      throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
    };
  }
  var load = loader.load;
  var loadAll = loader.loadAll;
  var dump = dumper.dump;
  var safeLoad = renamed("safeLoad", "load");
  var safeLoadAll = renamed("safeLoadAll", "loadAll");
  var safeDump = renamed("safeDump", "dump");

  // node_modules/d3-dispatch/src/dispatch.js
  var noop = { value: () => {
  } };
  function dispatch() {
    for (var i = 0, n = arguments.length, _3 = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || t in _3 || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _3[t] = [];
    }
    return new Dispatch(_3);
  }
  function Dispatch(_3) {
    this._ = _3;
  }
  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return { type: t, name };
    });
  }
  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _3 = this._, T = parseTypenames(typename + "", _3), t, i = -1, n = T.length;
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_3[t], typename.name))) return t;
        return;
      }
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _3[t] = set2(_3[t], typename.name, callback);
        else if (callback == null) for (t in _3) _3[t] = set2(_3[t], typename.name, null);
      }
      return this;
    },
    copy: function() {
      var copy = {}, _3 = this._;
      for (var t in _3) copy[t] = _3[t].slice();
      return new Dispatch(copy);
    },
    call: function(type3, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type3)) throw new Error("unknown type: " + type3);
      for (t = this._[type3], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type3, that, args) {
      if (!this._.hasOwnProperty(type3)) throw new Error("unknown type: " + type3);
      for (var t = this._[type3], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };
  function get(type3, name) {
    for (var i = 0, n = type3.length, c; i < n; ++i) {
      if ((c = type3[i]).name === name) {
        return c.value;
      }
    }
  }
  function set2(type3, name, callback) {
    for (var i = 0, n = type3.length; i < n; ++i) {
      if (type3[i].name === name) {
        type3[i] = noop, type3 = type3.slice(0, i).concat(type3.slice(i + 1));
        break;
      }
    }
    if (callback != null) type3.push({ name, value: callback });
    return type3;
  }
  var dispatch_default = dispatch;

  // node_modules/d3-selection/src/namespaces.js
  var xhtml = "http://www.w3.org/1999/xhtml";
  var namespaces_default = {
    svg: "http://www.w3.org/2000/svg",
    xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  // node_modules/d3-selection/src/namespace.js
  function namespace_default(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
  }

  // node_modules/d3-selection/src/creator.js
  function creatorInherit(name) {
    return function() {
      var document2 = this.ownerDocument, uri = this.namespaceURI;
      return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
    };
  }
  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }
  function creator_default(name) {
    var fullname = namespace_default(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
  }

  // node_modules/d3-selection/src/selector.js
  function none() {
  }
  function selector_default(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  // node_modules/d3-selection/src/selection/select.js
  function select_default(select) {
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group2[i]) && (subnode = select.call(node, node.__data__, i, group2))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/array.js
  function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
  }

  // node_modules/d3-selection/src/selectorAll.js
  function empty() {
    return [];
  }
  function selectorAll_default(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectAll.js
  function arrayAll(select) {
    return function() {
      return array(select.apply(this, arguments));
    };
  }
  function selectAll_default(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, node, i = 0; i < n; ++i) {
        if (node = group2[i]) {
          subgroups.push(select.call(node, node.__data__, i, group2));
          parents.push(node);
        }
      }
    }
    return new Selection(subgroups, parents);
  }

  // node_modules/d3-selection/src/matcher.js
  function matcher_default(selector) {
    return function() {
      return this.matches(selector);
    };
  }
  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  // node_modules/d3-selection/src/selection/selectChild.js
  var find = Array.prototype.find;
  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }
  function childFirst() {
    return this.firstElementChild;
  }
  function selectChild_default(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/selectChildren.js
  var filter = Array.prototype.filter;
  function children() {
    return Array.from(this.children);
  }
  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }
  function selectChildren_default(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  // node_modules/d3-selection/src/selection/filter.js
  function filter_default(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group2[i]) && match.call(node, node.__data__, i, group2)) {
          subgroup.push(node);
        }
      }
    }
    return new Selection(subgroups, this._parents);
  }

  // node_modules/d3-selection/src/selection/sparse.js
  function sparse_default(update2) {
    return new Array(update2.length);
  }

  // node_modules/d3-selection/src/selection/enter.js
  function enter_default() {
    return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
  }
  function EnterNode(parent, datum2) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum2;
  }
  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
      return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
      return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
      return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
      return this._parent.querySelectorAll(selector);
    }
  };

  // node_modules/d3-selection/src/constant.js
  function constant_default(x) {
    return function() {
      return x;
    };
  }

  // node_modules/d3-selection/src/selection/data.js
  function bindIndex(parent, group2, enter, update2, exit, data) {
    var i = 0, node, groupLength = group2.length, dataLength = data.length;
    for (; i < dataLength; ++i) {
      if (node = group2[i]) {
        node.__data__ = data[i];
        update2[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (; i < groupLength; ++i) {
      if (node = group2[i]) {
        exit[i] = node;
      }
    }
  }
  function bindKey(parent, group2, enter, update2, exit, data, key) {
    var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group2.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    for (i = 0; i < groupLength; ++i) {
      if (node = group2[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group2) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update2[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }
    for (i = 0; i < groupLength; ++i) {
      if ((node = group2[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
        exit[i] = node;
      }
    }
  }
  function datum(node) {
    return node.__data__;
  }
  function data_default(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = constant_default(value);
    for (var m = groups.length, update2 = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j], group2 = groups[j], groupLength = group2.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update2[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
      bind(parent, group2, enterGroup, updateGroup, exitGroup, data, key);
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
          previous._next = next || null;
        }
      }
    }
    update2 = new Selection(update2, parents);
    update2._enter = enter;
    update2._exit = exit;
    return update2;
  }
  function arraylike(data) {
    return typeof data === "object" && "length" in data ? data : Array.from(data);
  }

  // node_modules/d3-selection/src/selection/exit.js
  function exit_default() {
    return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
  }

  // node_modules/d3-selection/src/selection/join.js
  function join_default(onenter, onupdate, onexit) {
    var enter = this.enter(), update2 = this, exit = this.exit();
    if (typeof onenter === "function") {
      enter = onenter(enter);
      if (enter) enter = enter.selection();
    } else {
      enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
      update2 = onupdate(update2);
      if (update2) update2 = update2.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update2 ? enter.merge(update2).order() : update2;
  }

  // node_modules/d3-selection/src/selection/merge.js
  function merge_default(context) {
    var selection2 = context.selection ? context.selection() : context;
    for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge2[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Selection(merges, this._parents);
  }

  // node_modules/d3-selection/src/selection/order.js
  function order_default() {
    for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
      for (var group2 = groups[j], i = group2.length - 1, next = group2[i], node; --i >= 0; ) {
        if (node = group2[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/sort.js
  function sort_default(compare) {
    if (!compare) compare = ascending;
    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group2[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }
    return new Selection(sortgroups, this._parents).order();
  }
  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  // node_modules/d3-selection/src/selection/call.js
  function call_default() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  // node_modules/d3-selection/src/selection/nodes.js
  function nodes_default() {
    return Array.from(this);
  }

  // node_modules/d3-selection/src/selection/node.js
  function node_default() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group2 = groups[j], i = 0, n = group2.length; i < n; ++i) {
        var node = group2[i];
        if (node) return node;
      }
    }
    return null;
  }

  // node_modules/d3-selection/src/selection/size.js
  function size_default() {
    let size2 = 0;
    for (const node of this) ++size2;
    return size2;
  }

  // node_modules/d3-selection/src/selection/empty.js
  function empty_default() {
    return !this.node();
  }

  // node_modules/d3-selection/src/selection/each.js
  function each_default(callback) {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group2 = groups[j], i = 0, n = group2.length, node; i < n; ++i) {
        if (node = group2[i]) callback.call(node, node.__data__, i, group2);
      }
    }
    return this;
  }

  // node_modules/d3-selection/src/selection/attr.js
  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }
  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }
  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }
  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }
  function attr_default(name, value) {
    var fullname = namespace_default(name);
    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
  }

  // node_modules/d3-selection/src/window.js
  function window_default(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
  }

  // node_modules/d3-selection/src/selection/style.js
  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }
  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }
  function style_default(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
  }
  function styleValue(node, name) {
    return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  // node_modules/d3-selection/src/selection/property.js
  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }
  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }
  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }
  function property_default(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
  }

  // node_modules/d3-selection/src/selection/classed.js
  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }
  function classList(node) {
    return node.classList || new ClassList(node);
  }
  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }
  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };
  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }
  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }
  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }
  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }
  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }
  function classed_default(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
  }

  // node_modules/d3-selection/src/selection/text.js
  function textRemove() {
    this.textContent = "";
  }
  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }
  function text_default(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
  }

  // node_modules/d3-selection/src/selection/html.js
  function htmlRemove() {
    this.innerHTML = "";
  }
  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }
  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }
  function html_default(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
  }

  // node_modules/d3-selection/src/selection/raise.js
  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }
  function raise_default() {
    return this.each(raise);
  }

  // node_modules/d3-selection/src/selection/lower.js
  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }
  function lower_default() {
    return this.each(lower);
  }

  // node_modules/d3-selection/src/selection/append.js
  function append_default(name) {
    var create3 = typeof name === "function" ? name : creator_default(name);
    return this.select(function() {
      return this.appendChild(create3.apply(this, arguments));
    });
  }

  // node_modules/d3-selection/src/selection/insert.js
  function constantNull() {
    return null;
  }
  function insert_default(name, before2) {
    var create3 = typeof name === "function" ? name : creator_default(name), select = before2 == null ? constantNull : typeof before2 === "function" ? before2 : selector_default(before2);
    return this.select(function() {
      return this.insertBefore(create3.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  // node_modules/d3-selection/src/selection/remove.js
  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  function remove_default() {
    return this.each(remove);
  }

  // node_modules/d3-selection/src/selection/clone.js
  function selection_cloneShallow() {
    var clone2 = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone2, this.nextSibling) : clone2;
  }
  function selection_cloneDeep() {
    var clone2 = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone2, this.nextSibling) : clone2;
  }
  function clone_default(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  // node_modules/d3-selection/src/selection/datum.js
  function datum_default(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
  }

  // node_modules/d3-selection/src/selection/on.js
  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }
  function parseTypenames2(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return { type: t, name };
    });
  }
  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }
  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = { type: typename.type, name: typename.name, value, listener, options };
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }
  function on_default(typename, value, options) {
    var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }
    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  // node_modules/d3-selection/src/selection/dispatch.js
  function dispatchEvent(node, type3, params) {
    var window2 = window_default(node), event = window2.CustomEvent;
    if (typeof event === "function") {
      event = new event(type3, params);
    } else {
      event = window2.document.createEvent("Event");
      if (params) event.initEvent(type3, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type3, false, false);
    }
    node.dispatchEvent(event);
  }
  function dispatchConstant(type3, params) {
    return function() {
      return dispatchEvent(this, type3, params);
    };
  }
  function dispatchFunction(type3, params) {
    return function() {
      return dispatchEvent(this, type3, params.apply(this, arguments));
    };
  }
  function dispatch_default2(type3, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type3, params));
  }

  // node_modules/d3-selection/src/selection/iterator.js
  function* iterator_default() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group2 = groups[j], i = 0, n = group2.length, node; i < n; ++i) {
        if (node = group2[i]) yield node;
      }
    }
  }

  // node_modules/d3-selection/src/selection/index.js
  var root = [null];
  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }
  function selection() {
    return new Selection([[document.documentElement]], root);
  }
  function selection_selection() {
    return this;
  }
  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: select_default,
    selectAll: selectAll_default,
    selectChild: selectChild_default,
    selectChildren: selectChildren_default,
    filter: filter_default,
    data: data_default,
    enter: enter_default,
    exit: exit_default,
    join: join_default,
    merge: merge_default,
    selection: selection_selection,
    order: order_default,
    sort: sort_default,
    call: call_default,
    nodes: nodes_default,
    node: node_default,
    size: size_default,
    empty: empty_default,
    each: each_default,
    attr: attr_default,
    style: style_default,
    property: property_default,
    classed: classed_default,
    text: text_default,
    html: html_default,
    raise: raise_default,
    lower: lower_default,
    append: append_default,
    insert: insert_default,
    remove: remove_default,
    clone: clone_default,
    datum: datum_default,
    on: on_default,
    dispatch: dispatch_default2,
    [Symbol.iterator]: iterator_default
  };
  var selection_default = selection;

  // node_modules/d3-selection/src/select.js
  function select_default2(selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
  }

  // node_modules/d3-selection/src/sourceEvent.js
  function sourceEvent_default(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent) event = sourceEvent;
    return event;
  }

  // node_modules/d3-selection/src/pointer.js
  function pointer_default(event, node) {
    event = sourceEvent_default(event);
    if (node === void 0) node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }

  // node_modules/d3-drag/src/noevent.js
  var nonpassivecapture = { capture: true, passive: false };
  function noevent_default(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // node_modules/d3-drag/src/nodrag.js
  function nodrag_default(view) {
    var root3 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
    if ("onselectstart" in root3) {
      selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
    } else {
      root3.__noselect = root3.style.MozUserSelect;
      root3.style.MozUserSelect = "none";
    }
  }
  function yesdrag(view, noclick) {
    var root3 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
    if (noclick) {
      selection2.on("click.drag", noevent_default, nonpassivecapture);
      setTimeout(function() {
        selection2.on("click.drag", null);
      }, 0);
    }
    if ("onselectstart" in root3) {
      selection2.on("selectstart.drag", null);
    } else {
      root3.style.MozUserSelect = root3.__noselect;
      delete root3.__noselect;
    }
  }

  // node_modules/d3-color/src/define.js
  function define_default(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }
  function extend3(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  // node_modules/d3-color/src/color.js
  function Color() {
  }
  var darker = 0.7;
  var brighter = 1 / darker;
  var reI = "\\s*([+-]?\\d+)\\s*";
  var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
  var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
  var reHex = /^#([0-9a-f]{3,8})$/;
  var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
  var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
  var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
  var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
  var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
  var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
  var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  };
  define_default(Color, color, {
    copy(channels) {
      return Object.assign(new this.constructor(), this, channels);
    },
    displayable() {
      return this.rgb().displayable();
    },
    hex: color_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });
  function color_formatHex() {
    return this.rgb().formatHex();
  }
  function color_formatHex8() {
    return this.rgb().formatHex8();
  }
  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }
  function color_formatRgb() {
    return this.rgb().formatRgb();
  }
  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
  }
  function rgbn(n) {
    return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
  }
  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }
  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb();
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
  define_default(Rgb, rgb, extend3(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable() {
      return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex,
    // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));
  function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }
  function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
  }
  function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
  }
  function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
  }
  function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
  }
  function hex(value) {
    value = clampi(value);
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
    if (!o) return new Hsl();
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min3 = Math.min(r, g, b), max3 = Math.max(r, g, b), h = NaN, s = max3 - min3, l = (max3 + min3) / 2;
    if (s) {
      if (r === max3) h = (g - b) / s + (g < b) * 6;
      else if (g === max3) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max3 + min3 : 2 - max3 - min3;
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
  define_default(Hsl, hsl, extend3(Color, {
    brighter(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb() {
      var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    clamp() {
      return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
  }));
  function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
  }
  function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
  }
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
  }

  // node_modules/d3-interpolate/src/basis.js
  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
  }
  function basis_default(values2) {
    var n = values2.length - 1;
    return function(t) {
      var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values2[i], v2 = values2[i + 1], v0 = i > 0 ? values2[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values2[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/basisClosed.js
  function basisClosed_default(values2) {
    var n = values2.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values2[(i + n - 1) % n], v1 = values2[i % n], v2 = values2[(i + 1) % n], v3 = values2[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  // node_modules/d3-interpolate/src/constant.js
  var constant_default2 = (x) => () => x;

  // node_modules/d3-interpolate/src/color.js
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
  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
    };
  }
  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
  }

  // node_modules/d3-interpolate/src/rgb.js
  var rgb_default = function rgbGamma(y) {
    var color2 = gamma(y);
    function rgb2(start2, end) {
      var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
      return function(t) {
        start2.r = r(t);
        start2.g = g(t);
        start2.b = b(t);
        start2.opacity = opacity(t);
        return start2 + "";
      };
    }
    rgb2.gamma = rgbGamma;
    return rgb2;
  }(1);
  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
      for (i = 0; i < n; ++i) {
        color2 = rgb(colors[i]);
        r[i] = color2.r || 0;
        g[i] = color2.g || 0;
        b[i] = color2.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color2.opacity = 1;
      return function(t) {
        color2.r = r(t);
        color2.g = g(t);
        color2.b = b(t);
        return color2 + "";
      };
    };
  }
  var rgbBasis = rgbSpline(basis_default);
  var rgbBasisClosed = rgbSpline(basisClosed_default);

  // node_modules/d3-interpolate/src/number.js
  function number_default(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  // node_modules/d3-interpolate/src/string.js
  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
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
  function string_default(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs;
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm;
        else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({ i, x: number_default(am, bm) });
      }
      bi = reB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
      for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
      return s.join("");
    });
  }

  // node_modules/d3-interpolate/src/transform/decompose.js
  var degrees = 180 / Math.PI;
  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };
  function decompose_default(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX,
      scaleY
    };
  }

  // node_modules/d3-interpolate/src/transform/parse.js
  var svgNode;
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  // node_modules/d3-interpolate/src/transform/index.js
  function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }
    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360;
        else if (b - a > 180) a += 360;
        q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }
    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }
    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }
    return function(a, b) {
      var s = [], q = [];
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null;
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }
  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  // node_modules/d3-interpolate/src/zoom.js
  var epsilon2 = 1e-12;
  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  var zoom_default = function zoomRho(rho, rho2, rho4) {
    function zoom(p0, p1) {
      var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
      if (d2 < epsilon2) {
        S = Math.log(w1 / w0) / rho;
        i = function(t) {
          return [
            ux0 + t * dx,
            uy0 + t * dy,
            w0 * Math.exp(rho * t * S)
          ];
        };
      } else {
        var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
        S = (r1 - r0) / rho;
        i = function(t) {
          var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
          return [
            ux0 + u * dx,
            uy0 + u * dy,
            w0 * coshr0 / cosh(rho * s + r0)
          ];
        };
      }
      i.duration = S * 1e3 * rho / Math.SQRT2;
      return i;
    }
    zoom.rho = function(_3) {
      var _1 = Math.max(1e-3, +_3), _22 = _1 * _1, _4 = _22 * _22;
      return zoomRho(_1, _22, _4);
    };
    return zoom;
  }(Math.SQRT2, 2, 4);

  // node_modules/d3-timer/src/timer.js
  var frame = 0;
  var timeout = 0;
  var interval = 0;
  var pokeDelay = 1e3;
  var taskHead;
  var taskTail;
  var clockLast = 0;
  var clockNow = 0;
  var clockSkew = 0;
  var clock = typeof performance === "object" && performance.now ? performance : Date;
  var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
  };
  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }
  function clearNow() {
    clockNow = 0;
  }
  function Timer() {
    this._call = this._time = this._next = null;
  }
  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };
  function timer(callback, delay, time) {
    var t = new Timer();
    t.restart(callback, delay, time);
    return t;
  }
  function timerFlush() {
    now();
    ++frame;
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
      t = t._next;
    }
    --frame;
  }
  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }
  function poke() {
    var now2 = clock.now(), delay = now2 - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
  }
  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }
  function sleep(time) {
    if (frame) return;
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow;
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  // node_modules/d3-timer/src/timeout.js
  function timeout_default(callback, delay, time) {
    var t = new Timer();
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed) => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  // node_modules/d3-transition/src/transition/schedule.js
  var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
  var emptyTween = [];
  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;
  function schedule_default(node, name, id2, index, group2, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id2 in schedules) return;
    create(node, id2, {
      name,
      index,
      // For context during callback.
      group: group2,
      // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }
  function init(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }
  function set3(node, id2) {
    var schedule = get2(node, id2);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }
  function get2(node, id2) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
    return schedule;
  }
  function create(node, id2, self2) {
    var schedules = node.__transition, tween;
    schedules[id2] = self2;
    self2.timer = timer(schedule, 0, self2.time);
    function schedule(elapsed) {
      self2.state = SCHEDULED;
      self2.timer.restart(start2, self2.delay, self2.time);
      if (self2.delay <= elapsed) start2(elapsed - self2.delay);
    }
    function start2(elapsed) {
      var i, j, n, o;
      if (self2.state !== SCHEDULED) return stop();
      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self2.name) continue;
        if (o.state === STARTED) return timeout_default(start2);
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        } else if (+i < id2) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }
      timeout_default(function() {
        if (self2.state === STARTED) {
          self2.state = RUNNING;
          self2.timer.restart(tick, self2.delay, self2.time);
          tick(elapsed);
        }
      });
      self2.state = STARTING;
      self2.on.call("start", node, node.__data__, self2.index, self2.group);
      if (self2.state !== STARTING) return;
      self2.state = STARTED;
      tween = new Array(n = self2.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self2.tween[i].value.call(node, node.__data__, self2.index, self2.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }
    function tick(elapsed) {
      var t = elapsed < self2.duration ? self2.ease.call(null, elapsed / self2.duration) : (self2.timer.restart(stop), self2.state = ENDING, 1), i = -1, n = tween.length;
      while (++i < n) {
        tween[i].call(node, t);
      }
      if (self2.state === ENDING) {
        self2.on.call("end", node, node.__data__, self2.index, self2.group);
        stop();
      }
    }
    function stop() {
      self2.state = ENDED;
      self2.timer.stop();
      delete schedules[id2];
      for (var i in schedules) return;
      delete node.__transition;
    }
  }

  // node_modules/d3-transition/src/interrupt.js
  function interrupt_default(node, name) {
    var schedules = node.__transition, schedule, active, empty2 = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) {
        empty2 = false;
        continue;
      }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }
    if (empty2) delete node.__transition;
  }

  // node_modules/d3-transition/src/selection/interrupt.js
  function interrupt_default2(name) {
    return this.each(function() {
      interrupt_default(this, name);
    });
  }

  // node_modules/d3-transition/src/transition/tween.js
  function tweenRemove(id2, name) {
    var tween0, tween1;
    return function() {
      var schedule = set3(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }
      schedule.tween = tween1;
    };
  }
  function tweenFunction(id2, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error();
    return function() {
      var schedule = set3(this, id2), tween = schedule.tween;
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }
      schedule.tween = tween1;
    };
  }
  function tween_default(name, value) {
    var id2 = this._id;
    name += "";
    if (arguments.length < 2) {
      var tween = get2(this.node(), id2).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
  }
  function tweenValue(transition2, name, value) {
    var id2 = transition2._id;
    transition2.each(function() {
      var schedule = set3(this, id2);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
      return get2(node, id2).value[name];
    };
  }

  // node_modules/d3-transition/src/transition/interpolate.js
  function interpolate_default(a, b) {
    var c;
    return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
  }

  // node_modules/d3-transition/src/transition/attr.js
  function attrRemove2(name) {
    return function() {
      this.removeAttribute(name);
    };
  }
  function attrRemoveNS2(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }
  function attrConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrConstantNS2(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function attrFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attrFunctionNS2(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function attr_default2(name, value) {
    var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
  }

  // node_modules/d3-transition/src/transition/attrTween.js
  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }
  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }
  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function attrTween_default(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    var fullname = namespace_default(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  // node_modules/d3-transition/src/transition/delay.js
  function delayFunction(id2, value) {
    return function() {
      init(this, id2).delay = +value.apply(this, arguments);
    };
  }
  function delayConstant(id2, value) {
    return value = +value, function() {
      init(this, id2).delay = value;
    };
  }
  function delay_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
  }

  // node_modules/d3-transition/src/transition/duration.js
  function durationFunction(id2, value) {
    return function() {
      set3(this, id2).duration = +value.apply(this, arguments);
    };
  }
  function durationConstant(id2, value) {
    return value = +value, function() {
      set3(this, id2).duration = value;
    };
  }
  function duration_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
  }

  // node_modules/d3-transition/src/transition/ease.js
  function easeConstant(id2, value) {
    if (typeof value !== "function") throw new Error();
    return function() {
      set3(this, id2).ease = value;
    };
  }
  function ease_default(value) {
    var id2 = this._id;
    return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
  }

  // node_modules/d3-transition/src/transition/easeVarying.js
  function easeVarying(id2, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error();
      set3(this, id2).ease = v;
    };
  }
  function easeVarying_default(value) {
    if (typeof value !== "function") throw new Error();
    return this.each(easeVarying(this._id, value));
  }

  // node_modules/d3-transition/src/transition/filter.js
  function filter_default2(match) {
    if (typeof match !== "function") match = matcher_default(match);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group2[i]) && match.call(node, node.__data__, i, group2)) {
          subgroup.push(node);
        }
      }
    }
    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/merge.js
  function merge_default2(transition2) {
    if (transition2._id !== this._id) throw new Error();
    for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge2[i] = node;
        }
      }
    }
    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }
    return new Transition(merges, this._parents, this._name, this._id);
  }

  // node_modules/d3-transition/src/transition/on.js
  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }
  function onFunction(id2, name, listener) {
    var on0, on1, sit = start(name) ? init : set3;
    return function() {
      var schedule = sit(this, id2), on = schedule.on;
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
      schedule.on = on1;
    };
  }
  function on_default2(name, listener) {
    var id2 = this._id;
    return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
  }

  // node_modules/d3-transition/src/transition/remove.js
  function removeFunction(id2) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id2) return;
      if (parent) parent.removeChild(this);
    };
  }
  function remove_default2() {
    return this.on("end.remove", removeFunction(this._id));
  }

  // node_modules/d3-transition/src/transition/select.js
  function select_default3(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selector_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group2[i]) && (subnode = select.call(node, node.__data__, i, group2))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
        }
      }
    }
    return new Transition(subgroups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selectAll.js
  function selectAll_default2(select) {
    var name = this._name, id2 = this._id;
    if (typeof select !== "function") select = selectorAll_default(select);
    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, node, i = 0; i < n; ++i) {
        if (node = group2[i]) {
          for (var children2 = select.call(node, node.__data__, i, group2), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
            if (child = children2[k]) {
              schedule_default(child, name, id2, k, children2, inherit2);
            }
          }
          subgroups.push(children2);
          parents.push(node);
        }
      }
    }
    return new Transition(subgroups, parents, name, id2);
  }

  // node_modules/d3-transition/src/transition/selection.js
  var Selection2 = selection_default.prototype.constructor;
  function selection_default2() {
    return new Selection2(this._groups, this._parents);
  }

  // node_modules/d3-transition/src/transition/style.js
  function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }
  function styleRemove2(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }
  function styleConstant2(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
  }
  function styleFunction2(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
      var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }
  function styleMaybeRemove(id2, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
    return function() {
      var schedule = set3(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
      schedule.on = on1;
    };
  }
  function style_default2(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
  }

  // node_modules/d3-transition/src/transition/styleTween.js
  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }
  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }
  function styleTween_default(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  // node_modules/d3-transition/src/transition/text.js
  function textConstant2(value) {
    return function() {
      this.textContent = value;
    };
  }
  function textFunction2(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }
  function text_default2(value) {
    return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
  }

  // node_modules/d3-transition/src/transition/textTween.js
  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }
  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }
  function textTween_default(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error();
    return this.tween(key, textTween(value));
  }

  // node_modules/d3-transition/src/transition/transition.js
  function transition_default() {
    var name = this._name, id0 = this._id, id1 = newId();
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, node, i = 0; i < n; ++i) {
        if (node = group2[i]) {
          var inherit2 = get2(node, id0);
          schedule_default(node, name, id1, i, group2, {
            time: inherit2.time + inherit2.delay + inherit2.duration,
            delay: 0,
            duration: inherit2.duration,
            ease: inherit2.ease
          });
        }
      }
    }
    return new Transition(groups, this._parents, name, id1);
  }

  // node_modules/d3-transition/src/transition/end.js
  function end_default() {
    var on0, on1, that = this, id2 = that._id, size2 = that.size();
    return new Promise(function(resolve, reject2) {
      var cancel = { value: reject2 }, end = { value: function() {
        if (--size2 === 0) resolve();
      } };
      that.each(function() {
        var schedule = set3(this, id2), on = schedule.on;
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }
        schedule.on = on1;
      });
      if (size2 === 0) resolve();
    });
  }

  // node_modules/d3-transition/src/transition/index.js
  var id = 0;
  function Transition(groups, parents, name, id2) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id2;
  }
  function transition(name) {
    return selection_default().transition(name);
  }
  function newId() {
    return ++id;
  }
  var selection_prototype = selection_default.prototype;
  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: select_default3,
    selectAll: selectAll_default2,
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: filter_default2,
    merge: merge_default2,
    selection: selection_default2,
    transition: transition_default,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: on_default2,
    attr: attr_default2,
    attrTween: attrTween_default,
    style: style_default2,
    styleTween: styleTween_default,
    text: text_default2,
    textTween: textTween_default,
    remove: remove_default2,
    tween: tween_default,
    delay: delay_default,
    duration: duration_default,
    ease: ease_default,
    easeVarying: easeVarying_default,
    end: end_default,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  // node_modules/d3-ease/src/cubic.js
  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  // node_modules/d3-transition/src/selection/transition.js
  var defaultTiming = {
    time: null,
    // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };
  function inherit(node, id2) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id2])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id2} not found`);
      }
    }
    return timing;
  }
  function transition_default2(name) {
    var id2, timing;
    if (name instanceof Transition) {
      id2 = name._id, name = name._name;
    } else {
      id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }
    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group2 = groups[j], n = group2.length, node, i = 0; i < n; ++i) {
        if (node = group2[i]) {
          schedule_default(node, name, id2, i, group2, timing || inherit(node, id2));
        }
      }
    }
    return new Transition(groups, this._parents, name, id2);
  }

  // node_modules/d3-transition/src/selection/index.js
  selection_default.prototype.interrupt = interrupt_default2;
  selection_default.prototype.transition = transition_default2;

  // node_modules/d3-brush/src/brush.js
  var { abs, max, min } = Math;
  function number1(e) {
    return [+e[0], +e[1]];
  }
  function number2(e) {
    return [number1(e[0]), number1(e[1])];
  }
  var X = {
    name: "x",
    handles: ["w", "e"].map(type2),
    input: function(x, e) {
      return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]];
    },
    output: function(xy) {
      return xy && [xy[0][0], xy[1][0]];
    }
  };
  var Y = {
    name: "y",
    handles: ["n", "s"].map(type2),
    input: function(y, e) {
      return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]];
    },
    output: function(xy) {
      return xy && [xy[0][1], xy[1][1]];
    }
  };
  var XY = {
    name: "xy",
    handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type2),
    input: function(xy) {
      return xy == null ? null : number2(xy);
    },
    output: function(xy) {
      return xy;
    }
  };
  function type2(t) {
    return { type: t };
  }

  // node_modules/d3-zoom/src/constant.js
  var constant_default4 = (x) => () => x;

  // node_modules/d3-zoom/src/event.js
  function ZoomEvent(type3, {
    sourceEvent,
    target,
    transform: transform2,
    dispatch: dispatch2
  }) {
    Object.defineProperties(this, {
      type: { value: type3, enumerable: true, configurable: true },
      sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
      target: { value: target, enumerable: true, configurable: true },
      transform: { value: transform2, enumerable: true, configurable: true },
      _: { value: dispatch2 }
    });
  }

  // node_modules/d3-zoom/src/transform.js
  function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }
  Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
      return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
      return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
      return [point[0] * this.k + this.x, point[1] * this.k + this.y];
    },
    applyX: function(x) {
      return x * this.k + this.x;
    },
    applyY: function(y) {
      return y * this.k + this.y;
    },
    invert: function(location) {
      return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
    },
    invertX: function(x) {
      return (x - this.x) / this.k;
    },
    invertY: function(y) {
      return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
      return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
      return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
      return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
  };
  var identity2 = new Transform(1, 0, 0);
  transform.prototype = Transform.prototype;
  function transform(node) {
    while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
    return node.__zoom;
  }

  // node_modules/d3-zoom/src/noevent.js
  function nopropagation2(event) {
    event.stopImmediatePropagation();
  }
  function noevent_default3(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // node_modules/d3-zoom/src/zoom.js
  function defaultFilter(event) {
    return (!event.ctrlKey || event.type === "wheel") && !event.button;
  }
  function defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
      e = e.ownerSVGElement || e;
      if (e.hasAttribute("viewBox")) {
        e = e.viewBox.baseVal;
        return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
      }
      return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
    }
    return [[0, 0], [e.clientWidth, e.clientHeight]];
  }
  function defaultTransform() {
    return this.__zoom || identity2;
  }
  function defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
  }
  function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
  }
  function defaultConstrain(transform2, extent, translateExtent) {
    var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
    return transform2.translate(
      dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
      dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    );
  }
  function zoom_default2() {
    var filter3 = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
    function zoom(selection2) {
      selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    zoom.transform = function(collection, transform2, point, event) {
      var selection2 = collection.selection ? collection.selection() : collection;
      selection2.property("__zoom", defaultTransform);
      if (collection !== selection2) {
        schedule(collection, transform2, point, event);
      } else {
        selection2.interrupt().each(function() {
          gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
        });
      }
    };
    zoom.scaleBy = function(selection2, k, p, event) {
      zoom.scaleTo(selection2, function() {
        var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return k0 * k1;
      }, p, event);
    };
    zoom.scaleTo = function(selection2, k, p, event) {
      zoom.transform(selection2, function() {
        var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
        return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
      }, p, event);
    };
    zoom.translateBy = function(selection2, x, y, event) {
      zoom.transform(selection2, function() {
        return constrain(this.__zoom.translate(
          typeof x === "function" ? x.apply(this, arguments) : x,
          typeof y === "function" ? y.apply(this, arguments) : y
        ), extent.apply(this, arguments), translateExtent);
      }, null, event);
    };
    zoom.translateTo = function(selection2, x, y, p, event) {
      zoom.transform(selection2, function() {
        var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
        return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
          typeof x === "function" ? -x.apply(this, arguments) : -x,
          typeof y === "function" ? -y.apply(this, arguments) : -y
        ), e, translateExtent);
      }, p, event);
    };
    function scale(transform2, k) {
      k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
      return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
    }
    function translate(transform2, p0, p1) {
      var x = p0[0] - p1[0] * transform2.k, y = p0[1] - p1[1] * transform2.k;
      return x === transform2.x && y === transform2.y ? transform2 : new Transform(transform2.k, x, y);
    }
    function centroid(extent2) {
      return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
    }
    function schedule(transition2, transform2, point, event) {
      transition2.on("start.zoom", function() {
        gesture(this, arguments).event(event).start();
      }).on("interrupt.zoom end.zoom", function() {
        gesture(this, arguments).event(event).end();
      }).tween("zoom", function() {
        var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
        return function(t) {
          if (t === 1) t = b;
          else {
            var l = i(t), k = w / l[2];
            t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
          }
          g.zoom(null, t);
        };
      });
    }
    function gesture(that, args, clean) {
      return !clean && that.__zooming || new Gesture(that, args);
    }
    function Gesture(that, args) {
      this.that = that;
      this.args = args;
      this.active = 0;
      this.sourceEvent = null;
      this.extent = extent.apply(that, args);
      this.taps = 0;
    }
    Gesture.prototype = {
      event: function(event) {
        if (event) this.sourceEvent = event;
        return this;
      },
      start: function() {
        if (++this.active === 1) {
          this.that.__zooming = this;
          this.emit("start");
        }
        return this;
      },
      zoom: function(key, transform2) {
        if (this.mouse && key !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
        if (this.touch0 && key !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
        if (this.touch1 && key !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
        this.that.__zoom = transform2;
        this.emit("zoom");
        return this;
      },
      end: function() {
        if (--this.active === 0) {
          delete this.that.__zooming;
          this.emit("end");
        }
        return this;
      },
      emit: function(type3) {
        var d = select_default2(this.that).datum();
        listeners.call(
          type3,
          this.that,
          new ZoomEvent(type3, {
            sourceEvent: this.sourceEvent,
            target: zoom,
            type: type3,
            transform: this.that.__zoom,
            dispatch: listeners
          }),
          d
        );
      }
    };
    function wheeled(event, ...args) {
      if (!filter3.apply(this, arguments)) return;
      var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
      if (g.wheel) {
        if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
          g.mouse[1] = t.invert(g.mouse[0] = p);
        }
        clearTimeout(g.wheel);
      } else if (t.k === k) return;
      else {
        g.mouse = [p, t.invert(p)];
        interrupt_default(this);
        g.start();
      }
      noevent_default3(event);
      g.wheel = setTimeout(wheelidled, wheelDelay);
      g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
      function wheelidled() {
        g.wheel = null;
        g.end();
      }
    }
    function mousedowned(event, ...args) {
      if (touchending || !filter3.apply(this, arguments)) return;
      var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
      nodrag_default(event.view);
      nopropagation2(event);
      g.mouse = [p, this.__zoom.invert(p)];
      interrupt_default(this);
      g.start();
      function mousemoved(event2) {
        noevent_default3(event2);
        if (!g.moved) {
          var dx = event2.clientX - x0, dy = event2.clientY - y0;
          g.moved = dx * dx + dy * dy > clickDistance2;
        }
        g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
      }
      function mouseupped(event2) {
        v.on("mousemove.zoom mouseup.zoom", null);
        yesdrag(event2.view, g.moved);
        noevent_default3(event2);
        g.event(event2).end();
      }
    }
    function dblclicked(event, ...args) {
      if (!filter3.apply(this, arguments)) return;
      var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
      noevent_default3(event);
      if (duration > 0) select_default2(this).transition().duration(duration).call(schedule, t1, p0, event);
      else select_default2(this).call(zoom.transform, t1, p0, event);
    }
    function touchstarted(event, ...args) {
      if (!filter3.apply(this, arguments)) return;
      var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
      nopropagation2(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = pointer_default(t, this);
        p = [p, this.__zoom.invert(p), t.identifier];
        if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
        else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
      }
      if (touchstarting) touchstarting = clearTimeout(touchstarting);
      if (started) {
        if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
          touchstarting = null;
        }, touchDelay);
        interrupt_default(this);
        g.start();
      }
    }
    function touchmoved(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
      noevent_default3(event);
      for (i = 0; i < n; ++i) {
        t = touches[i], p = pointer_default(t, this);
        if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
        else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
      }
      t = g.that.__zoom;
      if (g.touch1) {
        var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
        t = scale(t, Math.sqrt(dp / dl));
        p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
        l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
      else return;
      g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
    function touchended(event, ...args) {
      if (!this.__zooming) return;
      var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
      nopropagation2(event);
      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() {
        touchending = null;
      }, touchDelay);
      for (i = 0; i < n; ++i) {
        t = touches[i];
        if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
        else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
      }
      if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
      if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
      else {
        g.end();
        if (g.taps === 2) {
          t = pointer_default(t, this);
          if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
            var p = select_default2(this).on("dblclick.zoom");
            if (p) p.apply(this, arguments);
          }
        }
      }
    }
    zoom.wheelDelta = function(_3) {
      return arguments.length ? (wheelDelta = typeof _3 === "function" ? _3 : constant_default4(+_3), zoom) : wheelDelta;
    };
    zoom.filter = function(_3) {
      return arguments.length ? (filter3 = typeof _3 === "function" ? _3 : constant_default4(!!_3), zoom) : filter3;
    };
    zoom.touchable = function(_3) {
      return arguments.length ? (touchable = typeof _3 === "function" ? _3 : constant_default4(!!_3), zoom) : touchable;
    };
    zoom.extent = function(_3) {
      return arguments.length ? (extent = typeof _3 === "function" ? _3 : constant_default4([[+_3[0][0], +_3[0][1]], [+_3[1][0], +_3[1][1]]]), zoom) : extent;
    };
    zoom.scaleExtent = function(_3) {
      return arguments.length ? (scaleExtent[0] = +_3[0], scaleExtent[1] = +_3[1], zoom) : [scaleExtent[0], scaleExtent[1]];
    };
    zoom.translateExtent = function(_3) {
      return arguments.length ? (translateExtent[0][0] = +_3[0][0], translateExtent[1][0] = +_3[1][0], translateExtent[0][1] = +_3[0][1], translateExtent[1][1] = +_3[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
    };
    zoom.constrain = function(_3) {
      return arguments.length ? (constrain = _3, zoom) : constrain;
    };
    zoom.duration = function(_3) {
      return arguments.length ? (duration = +_3, zoom) : duration;
    };
    zoom.interpolate = function(_3) {
      return arguments.length ? (interpolate = _3, zoom) : interpolate;
    };
    zoom.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? zoom : value;
    };
    zoom.clickDistance = function(_3) {
      return arguments.length ? (clickDistance2 = (_3 = +_3) * _3, zoom) : Math.sqrt(clickDistance2);
    };
    zoom.tapDistance = function(_3) {
      return arguments.length ? (tapDistance = +_3, zoom) : tapDistance;
    };
    return zoom;
  }

  // node_modules/underscore/modules/index.js
  var modules_exports = {};
  __export(modules_exports, {
    VERSION: () => VERSION,
    after: () => after,
    all: () => every,
    allKeys: () => allKeys,
    any: () => some,
    assign: () => extendOwn_default,
    before: () => before,
    bind: () => bind_default,
    bindAll: () => bindAll_default,
    chain: () => chain,
    chunk: () => chunk,
    clone: () => clone,
    collect: () => map2,
    compact: () => compact,
    compose: () => compose,
    constant: () => constant,
    contains: () => contains,
    countBy: () => countBy_default,
    create: () => create2,
    debounce: () => debounce,
    default: () => underscore_array_methods_default,
    defaults: () => defaults_default,
    defer: () => defer_default,
    delay: () => delay_default2,
    detect: () => find2,
    difference: () => difference_default,
    drop: () => rest,
    each: () => each,
    escape: () => escape_default,
    every: () => every,
    extend: () => extend_default,
    extendOwn: () => extendOwn_default,
    filter: () => filter2,
    find: () => find2,
    findIndex: () => findIndex_default,
    findKey: () => findKey,
    findLastIndex: () => findLastIndex_default,
    findWhere: () => findWhere,
    first: () => first,
    flatten: () => flatten2,
    foldl: () => reduce_default,
    foldr: () => reduceRight_default,
    forEach: () => each,
    functions: () => functions,
    get: () => get3,
    groupBy: () => groupBy_default,
    has: () => has2,
    head: () => first,
    identity: () => identity3,
    include: () => contains,
    includes: () => contains,
    indexBy: () => indexBy_default,
    indexOf: () => indexOf_default,
    initial: () => initial,
    inject: () => reduce_default,
    intersection: () => intersection,
    invert: () => invert,
    invoke: () => invoke_default,
    isArguments: () => isArguments_default,
    isArray: () => isArray_default,
    isArrayBuffer: () => isArrayBuffer_default,
    isBoolean: () => isBoolean2,
    isDataView: () => isDataView_default,
    isDate: () => isDate_default,
    isElement: () => isElement,
    isEmpty: () => isEmpty,
    isEqual: () => isEqual,
    isError: () => isError_default,
    isFinite: () => isFinite2,
    isFunction: () => isFunction_default,
    isMap: () => isMap_default,
    isMatch: () => isMatch,
    isNaN: () => isNaN2,
    isNull: () => isNull2,
    isNumber: () => isNumber_default,
    isObject: () => isObject2,
    isRegExp: () => isRegExp_default,
    isSet: () => isSet_default,
    isString: () => isString_default,
    isSymbol: () => isSymbol_default,
    isTypedArray: () => isTypedArray_default,
    isUndefined: () => isUndefined,
    isWeakMap: () => isWeakMap_default,
    isWeakSet: () => isWeakSet_default,
    iteratee: () => iteratee,
    keys: () => keys,
    last: () => last,
    lastIndexOf: () => lastIndexOf_default,
    map: () => map2,
    mapObject: () => mapObject,
    matcher: () => matcher,
    matches: () => matcher,
    max: () => max2,
    memoize: () => memoize,
    methods: () => functions,
    min: () => min2,
    mixin: () => mixin,
    negate: () => negate,
    noop: () => noop2,
    now: () => now_default,
    object: () => object,
    omit: () => omit_default,
    once: () => once_default,
    pairs: () => pairs2,
    partial: () => partial_default,
    partition: () => partition_default,
    pick: () => pick_default,
    pluck: () => pluck,
    property: () => property,
    propertyOf: () => propertyOf,
    random: () => random,
    range: () => range,
    reduce: () => reduce_default,
    reduceRight: () => reduceRight_default,
    reject: () => reject,
    rest: () => rest,
    restArguments: () => restArguments,
    result: () => result,
    sample: () => sample,
    select: () => filter2,
    shuffle: () => shuffle,
    size: () => size,
    some: () => some,
    sortBy: () => sortBy,
    sortedIndex: () => sortedIndex,
    tail: () => rest,
    take: () => first,
    tap: () => tap,
    template: () => template,
    templateSettings: () => templateSettings_default,
    throttle: () => throttle,
    times: () => times,
    toArray: () => toArray2,
    toPath: () => toPath,
    transpose: () => unzip,
    unescape: () => unescape_default,
    union: () => union_default,
    uniq: () => uniq,
    unique: () => uniq,
    uniqueId: () => uniqueId,
    unzip: () => unzip,
    values: () => values,
    where: () => where,
    without: () => without_default,
    wrap: () => wrap,
    zip: () => zip_default
  });

  // node_modules/underscore/modules/_setup.js
  var VERSION = "1.13.7";
  var root2 = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
  var ArrayProto = Array.prototype;
  var ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
  var push = ArrayProto.push;
  var slice = ArrayProto.slice;
  var toString2 = ObjProto.toString;
  var hasOwnProperty = ObjProto.hasOwnProperty;
  var supportsArrayBuffer = typeof ArrayBuffer !== "undefined";
  var supportsDataView = typeof DataView !== "undefined";
  var nativeIsArray = Array.isArray;
  var nativeKeys = Object.keys;
  var nativeCreate = Object.create;
  var nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
  var _isNaN = isNaN;
  var _isFinite = isFinite;
  var hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
  var nonEnumerableProps = [
    "valueOf",
    "isPrototypeOf",
    "toString",
    "propertyIsEnumerable",
    "hasOwnProperty",
    "toLocaleString"
  ];
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // node_modules/underscore/modules/restArguments.js
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0), rest2 = Array(length), index = 0;
      for (; index < length; index++) {
        rest2[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0:
          return func.call(this, rest2);
        case 1:
          return func.call(this, arguments[0], rest2);
        case 2:
          return func.call(this, arguments[0], arguments[1], rest2);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest2;
      return func.apply(this, args);
    };
  }

  // node_modules/underscore/modules/isObject.js
  function isObject2(obj) {
    var type3 = typeof obj;
    return type3 === "function" || type3 === "object" && !!obj;
  }

  // node_modules/underscore/modules/isNull.js
  function isNull2(obj) {
    return obj === null;
  }

  // node_modules/underscore/modules/isUndefined.js
  function isUndefined(obj) {
    return obj === void 0;
  }

  // node_modules/underscore/modules/isBoolean.js
  function isBoolean2(obj) {
    return obj === true || obj === false || toString2.call(obj) === "[object Boolean]";
  }

  // node_modules/underscore/modules/isElement.js
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // node_modules/underscore/modules/_tagTester.js
  function tagTester(name) {
    var tag = "[object " + name + "]";
    return function(obj) {
      return toString2.call(obj) === tag;
    };
  }

  // node_modules/underscore/modules/isString.js
  var isString_default = tagTester("String");

  // node_modules/underscore/modules/isNumber.js
  var isNumber_default = tagTester("Number");

  // node_modules/underscore/modules/isDate.js
  var isDate_default = tagTester("Date");

  // node_modules/underscore/modules/isRegExp.js
  var isRegExp_default = tagTester("RegExp");

  // node_modules/underscore/modules/isError.js
  var isError_default = tagTester("Error");

  // node_modules/underscore/modules/isSymbol.js
  var isSymbol_default = tagTester("Symbol");

  // node_modules/underscore/modules/isArrayBuffer.js
  var isArrayBuffer_default = tagTester("ArrayBuffer");

  // node_modules/underscore/modules/isFunction.js
  var isFunction = tagTester("Function");
  var nodelist = root2.document && root2.document.childNodes;
  if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") {
    isFunction = function(obj) {
      return typeof obj == "function" || false;
    };
  }
  var isFunction_default = isFunction;

  // node_modules/underscore/modules/_hasObjectTag.js
  var hasObjectTag_default = tagTester("Object");

  // node_modules/underscore/modules/_stringTagBug.js
  var hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag_default(new DataView(new ArrayBuffer(8))));
  var isIE11 = typeof Map !== "undefined" && hasObjectTag_default(/* @__PURE__ */ new Map());

  // node_modules/underscore/modules/isDataView.js
  var isDataView = tagTester("DataView");
  function alternateIsDataView(obj) {
    return obj != null && isFunction_default(obj.getInt8) && isArrayBuffer_default(obj.buffer);
  }
  var isDataView_default = hasDataViewBug ? alternateIsDataView : isDataView;

  // node_modules/underscore/modules/isArray.js
  var isArray_default = nativeIsArray || tagTester("Array");

  // node_modules/underscore/modules/_has.js
  function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  // node_modules/underscore/modules/isArguments.js
  var isArguments = tagTester("Arguments");
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has(obj, "callee");
      };
    }
  })();
  var isArguments_default = isArguments;

  // node_modules/underscore/modules/isFinite.js
  function isFinite2(obj) {
    return !isSymbol_default(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // node_modules/underscore/modules/isNaN.js
  function isNaN2(obj) {
    return isNumber_default(obj) && _isNaN(obj);
  }

  // node_modules/underscore/modules/constant.js
  function constant(value) {
    return function() {
      return value;
    };
  }

  // node_modules/underscore/modules/_createSizePropertyCheck.js
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    };
  }

  // node_modules/underscore/modules/_shallowProperty.js
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // node_modules/underscore/modules/_getByteLength.js
  var getByteLength_default = shallowProperty("byteLength");

  // node_modules/underscore/modules/_isBufferLike.js
  var isBufferLike_default = createSizePropertyCheck(getByteLength_default);

  // node_modules/underscore/modules/isTypedArray.js
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    return nativeIsView ? nativeIsView(obj) && !isDataView_default(obj) : isBufferLike_default(obj) && typedArrayPattern.test(toString2.call(obj));
  }
  var isTypedArray_default = supportsArrayBuffer ? isTypedArray : constant(false);

  // node_modules/underscore/modules/_getLength.js
  var getLength_default = shallowProperty("length");

  // node_modules/underscore/modules/_collectNonEnumProps.js
  function emulatedSet(keys2) {
    var hash = {};
    for (var l = keys2.length, i = 0; i < l; ++i) hash[keys2[i]] = true;
    return {
      contains: function(key) {
        return hash[key] === true;
      },
      push: function(key) {
        hash[key] = true;
        return keys2.push(key);
      }
    };
  }
  function collectNonEnumProps(obj, keys2) {
    keys2 = emulatedSet(keys2);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction_default(constructor) && constructor.prototype || ObjProto;
    var prop = "constructor";
    if (has(obj, prop) && !keys2.contains(prop)) keys2.push(prop);
    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys2.contains(prop)) {
        keys2.push(prop);
      }
    }
  }

  // node_modules/underscore/modules/keys.js
  function keys(obj) {
    if (!isObject2(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys2 = [];
    for (var key in obj) if (has(obj, key)) keys2.push(key);
    if (hasEnumBug) collectNonEnumProps(obj, keys2);
    return keys2;
  }

  // node_modules/underscore/modules/isEmpty.js
  function isEmpty(obj) {
    if (obj == null) return true;
    var length = getLength_default(obj);
    if (typeof length == "number" && (isArray_default(obj) || isString_default(obj) || isArguments_default(obj))) return length === 0;
    return getLength_default(keys(obj)) === 0;
  }

  // node_modules/underscore/modules/isMatch.js
  function isMatch(object2, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object2 == null) return !length;
    var obj = Object(object2);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // node_modules/underscore/modules/underscore.js
  function _(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  }
  _.VERSION = VERSION;
  _.prototype.value = function() {
    return this._wrapped;
  };
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // node_modules/underscore/modules/_toBufferView.js
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength_default(bufferSource)
    );
  }

  // node_modules/underscore/modules/isEqual.js
  var tagDataView = "[object DataView]";
  function eq(a, b, aStack, bStack) {
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    if (a == null || b == null) return false;
    if (a !== a) return b !== b;
    var type3 = typeof a;
    if (type3 !== "function" && type3 !== "object" && typeof b != "object") return false;
    return deepEq(a, b, aStack, bStack);
  }
  function deepEq(a, b, aStack, bStack) {
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    var className = toString2.call(a);
    if (className !== toString2.call(b)) return false;
    if (hasDataViewBug && className == "[object Object]" && isDataView_default(a)) {
      if (!isDataView_default(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case "[object RegExp]":
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
      case "[object Symbol]":
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case "[object ArrayBuffer]":
      case tagDataView:
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }
    var areArrays = className === "[object Array]";
    if (!areArrays && isTypedArray_default(a)) {
      var byteLength = getByteLength_default(a);
      if (byteLength !== getByteLength_default(b)) return false;
      if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
      areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != "object" || typeof b != "object") return false;
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction_default(aCtor) && aCtor instanceof aCtor && isFunction_default(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
        return false;
      }
    }
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      if (aStack[length] === a) return bStack[length] === b;
    }
    aStack.push(a);
    bStack.push(b);
    if (areArrays) {
      length = a.length;
      if (length !== b.length) return false;
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      var _keys = keys(a), key;
      length = _keys.length;
      if (keys(b).length !== length) return false;
      while (length--) {
        key = _keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    aStack.pop();
    bStack.pop();
    return true;
  }
  function isEqual(a, b) {
    return eq(a, b);
  }

  // node_modules/underscore/modules/allKeys.js
  function allKeys(obj) {
    if (!isObject2(obj)) return [];
    var keys2 = [];
    for (var key in obj) keys2.push(key);
    if (hasEnumBug) collectNonEnumProps(obj, keys2);
    return keys2;
  }

  // node_modules/underscore/modules/_methodFingerprint.js
  function ie11fingerprint(methods) {
    var length = getLength_default(methods);
    return function(obj) {
      if (obj == null) return false;
      var keys2 = allKeys(obj);
      if (getLength_default(keys2)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction_default(obj[methods[i]])) return false;
      }
      return methods !== weakMapMethods || !isFunction_default(obj[forEachName]);
    };
  }
  var forEachName = "forEach";
  var hasName = "has";
  var commonInit = ["clear", "delete"];
  var mapTail = ["get", hasName, "set"];
  var mapMethods = commonInit.concat(forEachName, mapTail);
  var weakMapMethods = commonInit.concat(mapTail);
  var setMethods = ["add"].concat(commonInit, forEachName, hasName);

  // node_modules/underscore/modules/isMap.js
  var isMap_default = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");

  // node_modules/underscore/modules/isWeakMap.js
  var isWeakMap_default = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");

  // node_modules/underscore/modules/isSet.js
  var isSet_default = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");

  // node_modules/underscore/modules/isWeakSet.js
  var isWeakSet_default = tagTester("WeakSet");

  // node_modules/underscore/modules/values.js
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values2 = Array(length);
    for (var i = 0; i < length; i++) {
      values2[i] = obj[_keys[i]];
    }
    return values2;
  }

  // node_modules/underscore/modules/pairs.js
  function pairs2(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs3 = Array(length);
    for (var i = 0; i < length; i++) {
      pairs3[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs3;
  }

  // node_modules/underscore/modules/invert.js
  function invert(obj) {
    var result2 = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result2[obj[_keys[i]]] = _keys[i];
    }
    return result2;
  }

  // node_modules/underscore/modules/functions.js
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction_default(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // node_modules/underscore/modules/_createAssigner.js
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index], keys2 = keysFunc(source), l = keys2.length;
        for (var i = 0; i < l; i++) {
          var key = keys2[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // node_modules/underscore/modules/extend.js
  var extend_default = createAssigner(allKeys);

  // node_modules/underscore/modules/extendOwn.js
  var extendOwn_default = createAssigner(keys);

  // node_modules/underscore/modules/defaults.js
  var defaults_default = createAssigner(allKeys, true);

  // node_modules/underscore/modules/_baseCreate.js
  function ctor() {
    return function() {
    };
  }
  function baseCreate(prototype) {
    if (!isObject2(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result2 = new Ctor();
    Ctor.prototype = null;
    return result2;
  }

  // node_modules/underscore/modules/create.js
  function create2(prototype, props) {
    var result2 = baseCreate(prototype);
    if (props) extendOwn_default(result2, props);
    return result2;
  }

  // node_modules/underscore/modules/clone.js
  function clone(obj) {
    if (!isObject2(obj)) return obj;
    return isArray_default(obj) ? obj.slice() : extend_default({}, obj);
  }

  // node_modules/underscore/modules/tap.js
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // node_modules/underscore/modules/toPath.js
  function toPath(path) {
    return isArray_default(path) ? path : [path];
  }
  _.toPath = toPath;

  // node_modules/underscore/modules/_toPath.js
  function toPath2(path) {
    return _.toPath(path);
  }

  // node_modules/underscore/modules/_deepGet.js
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // node_modules/underscore/modules/get.js
  function get3(object2, path, defaultValue) {
    var value = deepGet(object2, toPath2(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // node_modules/underscore/modules/has.js
  function has2(obj, path) {
    path = toPath2(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // node_modules/underscore/modules/identity.js
  function identity3(value) {
    return value;
  }

  // node_modules/underscore/modules/matcher.js
  function matcher(attrs) {
    attrs = extendOwn_default({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // node_modules/underscore/modules/property.js
  function property(path) {
    path = toPath2(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // node_modules/underscore/modules/_optimizeCb.js
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      // The 2-argument case is omitted because we’re not using it.
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // node_modules/underscore/modules/_baseIteratee.js
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity3;
    if (isFunction_default(value)) return optimizeCb(value, context, argCount);
    if (isObject2(value) && !isArray_default(value)) return matcher(value);
    return property(value);
  }

  // node_modules/underscore/modules/iteratee.js
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _.iteratee = iteratee;

  // node_modules/underscore/modules/_cb.js
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee) return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // node_modules/underscore/modules/mapObject.js
  function mapObject(obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context);
    var _keys = keys(obj), length = _keys.length, results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee2(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // node_modules/underscore/modules/noop.js
  function noop2() {
  }

  // node_modules/underscore/modules/propertyOf.js
  function propertyOf(obj) {
    if (obj == null) return noop2;
    return function(path) {
      return get3(obj, path);
    };
  }

  // node_modules/underscore/modules/times.js
  function times(n, iteratee2, context) {
    var accum = Array(Math.max(0, n));
    iteratee2 = optimizeCb(iteratee2, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee2(i);
    return accum;
  }

  // node_modules/underscore/modules/random.js
  function random(min3, max3) {
    if (max3 == null) {
      max3 = min3;
      min3 = 0;
    }
    return min3 + Math.floor(Math.random() * (max3 - min3 + 1));
  }

  // node_modules/underscore/modules/now.js
  var now_default = Date.now || function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };

  // node_modules/underscore/modules/_createEscaper.js
  function createEscaper(map3) {
    var escaper = function(match) {
      return map3[match];
    };
    var source = "(?:" + keys(map3).join("|") + ")";
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, "g");
    return function(string) {
      string = string == null ? "" : "" + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // node_modules/underscore/modules/_escapeMap.js
  var escapeMap_default = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  // node_modules/underscore/modules/escape.js
  var escape_default = createEscaper(escapeMap_default);

  // node_modules/underscore/modules/_unescapeMap.js
  var unescapeMap_default = invert(escapeMap_default);

  // node_modules/underscore/modules/unescape.js
  var unescape_default = createEscaper(unescapeMap_default);

  // node_modules/underscore/modules/templateSettings.js
  var templateSettings_default = _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // node_modules/underscore/modules/template.js
  var noMatch = /(.)^/;
  var escapes = {
    "'": "'",
    "\\": "\\",
    "\r": "r",
    "\n": "n",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  function escapeChar(match) {
    return "\\" + escapes[match];
  }
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults_default({}, settings, _.templateSettings);
    var matcher2 = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join("|") + "|$", "g");
    var index = 0;
    var source = "__p+='";
    text.replace(matcher2, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;
      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      return match;
    });
    source += "';\n";
    var argument = settings.variable;
    if (argument) {
      if (!bareIdentifier.test(argument)) throw new Error(
        "variable is not a bare identifier: " + argument
      );
    } else {
      source = "with(obj||{}){\n" + source + "}\n";
      argument = "obj";
    }
    source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
    var render;
    try {
      render = new Function(argument, "_", source);
    } catch (e) {
      e.source = source;
      throw e;
    }
    var template2 = function(data) {
      return render.call(this, data, _);
    };
    template2.source = "function(" + argument + "){\n" + source + "}";
    return template2;
  }

  // node_modules/underscore/modules/result.js
  function result(obj, path, fallback) {
    path = toPath2(path);
    var length = path.length;
    if (!length) {
      return isFunction_default(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length;
      }
      obj = isFunction_default(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // node_modules/underscore/modules/uniqueId.js
  var idCounter = 0;
  function uniqueId(prefix) {
    var id2 = ++idCounter + "";
    return prefix ? prefix + id2 : id2;
  }

  // node_modules/underscore/modules/chain.js
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // node_modules/underscore/modules/_executeBound.js
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self2 = baseCreate(sourceFunc.prototype);
    var result2 = sourceFunc.apply(self2, args);
    if (isObject2(result2)) return result2;
    return self2;
  }

  // node_modules/underscore/modules/partial.js
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });
  partial.placeholder = _;
  var partial_default = partial;

  // node_modules/underscore/modules/bind.js
  var bind_default = restArguments(function(func, context, args) {
    if (!isFunction_default(func)) throw new TypeError("Bind must be called on a function");
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // node_modules/underscore/modules/_isArrayLike.js
  var isArrayLike_default = createSizePropertyCheck(getLength_default);

  // node_modules/underscore/modules/_flatten.js
  function flatten(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength_default(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike_default(value) && (isArray_default(value) || isArguments_default(value))) {
        if (depth > 1) {
          flatten(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // node_modules/underscore/modules/bindAll.js
  var bindAll_default = restArguments(function(obj, keys2) {
    keys2 = flatten(keys2, false, false);
    var index = keys2.length;
    if (index < 1) throw new Error("bindAll must be passed function names");
    while (index--) {
      var key = keys2[index];
      obj[key] = bind_default(obj[key], obj);
    }
    return obj;
  });

  // node_modules/underscore/modules/memoize.js
  function memoize(func, hasher) {
    var memoize2 = function(key) {
      var cache = memoize2.cache;
      var address = "" + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize2.cache = {};
    return memoize2;
  }

  // node_modules/underscore/modules/delay.js
  var delay_default2 = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // node_modules/underscore/modules/defer.js
  var defer_default = partial_default(delay_default2, _, 1);

  // node_modules/underscore/modules/throttle.js
  function throttle(func, wait, options) {
    var timeout2, context, args, result2;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : now_default();
      timeout2 = null;
      result2 = func.apply(context, args);
      if (!timeout2) context = args = null;
    };
    var throttled = function() {
      var _now = now_default();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout2) {
          clearTimeout(timeout2);
          timeout2 = null;
        }
        previous = _now;
        result2 = func.apply(context, args);
        if (!timeout2) context = args = null;
      } else if (!timeout2 && options.trailing !== false) {
        timeout2 = setTimeout(later, remaining);
      }
      return result2;
    };
    throttled.cancel = function() {
      clearTimeout(timeout2);
      previous = 0;
      timeout2 = context = args = null;
    };
    return throttled;
  }

  // node_modules/underscore/modules/debounce.js
  function debounce(func, wait, immediate) {
    var timeout2, previous, args, result2, context;
    var later = function() {
      var passed = now_default() - previous;
      if (wait > passed) {
        timeout2 = setTimeout(later, wait - passed);
      } else {
        timeout2 = null;
        if (!immediate) result2 = func.apply(context, args);
        if (!timeout2) args = context = null;
      }
    };
    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now_default();
      if (!timeout2) {
        timeout2 = setTimeout(later, wait);
        if (immediate) result2 = func.apply(context, args);
      }
      return result2;
    });
    debounced.cancel = function() {
      clearTimeout(timeout2);
      timeout2 = args = context = null;
    };
    return debounced;
  }

  // node_modules/underscore/modules/wrap.js
  function wrap(func, wrapper) {
    return partial_default(wrapper, func);
  }

  // node_modules/underscore/modules/negate.js
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // node_modules/underscore/modules/compose.js
  function compose() {
    var args = arguments;
    var start2 = args.length - 1;
    return function() {
      var i = start2;
      var result2 = args[start2].apply(this, arguments);
      while (i--) result2 = args[i].call(this, result2);
      return result2;
    };
  }

  // node_modules/underscore/modules/after.js
  function after(times2, func) {
    return function() {
      if (--times2 < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // node_modules/underscore/modules/before.js
  function before(times2, func) {
    var memo;
    return function() {
      if (--times2 > 0) {
        memo = func.apply(this, arguments);
      }
      if (times2 <= 1) func = null;
      return memo;
    };
  }

  // node_modules/underscore/modules/once.js
  var once_default = partial_default(before, 2);

  // node_modules/underscore/modules/findKey.js
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // node_modules/underscore/modules/_createPredicateIndexFinder.js
  function createPredicateIndexFinder(dir) {
    return function(array2, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength_default(array2);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array2[index], index, array2)) return index;
      }
      return -1;
    };
  }

  // node_modules/underscore/modules/findIndex.js
  var findIndex_default = createPredicateIndexFinder(1);

  // node_modules/underscore/modules/findLastIndex.js
  var findLastIndex_default = createPredicateIndexFinder(-1);

  // node_modules/underscore/modules/sortedIndex.js
  function sortedIndex(array2, obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context, 1);
    var value = iteratee2(obj);
    var low = 0, high = getLength_default(array2);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee2(array2[mid]) < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // node_modules/underscore/modules/_createIndexFinder.js
  function createIndexFinder(dir, predicateFind, sortedIndex2) {
    return function(array2, item, idx) {
      var i = 0, length = getLength_default(array2);
      if (typeof idx == "number") {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex2 && idx && length) {
        idx = sortedIndex2(array2, item);
        return array2[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array2, i, length), isNaN2);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array2[idx] === item) return idx;
      }
      return -1;
    };
  }

  // node_modules/underscore/modules/indexOf.js
  var indexOf_default = createIndexFinder(1, findIndex_default, sortedIndex);

  // node_modules/underscore/modules/lastIndexOf.js
  var lastIndexOf_default = createIndexFinder(-1, findLastIndex_default);

  // node_modules/underscore/modules/find.js
  function find2(obj, predicate, context) {
    var keyFinder = isArrayLike_default(obj) ? findIndex_default : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // node_modules/underscore/modules/findWhere.js
  function findWhere(obj, attrs) {
    return find2(obj, matcher(attrs));
  }

  // node_modules/underscore/modules/each.js
  function each(obj, iteratee2, context) {
    iteratee2 = optimizeCb(iteratee2, context);
    var i, length;
    if (isArrayLike_default(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee2(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee2(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // node_modules/underscore/modules/map.js
  function map2(obj, iteratee2, context) {
    iteratee2 = cb(iteratee2, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee2(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // node_modules/underscore/modules/_createReduce.js
  function createReduce(dir) {
    var reducer = function(obj, iteratee2, memo, initial2) {
      var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
      if (!initial2) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee2(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };
    return function(obj, iteratee2, memo, context) {
      var initial2 = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee2, context, 4), memo, initial2);
    };
  }

  // node_modules/underscore/modules/reduce.js
  var reduce_default = createReduce(1);

  // node_modules/underscore/modules/reduceRight.js
  var reduceRight_default = createReduce(-1);

  // node_modules/underscore/modules/filter.js
  function filter2(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // node_modules/underscore/modules/reject.js
  function reject(obj, predicate, context) {
    return filter2(obj, negate(cb(predicate)), context);
  }

  // node_modules/underscore/modules/every.js
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // node_modules/underscore/modules/some.js
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // node_modules/underscore/modules/contains.js
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike_default(obj)) obj = values(obj);
    if (typeof fromIndex != "number" || guard) fromIndex = 0;
    return indexOf_default(obj, item, fromIndex) >= 0;
  }

  // node_modules/underscore/modules/invoke.js
  var invoke_default = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction_default(path)) {
      func = path;
    } else {
      path = toPath2(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map2(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // node_modules/underscore/modules/pluck.js
  function pluck(obj, key) {
    return map2(obj, property(key));
  }

  // node_modules/underscore/modules/where.js
  function where(obj, attrs) {
    return filter2(obj, matcher(attrs));
  }

  // node_modules/underscore/modules/max.js
  function max2(obj, iteratee2, context) {
    var result2 = -Infinity, lastComputed = -Infinity, value, computed;
    if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
      obj = isArrayLike_default(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result2) {
          result2 = value;
        }
      }
    } else {
      iteratee2 = cb(iteratee2, context);
      each(obj, function(v, index, list) {
        computed = iteratee2(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result2 === -Infinity) {
          result2 = v;
          lastComputed = computed;
        }
      });
    }
    return result2;
  }

  // node_modules/underscore/modules/min.js
  function min2(obj, iteratee2, context) {
    var result2 = Infinity, lastComputed = Infinity, value, computed;
    if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
      obj = isArrayLike_default(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result2) {
          result2 = value;
        }
      }
    } else {
      iteratee2 = cb(iteratee2, context);
      each(obj, function(v, index, list) {
        computed = iteratee2(v, index, list);
        if (computed < lastComputed || computed === Infinity && result2 === Infinity) {
          result2 = v;
          lastComputed = computed;
        }
      });
    }
    return result2;
  }

  // node_modules/underscore/modules/toArray.js
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray2(obj) {
    if (!obj) return [];
    if (isArray_default(obj)) return slice.call(obj);
    if (isString_default(obj)) {
      return obj.match(reStrSymbol);
    }
    if (isArrayLike_default(obj)) return map2(obj, identity3);
    return values(obj);
  }

  // node_modules/underscore/modules/sample.js
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike_default(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample2 = toArray2(obj);
    var length = getLength_default(sample2);
    n = Math.max(Math.min(n, length), 0);
    var last2 = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last2);
      var temp = sample2[index];
      sample2[index] = sample2[rand];
      sample2[rand] = temp;
    }
    return sample2.slice(0, n);
  }

  // node_modules/underscore/modules/shuffle.js
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // node_modules/underscore/modules/sortBy.js
  function sortBy(obj, iteratee2, context) {
    var index = 0;
    iteratee2 = cb(iteratee2, context);
    return pluck(map2(obj, function(value, key, list) {
      return {
        value,
        index: index++,
        criteria: iteratee2(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), "value");
  }

  // node_modules/underscore/modules/_group.js
  function group(behavior, partition) {
    return function(obj, iteratee2, context) {
      var result2 = partition ? [[], []] : {};
      iteratee2 = cb(iteratee2, context);
      each(obj, function(value, index) {
        var key = iteratee2(value, index, obj);
        behavior(result2, value, key);
      });
      return result2;
    };
  }

  // node_modules/underscore/modules/groupBy.js
  var groupBy_default = group(function(result2, value, key) {
    if (has(result2, key)) result2[key].push(value);
    else result2[key] = [value];
  });

  // node_modules/underscore/modules/indexBy.js
  var indexBy_default = group(function(result2, value, key) {
    result2[key] = value;
  });

  // node_modules/underscore/modules/countBy.js
  var countBy_default = group(function(result2, value, key) {
    if (has(result2, key)) result2[key]++;
    else result2[key] = 1;
  });

  // node_modules/underscore/modules/partition.js
  var partition_default = group(function(result2, value, pass) {
    result2[pass ? 0 : 1].push(value);
  }, true);

  // node_modules/underscore/modules/size.js
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike_default(obj) ? obj.length : keys(obj).length;
  }

  // node_modules/underscore/modules/_keyInObj.js
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // node_modules/underscore/modules/pick.js
  var pick_default = restArguments(function(obj, keys2) {
    var result2 = {}, iteratee2 = keys2[0];
    if (obj == null) return result2;
    if (isFunction_default(iteratee2)) {
      if (keys2.length > 1) iteratee2 = optimizeCb(iteratee2, keys2[1]);
      keys2 = allKeys(obj);
    } else {
      iteratee2 = keyInObj;
      keys2 = flatten(keys2, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys2.length; i < length; i++) {
      var key = keys2[i];
      var value = obj[key];
      if (iteratee2(value, key, obj)) result2[key] = value;
    }
    return result2;
  });

  // node_modules/underscore/modules/omit.js
  var omit_default = restArguments(function(obj, keys2) {
    var iteratee2 = keys2[0], context;
    if (isFunction_default(iteratee2)) {
      iteratee2 = negate(iteratee2);
      if (keys2.length > 1) context = keys2[1];
    } else {
      keys2 = map2(flatten(keys2, false, false), String);
      iteratee2 = function(value, key) {
        return !contains(keys2, key);
      };
    }
    return pick_default(obj, iteratee2, context);
  });

  // node_modules/underscore/modules/initial.js
  function initial(array2, n, guard) {
    return slice.call(array2, 0, Math.max(0, array2.length - (n == null || guard ? 1 : n)));
  }

  // node_modules/underscore/modules/first.js
  function first(array2, n, guard) {
    if (array2 == null || array2.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array2[0];
    return initial(array2, array2.length - n);
  }

  // node_modules/underscore/modules/rest.js
  function rest(array2, n, guard) {
    return slice.call(array2, n == null || guard ? 1 : n);
  }

  // node_modules/underscore/modules/last.js
  function last(array2, n, guard) {
    if (array2 == null || array2.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array2[array2.length - 1];
    return rest(array2, Math.max(0, array2.length - n));
  }

  // node_modules/underscore/modules/compact.js
  function compact(array2) {
    return filter2(array2, Boolean);
  }

  // node_modules/underscore/modules/flatten.js
  function flatten2(array2, depth) {
    return flatten(array2, depth, false);
  }

  // node_modules/underscore/modules/difference.js
  var difference_default = restArguments(function(array2, rest2) {
    rest2 = flatten(rest2, true, true);
    return filter2(array2, function(value) {
      return !contains(rest2, value);
    });
  });

  // node_modules/underscore/modules/without.js
  var without_default = restArguments(function(array2, otherArrays) {
    return difference_default(array2, otherArrays);
  });

  // node_modules/underscore/modules/uniq.js
  function uniq(array2, isSorted, iteratee2, context) {
    if (!isBoolean2(isSorted)) {
      context = iteratee2;
      iteratee2 = isSorted;
      isSorted = false;
    }
    if (iteratee2 != null) iteratee2 = cb(iteratee2, context);
    var result2 = [];
    var seen = [];
    for (var i = 0, length = getLength_default(array2); i < length; i++) {
      var value = array2[i], computed = iteratee2 ? iteratee2(value, i, array2) : value;
      if (isSorted && !iteratee2) {
        if (!i || seen !== computed) result2.push(value);
        seen = computed;
      } else if (iteratee2) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result2.push(value);
        }
      } else if (!contains(result2, value)) {
        result2.push(value);
      }
    }
    return result2;
  }

  // node_modules/underscore/modules/union.js
  var union_default = restArguments(function(arrays) {
    return uniq(flatten(arrays, true, true));
  });

  // node_modules/underscore/modules/intersection.js
  function intersection(array2) {
    var result2 = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength_default(array2); i < length; i++) {
      var item = array2[i];
      if (contains(result2, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result2.push(item);
    }
    return result2;
  }

  // node_modules/underscore/modules/unzip.js
  function unzip(array2) {
    var length = array2 && max2(array2, getLength_default).length || 0;
    var result2 = Array(length);
    for (var index = 0; index < length; index++) {
      result2[index] = pluck(array2, index);
    }
    return result2;
  }

  // node_modules/underscore/modules/zip.js
  var zip_default = restArguments(unzip);

  // node_modules/underscore/modules/object.js
  function object(list, values2) {
    var result2 = {};
    for (var i = 0, length = getLength_default(list); i < length; i++) {
      if (values2) {
        result2[list[i]] = values2[i];
      } else {
        result2[list[i][0]] = list[i][1];
      }
    }
    return result2;
  }

  // node_modules/underscore/modules/range.js
  function range(start2, stop, step) {
    if (stop == null) {
      stop = start2 || 0;
      start2 = 0;
    }
    if (!step) {
      step = stop < start2 ? -1 : 1;
    }
    var length = Math.max(Math.ceil((stop - start2) / step), 0);
    var range2 = Array(length);
    for (var idx = 0; idx < length; idx++, start2 += step) {
      range2[idx] = start2;
    }
    return range2;
  }

  // node_modules/underscore/modules/chunk.js
  function chunk(array2, count) {
    if (count == null || count < 1) return [];
    var result2 = [];
    var i = 0, length = array2.length;
    while (i < length) {
      result2.push(slice.call(array2, i, i += count));
    }
    return result2;
  }

  // node_modules/underscore/modules/_chainResult.js
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  // node_modules/underscore/modules/mixin.js
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  // node_modules/underscore/modules/underscore-array-methods.js
  each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === "shift" || name === "splice") && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });
  each(["concat", "join", "slice"], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });
  var underscore_array_methods_default = _;

  // node_modules/underscore/modules/index-default.js
  var _2 = mixin(modules_exports);
  _2._ = _2;

  // src/webview/graph.ts
  var KEY_HEIGHT = 20;
  var KEY_SPACING = 10;
  var RANK_GROUP_SPACING = 50;
  var NODE_PADDING = 5;
  var Graph = class {
    constructor() {
      this._nodes = {};
      this._edges = [];
    }
    setNode(id2, value) {
      this._nodes[id2] = value;
    }
    removeNode(id2) {
      const node = this._nodes[id2];
      if (!node) return;
      for (let i = 0; i < node._inEdges.length; i++) {
        const edge = node._inEdges[i];
        const sourceNode = edge.source.node;
        const idx = sourceNode._outEdges.indexOf(edge);
        sourceNode._outEdges.splice(idx, 1);
        const graphIdx = this._edges.indexOf(edge);
        this._edges.splice(graphIdx, 1);
      }
      for (let i = 0; i < node._outEdges.length; i++) {
        const edge = node._outEdges[i];
        const targetNode = edge.target.node;
        const idx = targetNode._inEdges.indexOf(edge);
        targetNode._inEdges.splice(idx, 1);
        const graphIdx = this._edges.indexOf(edge);
        this._edges.splice(graphIdx, 1);
      }
      delete this._nodes[id2];
    }
    addEdge(sourceId, targetId, key, customData) {
      const source = this._nodes[sourceId];
      if (source === void 0) {
        throw new Error(`source node does not exist: ${sourceId}`);
      }
      const target = this._nodes[targetId];
      if (target === void 0) {
        throw new Error(`target node does not exist: ${targetId}`);
      }
      for (let i = 0; i < target._inEdges.length; i++) {
        if (target._inEdges[i].source.node.id === source.id) {
          return;
        }
      }
      if (source._edgeKeys.indexOf(key) === -1) {
        source._edgeKeys.push(key);
      }
      if (target._edgeKeys.indexOf(key) === -1) {
        target._edgeKeys.push(key);
      }
      let edgeSource = source._edgeSources[key];
      if (!edgeSource) {
        edgeSource = new EdgeSource(source, key);
        source._edgeSources[key] = edgeSource;
      }
      let edgeTarget = target._edgeTargets[key];
      if (!edgeTarget) {
        edgeTarget = new EdgeTarget(target, key);
        target._edgeTargets[key] = edgeTarget;
      }
      const edge = new Edge(edgeSource, edgeTarget, key, customData);
      target._inEdges.push(edge);
      source._outEdges.push(edge);
      this._edges.push(edge);
    }
    removeEdge(edge) {
      const inIdx = edge.target.node._inEdges.indexOf(edge);
      edge.target.node._inEdges.splice(inIdx, 1);
      const outIdx = edge.source.node._outEdges.indexOf(edge);
      edge.source.node._outEdges.splice(outIdx, 1);
      const graphIdx = this._edges.indexOf(edge);
      this._edges.splice(graphIdx, 1);
    }
    node(id2) {
      return this._nodes[id2];
    }
    nodes() {
      const nodes = [];
      for (const id2 in this._nodes) {
        nodes.push(this._nodes[id2]);
      }
      return nodes;
    }
    edges() {
      return this._edges;
    }
    layout() {
      const rankGroups = [];
      for (const id2 in this._nodes) {
        const node = this._nodes[id2];
        const rankGroupIdx = node.rank();
        let rankGroup = rankGroups[rankGroupIdx];
        if (!rankGroup) {
          rankGroup = new RankGroup(rankGroupIdx);
          rankGroups[rankGroupIdx] = rankGroup;
        }
        rankGroup.nodes.push(node);
      }
      for (const id2 in this._nodes) {
        const node = this._nodes[id2];
        const rankGroup = node.rank();
        let rankGroupOffset = 0;
        for (let c = 0; c < rankGroups.length; c++) {
          if (c < rankGroup && rankGroups[c]) {
            rankGroupOffset += rankGroups[c].width() + RANK_GROUP_SPACING;
          }
        }
        node._position.x = rankGroupOffset + (rankGroups[rankGroup].width() - node.width()) / 2;
        node._edgeKeys.sort((a, b) => {
          const targetA = node._edgeTargets[a];
          const targetB = node._edgeTargets[b];
          if (targetA && !targetB) {
            return -1;
          } else if (!targetA && targetB) {
            return 1;
          }
          if (targetA && targetB) {
            const introRankA = targetA.rankOfFirstAppearance();
            const introRankB = targetB.rankOfFirstAppearance();
            if (introRankA < introRankB) {
              return -1;
            } else if (introRankA > introRankB) {
              return 1;
            }
          }
          const sourceA = node._edgeSources[a];
          const sourceB = node._edgeSources[b];
          if (sourceA && !sourceB) {
            return -1;
          } else if (!sourceA && sourceB) {
            return 1;
          }
          return compareNames(a, b);
        });
      }
      for (let repeat2 = 0; repeat2 < 2; repeat2++) {
        for (let c = 0; c < rankGroups.length; c++) {
          if (rankGroups[c]) {
            rankGroups[c].sortNodes();
            rankGroups[c].layout();
          }
        }
      }
      let anyChanged = true;
      while (anyChanged) {
        anyChanged = false;
        for (let c = 0; c < rankGroups.length; c++) {
          if (rankGroups[c] && rankGroups[c].tug()) {
            anyChanged = true;
          }
        }
      }
    }
    computeRanks() {
      let forwardNodes = {};
      for (const n in this._nodes) {
        const node = this._nodes[n];
        if (node._inEdges.length === 0) {
          node._cachedRank = 0;
          forwardNodes[node.id] = node;
        }
      }
      const bottomNodes = {};
      while (!objectIsEmpty(forwardNodes)) {
        let nextNodes = {};
        for (const n in forwardNodes) {
          const node = forwardNodes[n];
          if (node._outEdges.length === 0) {
            bottomNodes[node.id] = node;
          }
          for (let e = 0; e < node._outEdges.length; e++) {
            const nextNode = node._outEdges[e].target.node;
            nextNode._cachedRank = Math.max(nextNode._cachedRank, node._cachedRank + 1);
            nextNodes[nextNode.id] = nextNode;
          }
        }
        forwardNodes = nextNodes;
      }
      let backwardNodes = bottomNodes;
      while (!objectIsEmpty(backwardNodes)) {
        const prevNodes = {};
        for (const n in backwardNodes) {
          const node = backwardNodes[n];
          for (let e = 0; e < node._inEdges.length; e++) {
            const prevNode = node._inEdges[e].source.node;
            const latestRank = prevNode.latestPossibleRank();
            if (latestRank !== void 0) {
              prevNode._cachedRank = latestRank;
            }
            prevNodes[prevNode.id] = prevNode;
          }
        }
        backwardNodes = prevNodes;
      }
    }
    collapseEquivalentNodes() {
      const nodesByRank = [];
      for (const n in this._nodes) {
        const node = this._nodes[n];
        if (node.equivalentBy === void 0) {
          continue;
        }
        let byRank = nodesByRank[node.rank()];
        if (byRank === void 0) {
          byRank = {};
          nodesByRank[node.rank()] = byRank;
        }
        let byEqv = byRank[node.equivalentBy];
        if (byEqv === void 0) {
          byEqv = [];
          byRank[node.equivalentBy] = byEqv;
        }
        byEqv.push(node);
      }
      for (const r in nodesByRank) {
        const byEqv = nodesByRank[r];
        for (const e in byEqv) {
          const nodes = byEqv[e];
          if (nodes.length === 1) {
            continue;
          }
          const chosenOne = nodes[0];
          for (let i = 1; i < nodes.length; i++) {
            const loser = nodes[i];
            for (let ie = 0; ie < loser._inEdges.length; ie++) {
              const edge = loser._inEdges[ie];
              this.addEdge(edge.source.node.id, chosenOne.id, edge.key, edge.customData);
            }
            for (let oe = 0; oe < loser._outEdges.length; oe++) {
              const edge = loser._outEdges[oe];
              this.addEdge(chosenOne.id, edge.target.node.id, edge.key, edge.customData);
            }
            this.removeNode(loser.id);
          }
        }
      }
    }
    addSpacingNodes() {
      const edgesToRemove = [];
      for (let e = 0; e < this._edges.length; e++) {
        const edge = this._edges[e];
        const delta = edge.target.node.rank() - edge.source.node.rank();
        if (delta > 1) {
          let upstreamNode = edge.source.node;
          const downstreamNode = edge.target.node;
          let repeatedNode;
          let initialCustomData;
          let finalCustomData;
          if (edge.source.node.repeatable) {
            repeatedNode = upstreamNode;
            initialCustomData = null;
            finalCustomData = edge.customData;
          } else {
            repeatedNode = downstreamNode;
            initialCustomData = edge.customData;
            finalCustomData = null;
          }
          for (let i = 0; i < delta - 1; i++) {
            const spacerID = edge.id() + "-spacing-" + i;
            let spacingNode = this.node(spacerID);
            if (!spacingNode) {
              spacingNode = repeatedNode.copy();
              spacingNode.id = spacerID;
              spacingNode._cachedRank = upstreamNode.rank() + 1;
              this.setNode(spacingNode.id, spacingNode);
            }
            const currentCustomData = i === 0 ? initialCustomData : null;
            this.addEdge(upstreamNode.id, spacingNode.id, edge.key, currentCustomData);
            upstreamNode = spacingNode;
          }
          this.addEdge(upstreamNode.id, edge.target.node.id, edge.key, finalCustomData);
          edgesToRemove.push(edge);
        }
      }
      for (let e = 0; e < edgesToRemove.length; e++) {
        this.removeEdge(edgesToRemove[e]);
      }
    }
  };
  var GraphNode = class _GraphNode {
    constructor(opts) {
      this._edgeTargets = {};
      this._edgeSources = {};
      this._edgeKeys = [];
      this._inEdges = [];
      this._outEdges = [];
      this._cachedRank = -1;
      this._cachedWidth = 0;
      this._keyOffset = 0;
      this._position = { x: 0, y: 0 };
      this.id = opts.id;
      this.name = opts.name;
      this.class = opts.class || "";
      this.status = opts.status;
      this.repeatable = opts.repeatable;
      this.key = opts.key;
      this.url = opts.url;
      this.svg = opts.svg;
      this.equivalentBy = opts.equivalentBy;
    }
    copy() {
      return new _GraphNode({
        id: this.id,
        name: this.name,
        class: this.class,
        status: this.status,
        repeatable: this.repeatable,
        key: this.key,
        url: this.url,
        svg: this.svg,
        equivalentBy: this.equivalentBy
      });
    }
    width() {
      if (this._cachedWidth === 0 && this.svg) {
        const id2 = this.id;
        const svgNode2 = this.svg.selectAll("g.node").filter(function(node) {
          return node.id === id2;
        });
        const textNode = svgNode2.select("text").node();
        if (textNode) {
          this._cachedWidth = textNode.getBBox().width;
        } else {
          return 0;
        }
      }
      return this._cachedWidth + NODE_PADDING * 2;
    }
    height() {
      const keys2 = Math.max(this._edgeKeys.length, 1);
      return KEY_HEIGHT * keys2 + KEY_SPACING * (keys2 - 1);
    }
    position() {
      return {
        x: this._position.x,
        y: (KEY_HEIGHT + KEY_SPACING) * this._keyOffset
      };
    }
    animationRadius() {
      if (this.class.search("job") > -1) {
        return 70;
      }
      return 0;
    }
    rank() {
      return this._cachedRank;
    }
    latestPossibleRank() {
      let latestRank;
      for (let o = 0; o < this._outEdges.length; o++) {
        const prevTargetNode = this._outEdges[o].target.node;
        const targetPrecedingRank = prevTargetNode.rank() - 1;
        if (latestRank === void 0) {
          latestRank = targetPrecedingRank;
        } else {
          latestRank = Math.min(latestRank, targetPrecedingRank);
        }
      }
      return latestRank;
    }
    dependsOn(node, stack = []) {
      for (let i = 0; i < this._inEdges.length; i++) {
        const source = this._inEdges[i].source.node;
        if (source === node) {
          return true;
        }
        if (stack.indexOf(this) !== -1) {
          continue;
        }
        stack.push(this);
        if (source.dependsOn(node, stack)) {
          return true;
        }
      }
      return false;
    }
    highestUpstreamSource() {
      let minY;
      for (let e = 0; e < this._inEdges.length; e++) {
        const y = this._inEdges[e].source.effectiveKeyOffset();
        if (minY === void 0 || y < minY) {
          minY = y;
        }
      }
      return minY;
    }
    highestDownstreamTarget() {
      let minY;
      for (let e = 0; e < this._outEdges.length; e++) {
        const y = this._outEdges[e].target.effectiveKeyOffset();
        if (minY === void 0 || y < minY) {
          minY = y;
        }
      }
      return minY;
    }
    inAlignment() {
      let minAlignment;
      for (let e = 0; e < this._inEdges.length; e++) {
        const edge = this._inEdges[e];
        const offset = edge.source.effectiveKeyOffset();
        if (minAlignment === void 0 || offset < minAlignment) {
          minAlignment = offset - this._edgeKeys.indexOf(edge.key);
        }
      }
      return minAlignment;
    }
    outAlignment() {
      let minAlignment;
      for (let e = 0; e < this._outEdges.length; e++) {
        const edge = this._outEdges[e];
        const offset = edge.target.effectiveKeyOffset();
        if (minAlignment === void 0 || offset < minAlignment) {
          minAlignment = offset - this._edgeKeys.indexOf(edge.key);
        }
      }
      return minAlignment;
    }
    passedThroughAnyPreviousNode() {
      for (let e = 0; e < this._inEdges.length; e++) {
        const edge = this._inEdges[e];
        if (edge.key in edge.source.node._edgeTargets) {
          return true;
        }
      }
      return false;
    }
    passesThroughAnyNextNode() {
      for (let e = 0; e < this._outEdges.length; e++) {
        const edge = this._outEdges[e];
        if (edge.key in edge.target.node._edgeSources) {
          return true;
        }
      }
      return false;
    }
  };
  var Ordering = class {
    constructor() {
      this.spaces = [];
    }
    fill(pos, len) {
      for (let i = pos; i < pos + len; i++) {
        this.spaces[i] = true;
      }
    }
    free(pos, len) {
      for (let i = pos; i < pos + len; i++) {
        this.spaces[i] = false;
      }
    }
    isFree(pos, len) {
      for (let i = pos; i < pos + len; i++) {
        if (this.spaces[i]) {
          return false;
        }
      }
      return true;
    }
  };
  var RankGroup = class {
    constructor(idx) {
      this.nodes = [];
      this.ordering = new Ordering();
      this.index = idx;
    }
    sortNodes() {
      const nodes = this.nodes;
      const before2 = this.nodes.slice();
      nodes.sort((a, b) => {
        if (a._inEdges.length && b._inEdges.length) {
          const aSource = a.highestUpstreamSource();
          const bSource = b.highestUpstreamSource();
          if (aSource !== void 0 && bSource !== void 0) {
            const compare = aSource - bSource;
            if (compare !== 0) {
              return compare;
            }
          }
        }
        if (a._outEdges.length && b._outEdges.length) {
          const aTarget = a.highestDownstreamTarget();
          const bTarget = b.highestDownstreamTarget();
          if (aTarget !== void 0 && bTarget !== void 0) {
            const compare = aTarget - bTarget;
            if (compare !== 0) {
              return compare;
            }
          }
        }
        if (a._inEdges.length && b._outEdges.length) {
          const aSource = a.highestUpstreamSource();
          const bTarget = b.highestDownstreamTarget();
          if (aSource !== void 0 && bTarget !== void 0) {
            const compare = aSource - bTarget;
            if (compare !== 0) {
              return compare;
            }
          }
        }
        if (a._outEdges.length && b._inEdges.length) {
          const aTarget = a.highestDownstreamTarget();
          const bSource = b.highestUpstreamSource();
          if (aTarget !== void 0 && bSource !== void 0) {
            const compare = aTarget - bSource;
            if (compare !== 0) {
              return compare;
            }
          }
        }
        const aPassedThrough = a.passedThroughAnyPreviousNode();
        const bPassedThrough = b.passedThroughAnyPreviousNode();
        if (aPassedThrough && !bPassedThrough) {
          return -1;
        }
        const aPassesThrough = a.passesThroughAnyNextNode();
        const bPassesThrough = b.passesThroughAnyNextNode();
        if (aPassesThrough && !bPassesThrough) {
          return -1;
        }
        const byOutEdges = b._outEdges.length - a._outEdges.length;
        if (byOutEdges !== 0) {
          return byOutEdges;
        }
        if (!aPassesThrough && bPassesThrough) {
          return 1;
        }
        a.debugMarked = true;
        b.debugMarked = true;
        return compareNames(a.name, b.name);
      });
      let changed = false;
      for (let c = 0; c < nodes.length; c++) {
        if (nodes[c] !== before2[c]) {
          changed = true;
        }
      }
      return changed;
    }
    mark() {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].rankGroupMarked = true;
      }
    }
    width() {
      let width = 0;
      for (let i = 0; i < this.nodes.length; i++) {
        width = Math.max(width, this.nodes[i].width());
      }
      return width;
    }
    layout() {
      let rollingKeyOffset = 0;
      this.ordering = new Ordering();
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        node._keyOffset = rollingKeyOffset;
        this.ordering.fill(rollingKeyOffset, node._edgeKeys.length);
        rollingKeyOffset += Math.max(node._edgeKeys.length, 1);
      }
    }
    tug() {
      let changed = false;
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const node = this.nodes[i];
        const align = node.inAlignment();
        if (align !== void 0 && node._keyOffset < align && this.ordering.isFree(align, node._edgeKeys.length)) {
          this.ordering.free(node._keyOffset, node._edgeKeys.length);
          node._keyOffset = align;
          this.ordering.fill(node._keyOffset, node._edgeKeys.length);
          changed = true;
        } else {
          const outAlign = node.outAlignment();
          if (outAlign !== void 0 && node._keyOffset < outAlign && this.ordering.isFree(outAlign, node._edgeKeys.length)) {
            this.ordering.free(node._keyOffset, node._edgeKeys.length);
            node._keyOffset = outAlign;
            this.ordering.fill(node._keyOffset, node._edgeKeys.length);
            changed = true;
          }
        }
      }
      this.nodes.sort((a, b) => {
        return a._keyOffset - b._keyOffset;
      });
      return changed;
    }
  };
  var Edge = class {
    constructor(source, target, key, customData) {
      this.source = source;
      this.target = target;
      this.key = key;
      this.customData = customData;
    }
    id() {
      return this.source.id() + "-to-" + this.target.id();
    }
    bezierPoints() {
      const sourcePosition = this.source.position();
      const targetPosition = this.target.position();
      const curvature = 0.5;
      let point2, point3;
      if (sourcePosition.x > targetPosition.x) {
        const belowSourceNode = this.source.node.position().y + this.source.node.height();
        const belowTargetNode = this.target.node.position().y + this.target.node.height();
        point2 = {
          x: sourcePosition.x + 100,
          y: belowSourceNode + 100
        };
        point3 = {
          x: targetPosition.x - 100,
          y: belowTargetNode + 100
        };
      } else {
        const xi = (t) => sourcePosition.x * (1 - t) + targetPosition.x * t;
        point2 = {
          x: xi(curvature),
          y: sourcePosition.y
        };
        point3 = {
          x: xi(1 - curvature),
          y: targetPosition.y
        };
      }
      const points = [sourcePosition, point2, point3, targetPosition];
      return points;
    }
    path() {
      const points = this.bezierPoints();
      return "M" + points[0].x + "," + points[0].y + " C" + points[1].x + "," + points[1].y + " " + points[2].x + "," + points[2].y + " " + points[3].x + "," + points[3].y;
    }
  };
  var EdgeSource = class {
    constructor(node, key) {
      this.node = node;
      this.key = key;
    }
    width() {
      return 0;
    }
    height() {
      return 0;
    }
    effectiveKeyOffset() {
      return this.node._keyOffset + this.node._edgeKeys.indexOf(this.key);
    }
    id() {
      return this.node.id + "-" + this.key + "-source";
    }
    position() {
      return {
        x: this.node.position().x + this.node.width(),
        y: KEY_HEIGHT / 2 + this.effectiveKeyOffset() * (KEY_HEIGHT + KEY_SPACING)
      };
    }
  };
  var EdgeTarget = class {
    constructor(node, key) {
      this.node = node;
      this.key = key;
    }
    width() {
      return 0;
    }
    height() {
      return 0;
    }
    effectiveKeyOffset() {
      return this.node._keyOffset + this.node._edgeKeys.indexOf(this.key);
    }
    rankOfFirstAppearance() {
      if (this._rankOfFirstAppearance !== void 0) {
        return this._rankOfFirstAppearance;
      }
      const inEdges = this.node._inEdges;
      let rank = Infinity;
      for (let i = 0; i < inEdges.length; i++) {
        const inEdge = inEdges[i];
        if (inEdge.source.key === this.key) {
          const upstreamNodeInEdges = inEdge.source.node._inEdges;
          if (upstreamNodeInEdges.length === 0) {
            rank = inEdge.source.node.rank();
            break;
          }
          let foundUpstreamInEdge = false;
          for (let j = 0; j < upstreamNodeInEdges.length; j++) {
            const upstreamEdge = upstreamNodeInEdges[j];
            if (upstreamEdge.target.key === this.key) {
              foundUpstreamInEdge = true;
              const upstreamRank = upstreamEdge.target.rankOfFirstAppearance();
              if (upstreamRank < rank) {
                rank = upstreamRank;
              }
            }
          }
          if (!foundUpstreamInEdge) {
            rank = inEdge.source.node.rank();
            break;
          }
        }
      }
      this._rankOfFirstAppearance = rank;
      return rank;
    }
    id() {
      return this.node.id + "-" + this.key + "-target";
    }
    position() {
      return {
        x: this.node.position().x,
        y: KEY_HEIGHT / 2 + this.effectiveKeyOffset() * (KEY_HEIGHT + KEY_SPACING)
      };
    }
  };
  function compareNames(a, b) {
    const byLength = a.length - b.length;
    if (byLength !== 0) {
      return byLength;
    }
    return a.localeCompare(b);
  }
  function objectIsEmpty(o) {
    for (const x in o) {
      return false;
    }
    return true;
  }

  // src/webview/render.ts
  console.log("Render module loaded");
  var currentHighlight;
  function draw(svg, jobs, resources) {
    console.log("Drawing pipeline with jobs:", jobs.length, "and resources:", resources.length);
    if (jobs.length > 0) {
      console.log("Sample job:", jobs[0].name, "with inputs:", jobs[0].inputs?.length, "outputs:", jobs[0].outputs?.length);
    }
    if (resources.length > 0) {
      console.log("Sample resource:", resources[0].name);
    }
    const redraw = redrawFunction(svg, jobs, resources);
    redraw();
    console.log("Pipeline drawing complete");
  }
  function redrawFunction(svg, jobs, resources) {
    return function() {
      const parentNode = svg.node()?.parentNode;
      if (parentNode) {
        select_default2(parentNode).attr("viewBox", "0 0 0 0");
      }
      const graph = createGraph(svg, jobs, resources);
      svg.selectAll("g.edge").remove();
      svg.selectAll("g.node").remove();
      const svgEdges = svg.selectAll("g.edge").data(graph.edges());
      svgEdges.exit().remove();
      const svgNodes = svg.selectAll("g.node").data(graph.nodes());
      svgNodes.exit().remove();
      const svgEdge = svgEdges.enter().append("g").attr("class", function(edge) {
        let classes = "edge " + (edge.source.node.status || "");
        if (edge.customData && edge.customData.trigger === true) {
          classes += " trigger-true";
        } else {
          classes += " trigger-false";
        }
        return classes;
      });
      if (graph.edges().length > 0) {
        console.log(
          "Sample edge trigger status:",
          graph.edges()[0].customData?.trigger,
          "from",
          graph.edges()[0].source.node.name,
          "to",
          graph.edges()[0].target.node.name
        );
      }
      function highlight(thing) {
        if (!thing.key) {
          return;
        }
        currentHighlight = thing.key;
        svgEdges.each(function(edge) {
          if (edge.source.key === thing.key) {
            select_default2(this).classed("active", true);
          }
        });
        svgNodes.each(function(node) {
          if (node.key === thing.key) {
            select_default2(this).classed("active", true);
          }
        });
      }
      function lowlight(thing) {
        if (!thing.key) {
          return;
        }
        currentHighlight = void 0;
        svgEdges.classed("active", false);
        svgNodes.classed("active", false);
      }
      const svgNode2 = svgNodes.enter().append("g").attr("class", function(node) {
        return "node " + node.class;
      }).on("mouseover", highlight).on("mouseout", lowlight);
      const nodeLink = svgNode2.append("svg:a").attr("xlink:href", function(node) {
        return node.url || "#";
      });
      const jobStatusBackground = nodeLink.append("rect").attr("height", function(node) {
        return node.height();
      });
      nodeLink.append("text").text(function(node) {
        return node.name;
      }).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("x", function(node) {
        return node.width() / 2;
      }).attr("y", function(node) {
        return node.height() / 2;
      }).attr("class", function(node) {
        if (node.class.includes("input") || node.class.includes("output")) {
          return "resource-text";
        }
        return "";
      });
      jobStatusBackground.attr("width", function(node) {
        return node.width();
      });
      graph.layout();
      svgNode2.attr("transform", function(node) {
        const position = node.position();
        return "translate(" + position.x + ", " + position.y + ")";
      });
      svgEdge.append("path").attr("d", function(edge) {
        return edge.path();
      }).on("mouseover", highlight).on("mouseout", lowlight);
      const bbox = svg.node()?.getBBox();
      if (bbox && parentNode) {
        select_default2(parentNode).attr("viewBox", "" + (bbox.x - 20) + " " + (bbox.y - 20) + " " + (bbox.width + 40) + " " + (bbox.height + 40));
      }
      if (currentHighlight) {
        svgNodes.each(function(node) {
          if (node.key === currentHighlight) {
            highlight(node);
          }
        });
        svgEdges.each(function(edge) {
          if (edge.key === currentHighlight) {
            highlight(edge);
          }
        });
      }
    };
  }
  function createPipelineSvg(svg) {
    console.log("Creating pipeline SVG container");
    svg.html("");
    let g = svg.select("g.pipeline-container");
    if (g.empty()) {
      console.log("Creating new pipeline container group");
      const defs = svg.append("defs");
      defs.append("filter").attr("id", "embiggen").append("feMorphology").attr("operator", "dilate").attr("radius", "4");
      g = svg.append("g").attr("class", "pipeline-container").attr("transform", "translate(0,0) scale(1)");
      console.log("Adding zoom behavior");
      const zoom = zoom_default2().scaleExtent([0.5, 10]).on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
      svg.call(zoom);
      g.append("rect").attr("x", 20).attr("y", 20).attr("width", 100).attr("height", 60).attr("fill", "purple").attr("stroke", "white").attr("stroke-width", 2).style("display", "none");
      g.append("text").attr("x", 70).attr("y", 50).attr("fill", "white").attr("text-anchor", "middle").attr("dominant-baseline", "middle").text("Pipeline View").style("display", "none");
    }
    return g;
  }
  function resetPipelineFocus() {
    const g = select_default2("g.pipeline-container");
    if (!g.empty()) {
      g.attr("transform", "");
      select_default2("svg").call(
        zoom_default2().transform,
        identity2
      );
    }
  }
  function createGraph(svg, jobs, resources) {
    const graph = new Graph();
    const resourceURLs = {};
    const resourceFailing = {};
    const resourcePaused = {};
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      resourceURLs[resource.name] = `/teams/${resource.team_name}/pipelines/${resource.pipeline_name}/resources/${encodeURIComponent(resource.name)}`;
      resourceFailing[resource.name] = resource.failing_to_check;
      resourcePaused[resource.name] = resource.paused;
    }
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const id2 = jobNode(job.name);
      const classes = ["job"];
      let url = `/teams/${job.team_name}/pipelines/${job.pipeline_name}/jobs/${encodeURIComponent(job.name)}`;
      if (job.next_build) {
        const build = job.next_build;
        url = `/teams/${build.team_name}/pipelines/${build.pipeline_name}/jobs/${encodeURIComponent(build.job_name)}/builds/${build.name}`;
      } else if (job.finished_build) {
        const build = job.finished_build;
        url = `/teams/${build.team_name}/pipelines/${build.pipeline_name}/jobs/${encodeURIComponent(build.job_name)}/builds/${build.name}`;
      }
      let status;
      if (job.paused) {
        status = "paused";
      } else if (job.finished_build) {
        status = job.finished_build.status;
      } else {
        status = "no-builds";
      }
      classes.push(status);
      if (job.next_build) {
        classes.push(job.next_build.status);
      }
      graph.setNode(id2, new GraphNode({
        id: id2,
        name: job.name,
        class: classes.join(" "),
        status,
        url,
        svg
      }));
    }
    const resourceStatus = function(resource) {
      let status = "";
      if (resourceFailing[resource]) {
        status += " failing";
      }
      if (resourcePaused[resource]) {
        status += " paused";
      }
      return status;
    };
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const id2 = jobNode(job.name);
      for (let j = 0; j < job.outputs.length; j++) {
        const output = job.outputs[j];
        const outputId = outputNode(job.name, output.resource);
        let jobOutputNode = graph.node(outputId);
        if (!jobOutputNode) {
          jobOutputNode = new GraphNode({
            id: outputId,
            name: output.resource,
            key: output.resource,
            class: "output" + resourceStatus(output.resource),
            repeatable: true,
            url: resourceURLs[output.resource],
            svg
          });
          graph.setNode(outputId, jobOutputNode);
        }
        graph.addEdge(id2, outputId, output.resource, null);
      }
    }
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const id2 = jobNode(job.name);
      for (let j = 0; j < job.inputs.length; j++) {
        const input = job.inputs[j];
        if (input.passed && input.passed.length > 0) {
          for (let p = 0; p < input.passed.length; p++) {
            const sourceJobNode = jobNode(input.passed[p]);
            const sourceOutputNode = outputNode(input.passed[p], input.resource);
            const sourceInputNode = inputNode(input.passed[p], input.resource);
            let sourceNode;
            if (graph.node(sourceOutputNode)) {
              sourceNode = sourceOutputNode;
            } else {
              if (!graph.node(sourceInputNode)) {
                graph.setNode(sourceInputNode, new GraphNode({
                  id: sourceInputNode,
                  name: input.resource,
                  key: input.resource,
                  class: "constrained-input",
                  repeatable: true,
                  url: resourceURLs[input.resource],
                  svg
                }));
              }
              if (graph.node(sourceJobNode)) {
                graph.addEdge(sourceJobNode, sourceInputNode, input.resource, null);
              }
              sourceNode = sourceInputNode;
            }
            graph.addEdge(sourceNode, id2, input.resource, { trigger: input.trigger });
          }
        }
      }
    }
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const id2 = jobNode(job.name);
      const node = graph.node(id2);
      if (!node) continue;
      for (let j = 0; j < job.inputs.length; j++) {
        const input = job.inputs[j];
        if (!input.passed || input.passed.length === 0) {
          const inputId = inputNode(job.name, input.resource + "-unconstrained");
          if (!graph.node(inputId)) {
            graph.setNode(inputId, new GraphNode({
              id: inputId,
              name: input.resource,
              key: input.resource,
              class: "input" + resourceStatus(input.resource),
              status: "",
              repeatable: true,
              url: resourceURLs[input.resource],
              svg,
              equivalentBy: input.resource + "-unconstrained"
            }));
          }
          graph.addEdge(inputId, id2, input.resource, { trigger: input.trigger });
        }
      }
    }
    graph.computeRanks();
    graph.collapseEquivalentNodes();
    graph.addSpacingNodes();
    return graph;
  }
  function jobNode(name) {
    return "job-" + name;
  }
  function outputNode(jobName, resourceName) {
    return "job-" + jobName + "-output-" + resourceName;
  }
  function inputNode(jobName, resourceName) {
    return "job-" + jobName + "-input-" + resourceName;
  }

  // src/webview/concourse-vis-view.ts
  var activeGroup = null;
  function init2(container) {
    console.log("Initializing visualization in container", container);
    container.innerHTML = "";
    const infoText = document.createElement("div");
    infoText.style.padding = "20px";
    infoText.style.fontSize = "16px";
    infoText.style.color = "#333";
    infoText.textContent = "Concourse Pipeline Visualizer is initializing...";
    container.appendChild(infoText);
    const header = document.createElement("div");
    header.className = "topbar-logo";
    header.textContent = "Concourse Pipeline Visualizer";
    header.style.padding = "10px";
    header.style.textAlign = "center";
    header.style.fontWeight = "bold";
    header.style.fontSize = "18px";
    header.style.fontFamily = "Inconsolata, monospace";
    header.style.background = "#000000";
    header.style.color = "#ffffff";
    header.style.borderBottom = "1px solid #444";
    container.appendChild(header);
    const groupsBar = document.createElement("div");
    groupsBar.style.display = "flex";
    groupsBar.style.justifyContent = "space-between";
    groupsBar.style.background = "#333";
    groupsBar.style.padding = "5px 10px";
    container.appendChild(groupsBar);
    const groupsContainer = document.createElement("div");
    groupsContainer.id = "groups-container";
    groupsContainer.style.display = "flex";
    groupsContainer.style.flexWrap = "wrap";
    groupsContainer.style.gap = "5px";
    groupsContainer.style.alignItems = "center";
    groupsBar.appendChild(groupsContainer);
    const resetContainer = document.createElement("div");
    resetContainer.style.display = "flex";
    resetContainer.style.alignItems = "center";
    const resetButton = document.createElement("button");
    resetButton.id = "reset-zoom";
    resetButton.textContent = "Reset View";
    resetButton.style.background = "#3498db";
    resetButton.style.color = "white";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "3px";
    resetButton.style.padding = "5px 10px";
    resetButton.style.cursor = "pointer";
    resetButton.style.fontFamily = "Inconsolata, monospace";
    resetButton.style.fontSize = "14px";
    resetButton.addEventListener("click", resetZoom);
    resetContainer.appendChild(resetButton);
    groupsBar.appendChild(resetContainer);
    console.log("Creating SVG element");
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("class", "pipeline-graph");
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "80%");
    container.appendChild(svgElement);
    console.log("Initializing D3");
    const svg = select_default2(svgElement);
    svg.append("rect").attr("x", 10).attr("y", 10).attr("width", 50).attr("height", 50).attr("fill", "steelblue");
    console.log("Creating pipeline SVG");
    const pipelineSvg2 = createPipelineSvg(svg);
    console.log("Visualization initialized successfully");
    container.removeChild(infoText);
    return { svg: pipelineSvg2 };
  }
  function createGroupTabs(groups) {
    const groupsContainer = document.getElementById("groups-container");
    if (!groupsContainer) return;
    groupsContainer.innerHTML = "";
    if (!groups || groups.length === 0) {
      const allTab2 = createGroupTab("All", true);
      groupsContainer.appendChild(allTab2);
      activeGroup = null;
      return;
    }
    groups.forEach((group2, index) => {
      const isActive = index === 0 || group2.name === activeGroup;
      if (isActive && activeGroup === null) {
        activeGroup = group2.name;
      }
      const tab = createGroupTab(group2.name, isActive);
      groupsContainer.appendChild(tab);
    });
    const allTab = createGroupTab("All", activeGroup === null);
    groupsContainer.appendChild(allTab);
  }
  function createGroupTab(name, isActive) {
    const tab = document.createElement("div");
    tab.className = "group-tab";
    tab.textContent = name;
    tab.setAttribute("data-group", name);
    tab.style.padding = "8px 16px";
    tab.style.margin = "0";
    tab.style.cursor = "pointer";
    tab.style.fontFamily = "Inconsolata, monospace";
    tab.style.fontSize = "14px";
    tab.style.border = isActive ? "1px solid white" : "1px solid #555";
    tab.style.backgroundColor = isActive ? "#333" : "#262626";
    tab.style.color = isActive ? "white" : "#999";
    tab.addEventListener("click", () => {
      setActiveGroup(name === "All" ? null : name);
    });
    return tab;
  }
  function setActiveGroup(groupName) {
    activeGroup = groupName;
    const tabs = document.querySelectorAll(".group-tab");
    tabs.forEach((tab) => {
      const tabGroup = tab.getAttribute("data-group");
      const isActive = tabGroup === "All" && groupName === null || tabGroup === groupName;
      tab.style.border = isActive ? "1px solid white" : "1px solid #555";
      tab.style.backgroundColor = isActive ? "#333" : "#262626";
      tab.style.color = isActive ? "white" : "#999";
    });
    filterAndUpdatePipeline();
  }
  var pipelineJobs = [];
  var pipelineResources = [];
  var pipelineSvg = null;
  function filterAndUpdatePipeline() {
    if (!pipelineJobs.length || !pipelineSvg) {
      console.log("No pipeline data available for filtering");
      return;
    }
    console.log("Filtering pipeline for group:", activeGroup);
    let filteredJobs = pipelineJobs;
    if (activeGroup !== null) {
      filteredJobs = pipelineJobs.filter(
        (job) => job.groups && Array.isArray(job.groups) && job.groups.includes(activeGroup)
      );
      console.log(`Filtered to ${filteredJobs.length} jobs in group: ${activeGroup}`);
    }
    draw(pipelineSvg, filteredJobs, pipelineResources);
  }
  function update(svg, rawYaml) {
    console.log("Updating visualization with YAML content, length:", rawYaml.length);
    if (!svg) {
      console.error("SVG container not initialized");
      return;
    }
    try {
      console.log("Parsing YAML");
      const obj = load(rawYaml);
      if (!obj) {
        console.warn("YAML parsed to null or undefined");
        return;
      }
      console.log("YAML parsed successfully, keys:", Object.keys(obj));
      const resources = obj.resources || [];
      const jobs = obj.jobs || [];
      const groups = obj.groups || [];
      console.log(`Found ${resources.length} resources, ${jobs.length} jobs, and ${groups.length} groups`);
      createGroupTabs(groups);
      if (resources.length === 0 || jobs.length === 0) {
        console.warn("No resources or jobs found in YAML");
        svg.html("");
        svg.append("text").attr("x", 100).attr("y", 100).attr("fill", "red").text(`Pipeline data incomplete: ${resources.length} resources, ${jobs.length} jobs`);
        return;
      }
      each(jobs, function(job) {
        console.log("Processing job:", job.name);
        job.finished_build = {
          status: "succeeded"
        };
        job.groups = [];
        if (groups && groups.length > 0) {
          groups.forEach((group2) => {
            if (group2.jobs && group2.jobs.includes(job.name)) {
              job.groups.push(group2.name);
            }
          });
        }
        const inputs = [];
        const outputs = [];
        if (job.plan) {
          each(job.plan, function(plan) {
            console.log("Processing plan item in job", job.name);
            const result2 = iteratePlan(plan, null, null, plan, inputs, outputs);
          });
        } else {
          console.warn("Job has no plan:", job.name);
        }
        job.inputs = inputs;
        job.outputs = outputs;
        console.log(`Job ${job.name} has ${inputs.length} inputs and ${outputs.length} outputs`);
      });
      pipelineJobs = jobs;
      pipelineResources = resources;
      pipelineSvg = svg;
      let filteredJobs = jobs;
      if (activeGroup !== null) {
        filteredJobs = jobs.filter(
          (job) => job.groups && Array.isArray(job.groups) && job.groups.includes(activeGroup)
        );
        console.log(`Filtered to ${filteredJobs.length} jobs in group: ${activeGroup}`);
      }
      console.log("Drawing pipeline with D3");
      draw(svg, filteredJobs, resources);
      console.log("Pipeline drawing complete");
    } catch (e) {
      console.error("Error parsing or processing YAML:", e);
      svg.html("");
      svg.append("text").attr("x", 100).attr("y", 100).attr("fill", "red").text(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  function resetZoom() {
    resetPipelineFocus();
  }
  function iteratePlan(obj, id2, parent, plan, inputs, outputs) {
    for (const property2 in obj) {
      if (property2 === "get") {
        if (parent === null) {
          inputs.push({
            name: obj[property2],
            resource: obj[property2],
            trigger: obj.trigger ? obj.trigger : false,
            passed: obj["passed"]
          });
        } else {
          inputs.push({
            name: obj[property2],
            resource: parent[id2]?.resource ? parent[id2].resource : obj[property2],
            trigger: parent[id2]?.trigger ? parent[id2].trigger : false,
            passed: parent[id2]?.passed ? parent[id2].passed : null
          });
        }
      }
      if (property2 === "put") {
        outputs.push({
          name: obj[property2],
          resource: obj[property2]
        });
      }
      if (typeof obj[property2] === "object" && obj[property2] !== null) {
        iteratePlan(obj[property2], property2, obj, plan, inputs, outputs);
      }
    }
    return [inputs, outputs];
  }

  // src/webview/index.ts
  var vscode = acquireVsCodeApi();
  console.log("Webview bundle script loaded");
  var currentYamlContent = "";
  function updateStatus(message) {
    const statusElement = document.getElementById("status-message");
    if (statusElement) {
      statusElement.textContent = message;
      console.log("Status updated:", message);
    }
  }
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered");
    updateStatus("DOM loaded, initializing visualization...");
    const container = document.getElementById("pipeline-container");
    if (!container) {
      console.error("Pipeline container element not found");
      updateStatus("Error: Pipeline container element not found");
      return;
    }
    try {
      updateStatus("Initializing D3 visualization...");
      const { svg } = init2(container);
      updateStatus("Visualization initialized, waiting for pipeline data...");
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.classList.contains("group-tab")) {
          console.log("Group tab clicked:", target.getAttribute("data-group"));
        }
      });
      vscode.postMessage({
        type: "ready",
        message: "Webview initialized and ready"
      });
      window.addEventListener("message", (event) => {
        const message = event.data;
        console.log("Received message from extension:", message);
        if (message.command === "updatePipeline") {
          try {
            updateStatus("Updating pipeline visualization...");
            currentYamlContent = message.text;
            update(svg, currentYamlContent);
            updateStatus("Pipeline visualization updated");
          } catch (error) {
            console.error("Error updating pipeline:", error);
            updateStatus("Error: Failed to update pipeline: " + (error instanceof Error ? error.message : String(error)));
          }
        }
      });
    } catch (error) {
      console.error("Error during initialization:", error);
      updateStatus("Error during initialization: " + (error instanceof Error ? error.message : String(error)));
    }
  });
})();
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)
*/
