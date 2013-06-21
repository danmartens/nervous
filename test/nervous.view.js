describe('Nervous.View', function() {
  beforeEach(function() {
    $('body').append('<div id="fixture"></div>');
  });

  afterEach(function() {
    $('#fixture').remove();
  });

  describe('#_createEl()', function() {
    var view;

    view = null;

    beforeEach(function() {
      view = Nervous.View.create({
        tagName: 'p'
      });
    });

    it('should create an element with the correct tag name', function() {
      expect(view.el.tagName).to.equal('P');
      expect(view.$el.get(0)).to.equal(view.el);
    });
  });

  describe('#_renderTemplate', function() {
    var xhr, requests;

    beforeEach(function() {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];

      xhr.onCreate = function(request) {
        requests.push(request);
      };
    });

    afterEach(function() {
      xhr.restore();
    });

    it('should render a template from a string if #template is defined', function(done) {
      var view;

      view = Nervous.View.create({
        template: '<div id="test-template"></div>'
      });
      
      view.render().then(function() {
        expect(view.$el.find('#test-template').length).to.equal(1);
        done();
      });
    });

    it('should request a template via ajax if #templatePath is defined', function(done) {
      var view;

      view = Nervous.View.create({
        templatePath: '/templates/test.html'
      });

      view.render().then(function() {
        expect(view.$el.find('#test-template-path').length).to.equal(1);
        done();
      });
      
      requests[0].respond(200, {
        "Content-Type": "text/html"
      }, '<div id="test-template-path"></div>');
    });
  });
});
