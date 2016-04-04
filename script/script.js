var $message = $("#message"),
    $letters = $("#spaces"),
    $guesses = $("#guesses"),
    $apples = $("#apples");

var randomWord = (function() {
  var words = ["abacus", "quotient", "octothorpe", "proselytize", "stipend"];

  function without() {
    var new_arr = [],
        args = Array.prototype.slice.call(arguments);

    words.forEach(function(el) {
      if (args.indexOf(el) === -1) {
        new_arr.push(el);
      }
    });

    return new_arr;
  }

  return function() {
    var word = words[~~(Math.random() * words.length)];

    words = without(word);

    return word;
  };
})();

function Game() {
  this.word = randomWord();
  this.incorrect_guesses = 0;
  this.guesses = [];
  this.correct_spaces = 0;
  if (!this.word) {
    this.displayMessage("Sorry, I've run out of words!");
  }
  this.word = this.word.split("");
  this.init();
}

Game.prototype = {
  createBlanks: function() {
    var spaces = (new Array(this.word.length + 1)).join("<span></span>");

    $letters.find("span").remove();
    $letters.append(spaces);
    this.$spaces = $("#spaces span");
  },

  displayMessage: function(text) {
    $message.text(text);
  },

  fillBlanksFor: function(letter) {
    var self = this;

    self.word.forEach(function(l, i) {
      if (letter === l) {
        self.$spaces.eq(i).text(letter);
        self.correct_spaces++;
      }
    });
  },

  processGuess: function(e) {
    var letter = String.fromCharCode(e.which);

    if (notALetter(e.which)) { return; }
    if ($.inArray(letter, this.word) !== -1) {
      this.fillBlanksFor(letter);
      this.renderGuess(letter);
      if (this.correct_spaces == this.$spaces.length) {
        this.displayMessage("You win!");
      }
    } else {
      this.renderGuess(letter);
    }
  },

  renderGuess: function(letter) {
    $("<span />", {
      text: letter
    }).appendTo($guesses);
  },

  emptyGuesses: function() {
    $guesses.find("span").remove();
  },

  bind: function() {
    $(document).on("keypress", this.processGuess.bind(this));
  },

  init: function() {
    this.bind();
    this.createBlanks();
    this.emptyGuesses();
  }
};

function notALetter(code) {
  var a_code = 97,
      z_code = 122;

  return code < a_code || code > z_code;
}

new Game();
