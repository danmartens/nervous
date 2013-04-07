Nervous.Collection = Nervous.Object.extend({
  initialize: function() {
    this._itemObservers = [];
    this._itemPropertyObservers = {};
    this.items || (this.items = []);

    Nervous.Object.prototype.initialize.apply(this, arguments);
  },

  push: function() {
    return Array.prototype.push.apply(this.items, arguments);
  },

  forEach: function() {
    return Array.prototype.forEach.apply(this.items, arguments);
  },

  add: function(item) {
    var func, prop, _i, _len, _ref, _ref1;

    this.items.push(item);

    if (item instanceof Nervous.Object) {
      _ref = this._itemPropertyObservers;
      for (prop in _ref) {
        func = _ref[prop];
        item.addObserver(prop, func);
      }
    }

    _ref1 = this._itemObservers;

    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      func = _ref1[_i];
      func();
    }

    return this;
  },

  remove: function(item) {
    var f, func, index, prop, _i, _j, _len, _len1, _ref, _ref1;

    index = this.items.indexOf(item);

    if (index !== -1) {
      this.items.splice(index, 1);
      _ref = this._itemPropertyObservers;

      for (prop in _ref) {
        func = _ref[prop];
        for (_i = 0, _len = func.length; _i < _len; _i++) {
          f = func[_i];
          item.removeObserver(prop, f);
        }
      }

      _ref1 = this._itemObservers;

      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        func = _ref1[_j];
        func();
      }
    }

    return this;
  },

  contains: function(obj) {
    return this.items.indexOf(obj) !== -1;
  },

  filter: function(func) {
    var filtered, item, _i, _len, _ref;
    filtered = [];
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (func(item)) {
        filtered.push(item);
      }
    }
    return filtered;
  },

  addItemObserver: function(func) {
    this._itemObservers.push(func);
    return this;
  },

  addItemPropertyObserver: function(prop, func) {
    var item, _base, _i, _len, _ref;
    ((_base = this._itemPropertyObservers)[prop] || (_base[prop] = [])).push(func);
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.addObserver(prop, func);
    }
    return this;
  }
});

Nervous.C = function(items) {
  items || (items = []);
  return Nervous.Collection.create({ items: array });
};