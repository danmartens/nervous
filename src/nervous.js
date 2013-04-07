var __slice = [].slice;

window.Nervous = {};

Function.prototype.property = function() {
  var property;
  property = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  this._property = property;
  return this;
};

Nervous.$ = (window.jQuery || window.Zepto);

Nervous.noop = function() {
  return Array.prototype.slice.call(arguments, 0)[0];
};

Nervous.namespace = function(parent, path, obj) {
  var part, parts, _i, _len, _ref;
  parts = path.split('.');
  _ref = parts.slice(0, -1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    part = _ref[_i];
    parent[part] || (parent[part] = {});
    parent = parent[part];
  }
  return parent[parts[parts.length - 1]] = obj;
};

Nervous.get = function(obj, prop) {
  var part, parts, _i, _len, _ref, _ref1;
  parts = prop.split('.');
  _ref = parts.slice(0, parts.length - 1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    part = _ref[_i];
    if (obj[part]) {
      obj = obj[part];
    } else {
      return void 0;
    }
  }
  prop = parts[parts.length - 1];
  if ((_ref1 = obj[prop]) != null ? _ref1._property : void 0) {
    return obj._getComputedProperty(prop);
  } else {
    return obj[prop];
  }
};

Nervous.set = function(obj, prop, value) {
  var part, parts, _i, _len, _ref;
  parts = prop.split('.');
  _ref = prop.slice(0, parts.length - 1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    part = _ref[_i];
    if (obj[part]) {
      obj = obj[part];
    }
  }
  prop = parts[parts.length - 1];
  if (typeof obj === 'object') {
    if (obj[prop] !== value) {
      obj[prop] = value;
      if (typeof obj._triggerObservers === "function") {
        obj._triggerObservers(prop);
      }
    }
  } else {
    throw new Error("Property '" + prop + "' could not be set!");
  }
  return obj;
};

Nervous.extend = function(obj) {
  var hash, prop, value, _i, _len, _ref;
  _ref = Array.prototype.slice.call(arguments, 1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    hash = _ref[_i];
    for (prop in hash) {
      value = hash[prop];
      obj[prop] = value;
    }
  }
  return obj;
};

Nervous.create = function(obj) {
  var hash, key, o, value, _i, _len, _ref;
  o = new obj;
  _ref = Array.prototype.slice.call(arguments, 1);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    hash = _ref[_i];
    for (key in hash) {
      value = hash[key];
      o[key] = value;
    }
  }
  return o;
};