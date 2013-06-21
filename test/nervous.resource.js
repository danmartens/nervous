describe('Nervous.Resource', function() {
  var Person;

  Person = Nervous.Resource.extend({
    resourceName: 'people',
    resourceProperties: ['firstName', 'lastName']
  });

  describe('#resouceId()', function() {
    it('should get the value of #idProperty', function() {
      var person = Person.create({
        id: 1
      });

      expect(person.resourceId()).to.equal(1);
    });
  });

  describe('#resourceUrl()', function() {
    it('should generate a URL for requesting the resource', function() {
      var person = Person.create({
        id: 1
      });

      expect(person.resourceUrl()).to.equal('/people/1');
    });
  });

  describe('#deserialize()', function() {
    it('sets properties from the passed JSON', function() {
      var person = Person.create();

      person.deserialize({
        firstName: 'Jane',
        lastName: 'Doe'
      });

      expect(person.firstName).to.equal('Jane');
      expect(person.lastName).to.equal('Doe');
    });
  });

  describe('#serialize()', function() {
    it('returns an Object with the property name and value for each #resourceProperties', function() {
      var person, serialized;

      person = Person.create({
        firstName: 'John',
        lastName: 'Doe'
      });

      serialized = person.serialize();

      expect(serialized.firstName).to.equal('John');
      expect(serialized.lastName).to.equal('Doe');
    });
  });

  describe('AJAX Functionality', function() {
    var adapter, xhr, requests;

    beforeEach(function() {
      adapter = Nervous.ResourceAdapter.create();

      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];

      xhr.onCreate = function(request) {
        requests.push(request);
      };
    });

    afterEach(function() {
      xhr.restore();
    });

    describe('#fetch', function() {
      var person, respondSuccess;

      respondSuccess = function() {
        requests[0].respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify({
          firstName: 'John',
          lastName: 'Smith'
        }));
      };

      beforeEach(function() {
        person = Person.create({ adapter: adapter });
      });

      it('should update `isFetching` and `isFetched` properties', function(done) {
        expect(person.isFetched).to.equal(false);

        person.fetch().then(function() {
          expect(person.isFetching).to.equal(false);
          expect(person.isFetched).to.equal(true);
          done();
        });

        expect(person.isFetching).to.equal(true);

        respondSuccess();
      });

      it('should deserialize the response', function(done) {
        person.fetch().then(function() {
          expect(person.firstName).to.equal('John');
          expect(person.lastName).to.equal('Smith');
          done();
        });

        respondSuccess();
      });

      it('should return the same promise if called while still fetching', function() {
        var promiseA = person.fetch();
        var promiseB = person.fetch();

        expect(promiseA).to.be(promiseB);
      });
    });

    describe('#save', function() {
      var person, respondSuccess;

      respondSuccess = function() {
        requests[0].respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify({
          firstName: 'John',
          lastName: 'Smith'
        }));
      };

      beforeEach(function() {
        person = Person.create({ adapter: adapter });
      });

      it('should update `isSaving` and `isFetched` properties', function(done) {
        expect(person.isFetched).to.equal(false);

        person.save().then(function() {
          expect(person.isSaving).to.equal(false);
          expect(person.isFetched).to.equal(true);
          done();
        });

        expect(person.isSaving).to.equal(true);

        respondSuccess();
      });
    });

    describe('#destroy', function() {
      var person, respondSuccess;

      respondSuccess = function() {
        requests[0].respond(200, {
          "Content-Type": "application/json"
        });
      };

      beforeEach(function() {
        person = Person.create({ adapter: adapter });
      });

      it('should update the `isDestroying` property', function(done) {
        person.destroy().then(function() {
          expect(person.isDestroying).to.equal(false);
          done();
        });

        expect(person.isDestroying).to.equal(true);

        respondSuccess();
      });
    });

  });
});