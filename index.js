const userdata = []
const howManyInRow = 10
const howManyInCol = 10
const total = howManyInRow * howManyInCol
const width = window.innerWidth - 100
const height = window.innerHeight - 100

for (let i = 0; i < total; i++) {
  userdata.push(i)
}

const svgContainer =
    d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

const radius = Math.sqrt(width / howManyInRow * height / howManyInCol / Math.PI)

const node =
    svgContainer.selectAll("g")
    .data(userdata.map(function (v) {
      return {num: v, color: getRandomColor()}
    }))
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (/*not used*/d, i) {
      return `translate(${radius + (i % howManyInRow) * 2 * radius},
        ${radius + Math.floor(i / howManyInCol) * 2 * radius})`
    })

const circles =
    node.append("circle")
      .attr("id", function (d) { return `circle${d.num}` })
      .attr("r", radius - 3)
      .style("fill", "white")
      .style("stroke", function (d) { return d.color })
      .style("opacity", 0)

circles.transition()
  .duration(2000)
  .style("opacity", 1)

node.append("text")
  .style("fill", function (d) { return d.color })
  .attr("dx", function () { return -5 })
  .attr("dy", function () { return 4 })
  .text(function (d) { return d.num })

function getRandomColor() {
  return '#' + Math.random().toString(16).substr(-6)
}

function pickWinner(total) {
  return Math.floor(Math.random() * total)
}

document.getElementById("startBtn").addEventListener("click", function () {
  const t = d3.timer(function (elapsed) {
    // console.log(elapsed)
    if (elapsed > 8000) {
      t.stop()
      circles.transition()
          .duration(2000)
          .style("opacity", 0)

      d3.select(`#circle${pickWinner(total)}`)
          .transition()
          .style("opacity", 1)
    } else {
      d3.select(`#circle${Math.floor(Math.random() * howManyInCol*howManyInRow)}`)
          .transition()
          .duration(1000)
          .style("opacity", 0)
          .transition()
          .duration(1000)
          .style("opacity", 1)
      // .duration(10000)
      // .ease(d3.easeQuad)
      // .styleTween("opacity", function() {
      //   return d3.interpolateNumber(0, 1)
      // })
    }
  }, 2000)
})