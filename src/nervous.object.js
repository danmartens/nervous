Nervous.Object = function() {
  this._propertyObservers = {};
  this._computedPropertyCache = {};
};

Nervous.Object.extend = function() {
  var Class;
  Class = new Function;
  Nervous.extend.apply(Nervous, [Class.prototype, this.prototype].concat(Array.prototype.slice.call(arguments, 0)));
  Class.extend = function() {
    return Nervous.Object.extend.apply(this, arguments);
  };
  Class.create = function(obj) {
    if (obj == null) {
      obj = {};
    }
    return Nervous.Object.create.call(this, obj);
  };
  return Class;
};

Nervous.Object.create = function(obj) {
  var instance;
  if (obj == null) {
    obj = {};
  }
  instance = Nervous.create(this, obj);
  instance.initialize();
  return instance;
};

Nervous.extend(Nervous.Object.prototype, {
  initialize: function() {
    this._propertyObservers = {};
    return this._computedPropertyCache = {};
  },
  get: function(prop) {
    return Nervous.get(this, prop);
  },
  set: function(prop, value) {
    return Nervous.set(this, prop, value);
  },
  addObserver: function(prop, func) {
    var array, obj, _base, _ref;
    obj = this;
    if (prop.indexOf('@each') !== -1) {
      array = this.get(prop.slice(0, prop.indexOf('@each') - 1)) || this;
      prop = prop.slice(prop.indexOf('@each') + 6);
      return array.addItemObserver(prop, func);
    }
    if (prop.indexOf('.') !== -1) {
      obj = Nervous.get(this, prop.slice(0, prop.lastIndexOf('.')));
      prop = prop.slice(prop.lastIndexOf('.') + 1);
    }
    ((_base = obj._propertyObservers)[prop] || (_base[prop] = [])).push(func);
    if (((_ref = obj[prop]) != null ? _ref._property : void 0) != null) {
      obj._initComputedObservers(prop);
    }
    return this;
  },
  removeObserver: function(prop, func) {
    var index, obj;
    obj = this;
    if (prop.indexOf('.') !== -1) {
      obj = Nervous.get(this, prop.slice(0, prop.lastIndexOf('.')));
      prop = prop.slice(prop.lastIndexOf('.') + 1);
    }
    index = obj._propertyObservers[prop].indexOf(func);
    if (index !== -1) {
      obj._propertyObservers[prop].splice(index, 1);
    }
    return this;
  },
  removeObservers: function(prop) {
    delete this._propertyObservers[prop];
    return this;
  },
  _triggerObservers: function(prop) {
    var func, _i, _len, _ref;
    if (this._propertyObservers[prop] != null) {
      _ref = this._propertyObservers[prop];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        func.apply(this);
      }
    }
    return this;
  },
  _getComputedProperty: function(prop) {
    if (!this._computedPropertyCache.hasOwnProperty(prop)) {
      this._recomputeProperty(prop);
    }
    return this._computedPropertyCache[prop];
  },
  _recomputeProperty: function(prop) {
    if (this[prop] != null) {
      this._computedPropertyCache[prop] = this[prop].apply(this);
      return this._triggerObservers(prop);
    }
  },
  _initComputedObservers: function(prop) {
    var p, _i, _len, _ref, _results;
    _ref = this[prop]._property;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      _results.push(this.addObserver(p, function() {
        return this._recomputeProperty(prop);
      }));
    }
    return _results;
  }
});

Nervous.O = function(props) {
  return Nervous.Object.create(props);
};