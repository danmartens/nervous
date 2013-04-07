describe('Nervous', function() {
  var obj = null;

  beforeEach(function() {
    obj = { a: { b: 'c' } };
  });

  describe('#noop()', function() {
    it('should return the first argument passed to it', function() {
      expect(Nervous.noop('test')).to.equal('test');
    });
  });

  describe('#namespace()', function() {
    it('should create the path if it doesn\'t exist', function() {
      Nervous.namespace(obj, 'a.d.e', 'f');
      expect(obj.a.d.e).to.equal('f');
    });
  });

  describe('#get()', function() {
    it('should get a value from a path', function() {
      expect(Nervous.get(obj, 'a.b')).to.equal('c');
    });
  });

  describe('#set()', function() {
    it('should set a value at a path', function() {
      Nervous.set(obj, 'a.b', 'd');
      expect(obj.a.b).to.equal('d');
    });
  });

  describe('#extend()', function() {
    it('should append the properties of passed objects onto the first object', function() {
      var o1, o2;

      o1 = { a: 'b' };
      o2 = { c: 'd' };

      Nervous.extend(o1, o2);
      expect(o1.c).to.equal('d');
    });

    it('should override existing properties', function() {
      var o1, o2, o3;

      o1 = { a: 'b' };
      o2 = { a: 'c' };
      o3 = { a: 'd' };

      Nervous.extend(o1, o2, o3);
      expect(o1.a).to.equal('d');
    });
  });

  describe('#create()', function() {
    it('should create a new instance of a class', function() {
      var Person, person;

      Person = function() {};
      person = Nervous.create(Person);

      expect(person instanceof Person).to.equal(true);
    });

    it('should append properties to the instance of the class', function() {
      var Person, person;

      Person = function() {};

      person = Nervous.create(Person, {
        name: 'John Smith'
      });

      expect(person.name).to.equal('John Smith');
    });
  });
});