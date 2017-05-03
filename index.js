const howManyInRow = 100
const howManyInCol = 100
const total = howManyInRow * howManyInCol
const radius = 12
const width = radius * 2 * howManyInRow
const height = radius * 2 * howManyInCol

const userdata = []
for (let i = 0; i < total; i++) {
  userdata.push(i)
}

const svgContainer =
    d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

const node =
    svgContainer.selectAll("g")
    .data(userdata.map(function (v) {
      return {num: v, color: getRandomColor()}
    }))
    .enter()
    .append("g")
    .attr("id", function (d) { return `node${d.num}` })
    .attr("class", "node")
    .attr("transform", function (/*not used*/d, i) {
      return `translate(${radius + (i % howManyInRow) * 2 * radius},
        ${radius + Math.floor(i / howManyInRow) * 2 * radius})`
    })

const circles =
    node.append("circle")
      .attr("id", function (d) { return `circle${d.num}` })
      .attr("r", radius - 3) // add some space between circles
      .style("fill", "white")
      .style("stroke", function (d) { return d.color })
      .style("opacity", 0)

circles.transition()
  .duration(3000)
  .style("opacity", 1)

const groupCh = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

node.append("text")
  .style("fill", function (d) { return d.color })
  .attr("dx", function () { return -5 })
  .attr("font-size", "4px")
  .text(function (d) {
    return getGroupNum(d.num)
  })

function getRandomColor() {
  return '#' + Math.random().toString(16).substr(-6)
}

function getGroupNum(num) {
  return groupCh[Math.floor(num / 10000)] + (num % 10000)
}

function pickWinner(total) {
  const winnerNum = Math.floor(Math.random() * total)
  const winner = getGroupNum(winnerNum)
  setTimeout(function () {
    alert(`The winner is... ${winner}!`)
    console.log(`The winner is... ${winner}!`)
  }, 2000)
  return winnerNum
}

document.getElementById("startBtn").addEventListener("click", function () {
  const t = d3.timer(function (elapsed) {
    if (elapsed > 8000) {
      t.stop()

      node
          .transition()
            .duration(2000)
            .style("opacity", 0)
            .call(endall, function() {
                d3.select(`#node${pickWinner(total)}`).style("opacity", 1)
            })
    } else {
      for (let i=0; i<total/100; i++) {
        d3.select(`#node${Math.floor(Math.random() * total)}`)
            .transition()
              .duration(1000)
              .style("opacity", 0)
            .transition()
              .duration(1000)
              .style("opacity", 1)
      }
    }
  }, 2000)
})

function endall(transition, callback) {
  if (typeof callback !== "function") throw new Error("Wrong callback in endall")
  if (transition.size() === 0) { callback() }
  let n = 0
  transition
      .on("start", function() { ++n })
      .on("end", function() { if (!--n) callback.apply(this, arguments) })
}

// prevent back button mistake
window.onbeforeunload = function() { return "Are you sure?" }