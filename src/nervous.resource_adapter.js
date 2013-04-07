Nervous.ResourceAdapter = Nervous.Object.extend({
  request: function(method, resource, options) {
    var crud, queue, _this = this;

    if (options == null) {
      options = {};
    }

    crud = {
      'create': 'POST',
      'update': 'PUT',
      'read': 'GET',
      'delete': 'DELETE'
    };

    queue = Nervous.Queue.create();

    options = this.prepareRequest(Nervous.extend({
      url: resource.get('url'),
      dataType: 'json',
      method: crud[method],

      success: function(json, status, xhr) {
        queue.execute(_this, 'success', _this.prepareResponse(json), status, xhr);
      },

      error: function(xhr, errorType, error) {
        queue.execute(_this, 'error', xhr, errorType, error);
      }
    }, options));

    Nervous.$.ajax(options);

    return queue;
  },

  prepareRequest: Nervous.noop,
  prepareResponse: Nervous.noop
});
