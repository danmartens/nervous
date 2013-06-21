Nervous.View = Nervous.Object.extend({
  tagName: 'div',

  initialize: function() {
    Nervous.Object.prototype.initialize.apply(this, arguments);
    this._createEl();
  },

  beforeRender: Nervous.noop,
  afterRender: Nervous.noop,

  render: function() {
    return this._renderTemplate();
  },

  remove: function() {
    this.$el.remove();
  },

  _createEl: function() {
    this.el = document.createElement(this.get('tagName'));
    this.$el = Nervous.$(this.el);
    this.$ = this.$el.find;
  },

  _loadTemplate: function(callback) {
    var deferred, options, _this = this;
    
    deferred = Q.defer();

    if (this.template != null) {
      deferred.resolve(this.template);
    } else if (this.templatePath != null) {
      options = {
        url: this.templatePath,
        type: 'GET',
        dataType: 'html',

        success: function(html) {
          deferred.resolve(html);
        },

        error: function() {
          deferred.reject(new Error("The template `" + this.templatePath + "` could not be loaded."));
        }
      };

      $.ajax(options);
    }
    
    return deferred.promise;
  },

  _renderTemplate: function() {
    var _this = this;

    this.beforeRender();

    return this._loadTemplate().then(function(html) {
      _this.$el.html(html);
      _this.afterRender();
    });
  }
});
