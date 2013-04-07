Nervous.Queue = Nervous.Object.extend({
  initialize: function() {
    this.callbacks = {};
    return Nervous.Object.prototype.initialize.apply(this, arguments);
  },

  enqueue: function(name, func) {
    var _base;

    (_base = this.callbacks)[name] || (_base[name] = []);

    this.callbacks[name].push(func);

    return this;
  },

  execute: function(context, name) {
    var args = Array.prototype.slice.call(arguments, 2);

    if (this.callbacks[name]) {
      while (this.callbacks[name].length) {
        this.callbacks[name].shift().apply(context, args);
      }
    }

    return this;
  },

  success: function(func) {
    return this.enqueue('success', func);
  },

  error: function(func) {
    return this.enqueue('error', func);
  }
});
