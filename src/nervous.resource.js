Nervous.Resource = Nervous.Object.extend({
  idProperty: 'id',
  resourceName: null,

  isFetching: false,
  isFetched: false,

  isSaving: false,

  isDestroying: false,

  initialize: function() {
    this.resourceProperties || (this.resourceProperties = []);
    return Nervous.Object.prototype.initialize.apply(this, arguments);
  },

  resourceId: function() {
    return this.get(this.idProperty);
  },

  resourceUrl: function() {
    return "/" + this.resourceName + "/" + (this.resourceId());
  },

  fetch: function(options) {
    var _this = this;

    this.set('isFetching', true);

    if (options == null) {
      options = {};
    }

    return this.get('adapter').request('read', this, options)
      .success(function(json) {
        _this.deserialize(json);
        _this.set('isFetching', false);
        _this.set('isFetched', true);
      });
  },

  save: function(options) {
    var method, _this = this;

    this.set('isSaving', true);

    if (options == null) {
      options = {};
    }

    method = (this.get('isFetched')) ? 'update' : 'create';

    return this.get('adapter').request(method, this, options)
      .success(function(json) {
        _this.deserialize(json);
        _this.set('isSaving', false);
        _this.set('isFetched', true);
      });
  },

  destroy: function(options) {
    var _this = this;

    this.set('isDestroying', true);

    if (options == null) {
      options = {};
    }

    return this.get('adapter').request('delete', this, options)
      .success(function(json) {
        _this.set('isDestroying', false);
      });
  },

  deserialize: function(json) {
    var prop, value;

    for (prop in json) {
      value = json[prop];
      this.set(prop, value);
    }

    return this;
  },

  serialize: function() {
    var hash, prop, _i, _len, _ref;

    hash = {};
    _ref = this.get('resourceProperties');

    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      prop = _ref[_i];
      hash[prop] = this.get(prop);
    }

    return hash;
  }
});
