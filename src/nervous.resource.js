Nervous.Resource = Nervous.Object.extend({
  idProperty: 'id',
  resourceName: null,

  isFetching: false,
  isFetched: false,

  isSaving: false,

  isDestroying: false,

  _fetchPromise: null,
  _savePromise: null,

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

    if (this._fetchPromise == null || !this._fetchPromise.isPending()) {
      this.set('isFetching', true);

      if (options == null) {
        options = {};
      }
      
      options.url = this.resourceUrl();

      this._fetchPromise = this.get('adapter').request('read', options)
        .then(function(data) {
          _this.deserialize(data);
          _this.set('isFetching', false);
          _this.set('isFetched', true);
        });
    }

    return this._fetchPromise;
  },

  save: function(options) {
    var method, _this = this;

    this.set('isSaving', true);

    if (options == null) {
      options = {};
    }
    
    options.url = this.resourceUrl();

    method = (this.resourceId()) ? 'update' : 'create';

    this._savePromise = this.get('adapter').request(method, options)
      .then(function(data) {
        _this.deserialize(data);
        _this.set('isSaving', false);
        _this.set('isFetched', true);
      });

    return this._savePromise;
  },

  destroy: function(options) {
    var _this = this;

    this.set('isDestroying', true);

    if (options == null) {
      options = {};
    }
    
    options.url = this.resourceUrl();

    return this.get('adapter').request('delete', options)
      .then(function() {
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
