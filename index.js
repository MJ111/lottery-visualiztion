const random = new Random()

$.get("users.csv", function(data) {
  console.log("loaded")
  const users = parseCSV(data)
  const runner = showWinner(users)

  $("#winner-btn").on("click", runner)
  $("#retry-btn").on("click", function () {
    if (rank > 1) {
      rank--
      runner()
    }
  })
})

function parseCSV(data) {
  const users = []
  const splited = data.split("\n")
  splited.forEach(function(val, i) {
    if (i === splited.length-1) { // last black new line
      return
    }
    let user = val.split(",")
    let phone = user[1]
    users.push({origin: user, email: user[0].slice(0, 4), phone: phone.slice(phone.length-4)})
  })
  return users
}

function shuffle(array) {
  const dup = array.slice()
  for (let i = dup.length; i; i--) {
    let j = random.integer(0, i-1);
    [dup[i - 1], dup[j]] = [dup[j], dup[i - 1]];
  }
  return dup
}

const fourthsNumber = 40
let rank = 1 // for retry
function* winnerMaker(users) {
  while (rank < 5) {
    if (rank < 4) {
      yield {rank: rank++, winner: users.splice(random.integer(0, users.length-1), 1)[0]}
    } else if (rank === 4) {
      yield {rank: rank++, winner: shuffle(users).slice(0, fourthsNumber)}
    }
  }
}

function showWinner(users) {
  const gen = winnerMaker(users)

  return function () {
    let value = gen.next().value

    if (value === undefined) {
      return
    }

    let rank = value.rank
    let winner = value.winner
    let animateCallback = function () {
      showModal(4-rank, winner.email, winner.phone)
      log(4-rank, winner.origin)
    }
    if (rank === 4) {
      animateCallback = function () {
        show4thsModal(winner)
        log("4ths", winner.map(function (val) {
          return val.origin
        }))
      }
    }
    $('#box').animateCss('wobble', animateCallback)
  }
}

function showModal(rank, email, phone) {
  $("#modal").show()
  $("#rank").html(rank)
  $("#email .right").html(email)
  $("#phone .right").html(phone)
}

function show4thsModal(users) {
  $("#fourths-modal").show()
  users.forEach(function(val) {
    $("#fourths-container").append(`       
      <div class="fourth-desc" >
        <div class="left">Email 앞 4글자</div><div class="right">${val.email}</div>
        <div class="left">Phone 뒤 4글자</div><div class="right">${val.phone}</div>
      </div>`)
  })
}

$(".close").on("click", function() {
  $(".modal").hide()
})

var winnerResult = {}
function log(...msg) {
  console.log(msg)
  winnerResult[msg[0]] = msg[1]
}

$.fn.extend({
  animateCss: function (animationName, animationEndCallback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName)
      animationEndCallback()
    })
  }
})

// prevent back button mistake
window.onbeforeunload = function() { return true }