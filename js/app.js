// * Create a list that holds all of your cards
let allCards = ["fa-anchor", "fa-bolt", "fa-bicycle", "fa-bomb", "fa-cube", "fa-diamond", "fa-paper-plane-o", "fa-leaf"];

// http://albert-gonzalez.github.io/easytimer.js/
let timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
  $('#timer').html(timer.getTimeValues().toString());
});

// set counters
let moves=0, match=0, trackCard=[], oneStar=22, twoStar=16, time=false;

$('#repeat').click(repeat);

function displayDeck(card) {
  $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

function displayCards(n) {
  for (let i = 0; i < n; i++) {
    allCards = shuffle(allCards);
    allCards.forEach(displayDeck);
  }
}

function displayStars(n) {
  let i=0;
  while (i < n) {
    $('#stars').append('<li><i class="fa fa-star"></i></li>');
    i++;
  }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function toggleCard() {
  if (time == false) {
    time = true;
    timer.start();
  }
  if (trackCard.length === 0) {
    $(this).toggleClass("show open").animateCss('flipInY');
    trackCard.push($(this));
    disableCLick(true);
  }
  else if (trackCard.length === 1) {
    countMoves();
    $(this).toggleClass("show open").animateCss('flipInY');
    trackCard.push($(this));
    setTimeout(matchOpenCards, 1100);
  }
}

function countMoves() {
  moves += 1;
  $('#moves').html(`${moves} Moves`);
  if (moves == oneStar || moves == twoStar) {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
  }
}

function disableCLick(f) {
  if (f==true){
    trackCard.forEach(function (card) {
      card.off('click');
    });
  } else {
    trackCard[0].click(toggleCard);
  }
}


function matchOpenCards() {
  if (trackCard[0][0].firstChild.className == trackCard[1][0].firstChild.className) {
    trackCard[0].addClass("match").animateCss('pulse');
    trackCard[1].addClass("match").animateCss('pulse');
    disableCLick(true);
    trackCard = [];
    setTimeout(displayResult, 1000);
  }
  else {
    trackCard[0].toggleClass("show open").animateCss('flipInY');
    trackCard[1].toggleClass("show open").animateCss('flipInY');
    disableCLick(false);
    trackCard = [];
  }
}


function displayResult(){
  match += 1;
  if (match == allCards.length) {
    timer.pause();
    let playTime = timer.getTimeValues().toString();
    $('#deck-container')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append(endGame(moves,calStar(moves),playTime));
  }
}

function calStar(m){
  let star=0;
  if (m >= oneStar) {
    star=1;
  }else if (m >= twoStar) {
    star=2;
  }else {
    star=3;
  }
  return star;
}

function endGame(moves,star,time) {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Congratulations! You Won!',
    text: 'With ' + moves + ' Moves and ' + star + ' ' + (( star> 1) ? "Stars" : "Star") + ' in ' + time + '.\n Woooooo!',
    type: 'success',
    confirmButtonColor: '#02ccba',
    confirmButtonText: 'Play again!'
  }).then(function (isConfirm) {
    if (isConfirm) {
      repeat();
    }
  })
}

function repeat() {
  moves = 0;
  match = 0;
  $('#deck').empty();
  $('#stars').empty();
  $('#deck-container')[0].style.display = "";
  time=false;
  timer.stop();
  $('#timer').html("00:00:00");
  runGame();
}

$.fn.extend({
  animateCss: function(animationName) {
    var animationEnd = 'animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd';
    this.addClass(animationName).one(animationEnd, function() {
      $(this).removeClass(animationName);
    });
    return this;
  }
});
function runGame() {
  displayCards(2);
  displayStars(3);
  $('.card').click(toggleCard);
  $('#moves').html("0 Moves");
}

runGame();
