
describe('Nervous.Object', function() {
  describe('::extend', function() {
    it('should append properties to the Object\'s prototype', function() {
      var Obj = Nervous.Object.extend({ a: 'b' });

      expect(Obj.prototype.a).to.equal('b');
      expect(Obj.hasOwnProperty('a')).to.equal(false);
    });

    it('should allow subclassing a Class', function() {
      var ObjA, ObjB;

      ObjA = Nervous.Object.extend({ a: 'b' });
      ObjB = ObjA.extend({ b: 'c' });

      expect(ObjB.prototype.a).to.equal('b');
      expect(ObjB.prototype.b).to.equal('c');
      expect(ObjB.hasOwnProperty('a')).to.equal(false);
      expect(ObjB.hasOwnProperty('b')).to.equal(false);
    });
  });

  describe('::create', function() {
    it('should create a new instance of the Class', function() {
      var obj;

      obj = Nervous.Object.create({ a: 'b' });

      expect(obj.hasOwnProperty('a')).to.equal(true);
    });

    it('should create a new instance of a Subclass', function() {
      var Person, person;

      Person = Nervous.Object.extend({
        firstName: 'John',
        lastName: 'Smith'
      });

      person = Person.create({
        firstName: 'Jane'
      });

      expect(person.hasOwnProperty('firstName')).to.equal(true);
      expect(person.hasOwnProperty('lastName')).to.equal(false);
      expect(person.firstName).to.equal('Jane');
      expect(person.lastName).to.equal('Smith');
    });
  });

  describe('Property Observers', function() {
    var Person, person;

    Person = Nervous.Object.extend({
      fullName: (function() {
        return "" + this.firstName + " " + this.lastName;
      }).property('firstName', 'lastName')
    });

    person = null;

    beforeEach(function() {
      person = Person.create({
        firstName: 'John',
        lastName: 'Smith'
      });
    });

    describe('#_triggerObservers()', function() {
      it('should trigger the observer function', function() {
        var spy;

        person.addObserver('firstName', spy = sinon.spy());
        person._triggerObservers('firstName');

        expect(spy.called).to.equal(true);
      });
    });

    describe('#addObserver()', function() {
      it('should add the observer to the deepest observable object', function() {
        var spy;

        person.spouse = Nervous.Object.create({
          firstName: 'Jane',
          lastName: 'Doe'
        });

        person.addObserver('spouse.firstName', spy = sinon.spy());
        person.spouse._triggerObservers('firstName');

        expect(spy.called).to.equal(true);
      });
    });

    describe('#removeObserver()', function() {
      it('should remove the observer from the deepest observable object', function() {
        var spy;

        person.spouse = Nervous.Object.create({
          firstName: 'Jane',
          lastName: 'Doe'
        });

        person.spouse.addObserver('firstName', spy = sinon.spy());
        expect(person.spouse._propertyObservers.firstName).to.contain(spy);

        person.removeObserver('spouse.firstName', spy);
        expect(person.spouse._propertyObservers.firstName).not.to.contain(spy);
      });
    });

    describe('#set()', function() {
      person = null;

      beforeEach(function() {
        person = Person.create({
          firstName: 'John',
          lastName: 'Smith'
        });
      });

      it('should trigger property observers', function() {
        var spy;

        person.addObserver('firstName', spy = sinon.spy());
        person.set('firstName', 'Jane');

        expect(spy.called).to.equal(true);
      });
    });
  });

  describe('Computed Properties', function() {
    var Person, person;

    Person = Nervous.Object.extend({
      fullName: (function() {
        return "" + this.firstName + " " + this.lastName;
      }).property('firstName', 'lastName')
    });

    person = null;

    beforeEach(function() {
      person = Person.create({
        firstName: 'John',
        lastName: 'Smith'
      });
    });

    describe('#_recomputeProperty()', function() {
      it('should recompute the value of the property', function() {
        person._recomputeProperty('fullName');
        expect(person._computedPropertyCache.fullName).to.equal('John Smith');
      });
    });

    describe('#_getComputedProperty()', function() {
      it('should get the value of the computed property', function() {
        expect(person._getComputedProperty('fullName')).to.equal('John Smith');
      });

      it('should get the value from #_computedPropertyCache if already computed', function() {
        person._recomputeProperty('fullName');

        sinon.spy(person, 'fullName');

        expect(person._getComputedProperty('fullName')).to.equal('John Smith');
        expect(person.fullName.called).to.equal(false);

        person.fullName.restore();
      });
    });
  });
});
