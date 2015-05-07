App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.resource('book', { path: '/books/:book_id'});
  this.resource('genre', { path: '/genres/:genre_id'});
  this.resource('reviews', function() {
    this.route('new');
  });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      books: this.store.findAll('book'),
      genres: this.store.findAll('genre')
    });
  },
  setupController: function(controller, model) {
    controller.set('books', model.books);
    controller.set('genres', model.genres);
  }
});

App.IndexController = Ember.Controller.extend({});

App.BooksController = Ember.ArrayController.extend({
  sortProperties: ['title']
});
App.GenresController = Ember.ArrayController.extend({
  sortProperties: ['name']
});


App.ReviewsNewRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      book: this.store.createRecord('book'),
      genres: this.store.findAll('genre')
    });
  },
  setupController: function(controller, model) {
    controller.set('model', model.book);
    controller.set('genres', model.genres);
  },
  actions: {
    willTransition: function(transition) {
      if(this.currentModel.book.get('isNew')) {
        if(confirm("Are you sure you want to abandon progress?")) {
          this.currentModel.book.destroyRecord();
        } else {
          transition.abort();
        }
      }
    }
  }
});
App.ReviewsNewController = Ember.Controller.extend({
  ratings: [5,4,3,2,1],
  actions: {
    createReview: function() {
      var controller = this;
      this.get('model').save().then(function() {
        controller.transitionToRoute('index');
      });
    }
  }
});

App.ApplicationAdapter = DS.FixtureAdapter.extend({
  // simulates reall AJAX calls by waiting a number of milliseconds.
  // latency: 200
});

App.BookDetailsComponent = Ember.Component.extend({
  classNameBindings: ['ratingClass'],
  ratingClass: function() {
    return "rating-" + this.get('book.rating');
  }.property('book.rating')
});

App.IndexView = Ember.View.extend({
  willAnimateIn : function () {
    this.$().css("opacity", 0);
  },
  willAnimateOut : function () {
    this.$().css("opacity", 0);
  },
  animateIn : function (done) {
    this.$().fadeTo(900, 1, done);
  },
  animateOut : function (done) {
    this.$().fadeTo(900, 0, done);
  }
});

App.BookView = Ember.View.extend({
  willAnimateIn : function () {
    this.$().css("opacity", 0);
  },
  willAnimateOut : function () {
    this.$().css("opacity", 0);
  },
  animateIn : function (done) {
    this.$().fadeTo(900, 1, done);
  },
  animateOut : function (done) {
    this.$().fadeTo(900, 0, done);
  }
});

App.ReviewsNewView = Ember.View.extend({
  willAnimateIn : function () {
    this.$().css("opacity", 0);
  },
  willAnimateOut : function () {
    this.$().css("opacity", 0);
  },
  animateIn : function (done) {
    this.$().fadeTo(900, 1, done);
  },
  animateOut : function (done) {
    this.$().fadeTo(900, 0, done);
  }
});

App.GenreView = Ember.View.extend({
  willAnimateIn : function () {
    this.$().css("opacity", 0);
  },
  willAnimateOut : function () {
    this.$().css("opacity", 0);
  },
  animateIn : function (done) {
    this.$().fadeTo(900, 1, done);
  },
  animateOut : function (done) {
    this.$().fadeTo(900, 0, done);
  }
});

App.Book = DS.Model.extend({
  title: DS.attr(),
  author: DS.attr(),
  review: DS.attr(),
  rating: DS.attr('number'),
  amazon_id: DS.attr(),
  genre: DS.belongsTo('genre'),
  url: function() {
    return "http://www.amazon.com/gp/product/"+this.get('amazon_id')+"/adamfortuna-20";
  }.property('amazon_id'),
  image: function() {
    return "http://images.amazon.com/images/P/"+this.get('amazon_id')+".01.ZTZZZZZZ.jpg";
  }.property('amazon_id')
});

App.Genre = DS.Model.extend({
  name: DS.attr(),
  books: DS.hasMany('book', {async: true})
});

