Nervous.ResourceAdapter = Nervous.Object.extend({
  request: function(method, options) {
    var crud, deferred, _this = this;

    if (options == null) {
      options = {};
    }

    crud = {
      'create': 'POST',
      'update': 'PUT',
      'read': 'GET',
      'delete': 'DELETE'
    };

   	deferred = Q.defer();

    options = this.prepareRequest(Nervous.extend({
      dataType: 'json',
      method: crud[method],

      success: function(json, status, xhr) {
    		deferred.resolve(_this.prepareResponse(json));
      },

      error: function(xhr, errorType, error) {
        deferred.reject(new Error(error));
      }
    }, options));

    $.ajax(options);

    return deferred.promise;
  },

  prepareRequest: Nervous.noop,
  prepareResponse: Nervous.noop
});
