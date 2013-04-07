describe('Nervous.Queue', function() {
  var queue;

  queue = null;

  beforeEach(function() {
    queue = Nervous.Queue.create();
  });

  describe('#equeue', function() {
    it('should add the passed function to #callbacks', function() {
      var func;

      queue.enqueue('hello', func = function() {});

      expect(queue.callbacks.hello[0]).to.equal(func);
    });
  });

  describe('#execute', function() {
    var callback;

    beforeEach(function() {
      queue.callbacks = {};
      queue.enqueue('test', callback = sinon.spy());
    });

    it('should run any enqueued callback functions', function() {
      queue.execute(this, 'test');
      expect(callback.called).to.equal(true);
    });

    it('should pass additional arguments to the callback functions', function() {
      queue.execute(this, 'test', 1, 2, 3);
      expect(callback.calledWith(1, 2, 3)).to.equal(true);
    });
  });
});