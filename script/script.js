var $message = $("#message"),
    $letters = $("#spaces"),
    $guesses = $("#guesses"),
    $apples = $("#apples");
    $replay = $("#replay");

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
  num_guesses: 6,
  createBlanks: function() {
    var spaces = (new Array(this.word.length + 1)).join("<span></span>");

    $letters.find("span").remove();
    $letters.append(spaces);
    this.$spaces = $("#spaces span");
  },

  displayMessage: function(text) {
    $message.text(text);
  },

  toggleReplayLink: function(which) {
    $replay.toggle(which);
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

  duplicateGuess: function(letter) {
    var duplicate = this.guesses.indexOf(letter) !== -1;

    if (!duplicate) { this.guesses.push(letter); }

    return duplicate;
  },

  processGuess: function(e) {
    var letter = String.fromCharCode(e.which);

    if (notALetter(e.which)) { return; }
    if (this.duplicateGuess(letter)) { return; }

    if ($.inArray(letter, this.word) !== -1) {
      this.fillBlanksFor(letter);
      this.renderGuess(letter);
      if (this.correct_spaces == this.$spaces.length) {
        this.win();
      }
    } else {
      this.renderIncorrectGuess(letter);
    }
    if (this.incorrect_guesses === this.num_guesses) {
      this.lose();
    }
  },

  win: function() {
    this.unbind();
    this.displayMessage("You win!");
    this.toggleReplayLink(true);
    this.setGameStatus("win");
  },

  lose: function() {
    this.unbind();
    this.displayMessage("You're out of guesses!");
    this.toggleReplayLink(true);
    this.setGameStatus("lose");
  },

  setGameStatus: function(status) {
    $(document.body).removeClass();
    if (status) {
      $(document.body).addClass(status);
    }
  },

  renderIncorrectGuess: function(letter) {
    this.incorrect_guesses++;
    this.renderGuess(letter);
    this.setClass();
  },

  setClass: function() {
    $apples.removeClass().addClass("guess_" + this.incorrect_guesses);
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
    $(document).on("keypress.game", this.processGuess.bind(this));
  },

  unbind: function() {
    $(document).off(".game");
  },

  init: function() {
    this.bind();
    this.setClass();
    this.toggleReplayLink(false);
    this.createBlanks();
    this.emptyGuesses();
    this.setGameStatus();
    this.displayMessage("");
  }
};

function notALetter(code) {
  var a_code = 97,
      z_code = 122;

  return code < a_code || code > z_code;
}

new Game();

$replay.click(function(e) {
  e.preventDefault();

  new Game();
});
