const fs = require('fs')
const async = require('async')
const needle = require('needle')
const path = require('path')

const neededFolders = [
	path.join(__dirname, 'local'),
	path.join(__dirname, 'local', 'white'),
	path.join(__dirname, 'local', 'color'),
]

neededFolders.forEach(folder => {
	if (!fs.existsSync(folder))
	    fs.mkdirSync(folder)
})

const whiteFolder = neededFolders[1]
const colorFolder = neededFolders[2]

const queueDelay = 0

const queue = async.queue((task, cb) => {
    if (!task.logo) {
      cb()
      return
    }

    const whiteImgLoc = path.join(whiteFolder, task.logo.substr(1))

    const colorImgLoc = path.join(colorFolder, task.logo.substr(1))

    if (fs.existsSync(whiteImgLoc) && fs.existsSync(colorImgLoc)) {
      cb()
      return
    }

    let ticked = 0

    function tick() {
      ticked++
      if (ticked == 2)
        setTimeout(() => { cb() }, queueDelay)
    }

    console.log('Downloading logo for ' + task.channel)

    console.log(queue.length() + ' / ' + countLogos)

    // download channel logo (color)
    needle.get('https://image.tmdb.org/t/p/w200'+task.logo, (err, res) => {
      if (!err && res.statusCode == 200)
        fs.writeFileSync(colorImgLoc, res.raw)
      tick()
    })

    // download channel logo (white)
    needle.get('https://image.tmdb.org/t/p/w200_filter(negate,000,666)'+task.logo, (err, res) => {
      if (!err && res.statusCode == 200)
        fs.writeFileSync(whiteImgLoc, res.raw)
      tick()
    })
}, 1)

queue.drain(() => {
	console.log('Finished downloading logos')
	process.exit(0)
})

let allLogos = {}

try {
  allLogos = JSON.parse(fs.readFileSync('./logo_paths.json', 'utf8'))
} catch(e) {}

const countLogos = Object.keys(allLogos).length

for (const [channel, logo] of Object.entries(allLogos || {})) {
	queue.push({ logo, channel })
}
