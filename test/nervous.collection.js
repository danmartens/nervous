describe('Nervous.Collection', function() {

  describe('#add()', function() {
    it('should add an item to #items', function() {
      var arr = Nervous.Collection.create();

      arr.add('a');

      expect(arr.items[0]).to.equal('a');
    });
  });

  describe('#remove()', function() {
    it('should remove an item from #items', function() {
      var arr;

      arr = Nervous.Collection.create({
        items: ['a']
      });

      arr.remove('a');

      expect(arr.items).not.to.contain('a');
    });
  });

  describe('#contains()', function() {
    var arr = null;

    beforeEach(function() {
      arr = Nervous.Collection.create({
        items: ['a']
      });
    });

    it('returns `true` if #items contains the passed Object', function() {
      expect(arr.contains('a')).to.equal(true);
    });

    it('returns `false` if #items doesn\'t contain the passed Object', function() {
      expect(arr.contains('b')).to.equal(false);
    });
  });

  describe('#filter()', function() {
    var arr = null;

    beforeEach(function() {
      arr = Nervous.Collection.create({
        items: [
          Nervous.Object.create({ group: 'A' }),
          Nervous.Object.create({ group: 'B' }),
          Nervous.Object.create({ group: 'B' })
        ]
      });
    });

    it('should return an array of filtered items', function() {
      expect(arr.filter(function(item) {
        return item.get('group') === 'B';
      }).length).to.equal(2);
    });
  });

  describe('Item Property Observers', function() {
    describe('#addItemObserver()', function() {
      it('should add a property observer to each existing #items', function() {
        var arr, obj;

        obj = Nervous.Object.create();

        arr = Nervous.Collection.create({
          items: [obj]
        });

        arr.addItemPropertyObserver('a', function() {
          return void 0;
        });

        expect(obj._propertyObservers.hasOwnProperty('a')).to.equal(true);
      });
    });

    describe('#add()', function() {
      it('should add a property observer to newly added #items', function() {
        var arr, obj;

        obj = Nervous.Object.create();
        arr = Nervous.Collection.create();

        arr.addItemPropertyObserver('a', function() {
          return void 0;
        });

        arr.add(obj);

        expect(obj._propertyObservers.hasOwnProperty('a')).to.equal(true);
      });
    });

    describe('#addObserver()', function() {
      it('should call #addItemObserver if `prop` starts with \'@each\'', function() {
        var arr, func;

        arr = Nervous.Collection.create();

        sinon.spy(arr, 'addItemObserver');

        arr.addObserver('@each.a', func = function() {});

        expect(arr.addItemObserver.calledWith('a', func)).to.equal(true);
      });
    });

    describe('#remove()', function() {
      it('should remove property observers from removed #items', function() {
        var arr, func, obj;

        obj = Nervous.Object.create();

        arr = Nervous.Collection.create({
          items: [obj]
        });

        arr.addItemPropertyObserver('a', func = function() {
          return void 0;
        });

        expect(obj._propertyObservers.a).to.contain(func);

        arr.remove(obj);

        expect(obj._propertyObservers.a).not.to.contain(func);
      });
    });
  });
});
