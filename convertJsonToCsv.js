const fs = require('fs')

/*fs.readFile('users.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  const users = JSON.parse(data).submit
  console.log(users)
  let csvStr = ''
  for (let user in users) {
    console.log(user)
    csvStr += `${user.email},${user.phone}\n`
    break
  }
  console.log(csvStr)
})*/

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('users.json')
});

let csvStr = ""
lineReader.on('line', function (line) {
  if (line.indexOf('"email" : ') !== -1) {
    csvStr += line.split('"email" : ')[1].trim().replace(/"/g, '')
  } else if (line.indexOf('"phone" : ') !== -1) {
    csvStr += line.split('"phone" : ')[1].trim().replace(/"/g, '') + '\n'
  }
})

lineReader.on('close', function () {
  fs.writeFile('users.csv', csvStr, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  })
})