App.Book.FIXTURES = [
  {
    id: 1,
    title: 'String Theory and M-Theory: A Modern Introduction',
    author: 'Katrin Becker, Melanie Becker, John H.Schwarz',
    review: 'String theory is one of the most exciting and challenging areas of modern theoretical physics. This book guides the reader from the basics of string theory to recent developments. It introduces the basics of perturbative string theory, world-sheet supersymmetry, space-time supersymmetry, conformal field theory and the heterotic string, before describing modern developments, including D-branes, string dualities and M-theory. It then covers string geometry and flux compactifications, applications to cosmology and particle physics, black holes in string theory and M-theory, and the microscopic origin of black-hole entropy. It concludes with Matrix theory, the AdS/CFT duality and its generalizations. This book is ideal for graduate students and researchers in modern string theory, and will make an excellent textbook for a one-year course on string theory. It contains over 120 exercises with solutions, and over 200 homework problems with solutions available on a password protected website for lecturers at www.cambridge.org/9780521860697.',
    rating: 5,
    amazon_id: '0521860695',
    genre: 1
  },
  {
    id: 2,
    title: 'A First Course in String Theory (Second Edition)',
    author: 'Barton Zwiebach',
    review: "Barton Zwiebach is once again faithful to his goal of making string theory accessible to undergraduates. Complete and thorough in its coverage, the author presents the main concepts of string theory in a concrete and physical way in order to develop intuition before formalism, often through simplified and illustrative examples. This new edition now includes AdS/CFT correspondence, which is the hottest area of string theory right now as well as introducing superstrings. The text is perfectly suited to introductory courses in string theory for students with a background in mathematics and physics. New sections cover strings on orbifolds, cosmic strings, moduli stabilization, and the string theory landscape.",
    rating: 5,
    amazon_id: '0521880327',
    genre: 2
  },
  {
    id: 3,
    title: 'A First Course in String Theory (First Edition)',
    author: 'Barton Zwiebach',
    review: 'An accessible introduction to string theory, this book provides a detailed and self-contained demonstration of the main concepts involved. The first part deals with basic ideas, reviewing special relativity and electromagnetism while introducing the concept of extra dimensions. D-branes and the classical dynamics of relativistic strings are discussed next, and the quantization of open and closed bosonic strings in the light-cone gauge, along with a brief introduction to superstrings. The second part begins with a detailed study of D-branes followed by string thermodynamics. It discusses possible physical applications, and covers T-duality of open and closed strings, electromagnetic fields on D-branes, Born/Infeld electrodynamics, covariant string quantization and string interactions. Primarily aimed as a textbook for advanced undergraduate and beginning graduate courses, it will also be ideal for a wide range of scientists and mathematicians who are curious about string theory.',
    rating: 3,
    amazon_id: '0521831431',
    genre: 3
  },
  {
    id: 4,
    title: "String Theory, Vol. 1 (Cambridge Monographs on Mathematical Physics)",
    author: 'Joseph Polchinski',
    review: "The two volumes that comprise String Theory provide an up-to-date, comprehensive account of string theory. Volume 1 provides a thorough introduction to the bosonic string, based on the Polyakov path integral and conformal field theory. The first four chapters introduce the central ideas of string theory, the tools of conformal field theory, the Polyakov path integral, and the covariant quantization of the string. The book then treats string interactions: the general formalism, and detailed treatments of the tree level and one loop amplitudes. Toroidal compactification and many important aspects of string physics, such as T-duality and D-branes are also covered, as are higher-order amplitudes, including an analysis of their finiteness and unitarity, and various nonperturbative ideas. The volume closes with an appendix giving a short course on path integral methods, followed by annotated references, and a detailed glossary.",
    rating: 5,
    amazon_id: '0521672279',
    genre: 2
  },
  {
    id: 5,
    title: "String Theory, Vol. 2 (Cambridge Monographs on Mathematical Physics)",
    author: 'Joseph Polchinski',
    review: 'Volume 2: Superstring Theory and Beyond, begins with an introduction to supersymmetric string theories and goes on to a broad presentation of the important advances of recent years. The book first introduces the type I, type II, and heterotic superstring theories and their interactions. It then goes on to present important recent discoveries about strongly coupled strings, beginning with a detailed treatment of D-branes and their dynamics, and covering string duality, M-theory, and black hole entropy, and discusses many classic results in conformal field theory. The final four chapters are concerned with four-dimensional string theories, and have two goals: to show how some of the simplest string models connect with previous ideas for unifying the Standard Model; and to collect many important and beautiful general results on world-sheet and spacetime symmetries.',
    rating: 4,
    amazon_id: '0521672287',
    genre: 2
  },
  {
    id: 6,
    title: 'Supergravity',
    author: 'Daniel Z.Freedman',
    review: 'Supergravity, together with string theory, is one of the most significant developments in theoretical physics. Written by two of the most respected workers in the field, this is the first-ever authoritative and systematic account of supergravity. The book starts by reviewing aspects of relativistic field theory in Minkowski spacetime. After introducing the relevant ingredients of differential geometry and gravity, some basic supergravity theories (D=4 and D=11) and the main gauge theory tools are explained. In the second half of the book, complex geometry and N=1 and N=2 supergravity theories are covered. Classical solutions and a chapter on AdS/CFT complete the book. Numerous exercises and examples make it ideal for Ph.D. students, and with applications to model building, cosmology and solutions of supergravity theories, it is also invaluable to researchers. A website hosted by the authors, featuring solutions to some exercises and additional reading material, can be found at www.cambridge.org/supergravity.',
    rating: 5,
    amazon_id: '0521194016',
    genre: 2
  },
  {
    id: 7,
    title: 'Introduction to Strings and Branes',
    author: 'Peter West',
    review: 'Supersymmetry, strings and branes are believed to be the essential ingredients in a single unified consistent theory of physics. This book gives a detailed, step-by-step introduction to the theoretical foundations required for research in strings and branes. After a study of the different formulations of the bosonic and supersymmetric point particles, the classical and quantum bosonic and supersymmetric string theories are presented. This book includes accounts of brane dynamics and D-branes and the T, S and U duality symmetries of string theory. The historical derivation of string theory is given as well as the sum over the world-sheet approach to the interacting string. More advanced topics include string field theory and Kac-Moody symmetries. The book contains pedagogical accounts of conformal quantum field theory, supergravity theories, Clifford algebras and spinors, and Lie algebras. It is essential reading for graduate students and researchers wanting to learn strings and branes.',
    rating: 5,
    amazon_id: '0521817471',
    genre: 2
  }
];

App.Genre.FIXTURES = [
  {
    id: 1,
    name: 'Textbook',
    books: [1, 2, 3]
  },
  {
    id: 2,
    name: 'Report',
  },
  {
    id: 3,
    name: 'Monograph',
    books: [4,5,7]
  }
];
