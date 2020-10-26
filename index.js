const express = require('express')
const app = express()

const puppeteer = require('puppeteer')
const getPort = require('get-port')

const chromeOptions = {
	headless: false,
	defaultViewport: null
}

const fs = require('fs')
const path = require('path')

const args = (process.argv || []).slice(2)

if (!args[3]) { console.log ('No margin set, using "20"'); args[3] = 20 }

if (!args[2]) { console.log ('No box size set, using "200"'); args[2] = 200 }

if (!args[1]) { console.log ('No background color set, using "transparent"'); args[1] = 'transparent' }

if (!args[0]) { console.log ('No logo preference set, using "color"'); args[0] = 'color' }

const config = {
	delay: 0, // 0ms
	logo: args[0],
	backgroundColor: args[1],
	boxSize: parseInt(args[2]),
	margin: parseInt(args[3]),
	omitBackground: false
}

if (config.logo == 'color')
	config.tmdbPrefix = 'w200'
else
	config.tmdbPrefix = 'w200_filter(negate,000,666)'

console.log(config)

if (config.backgroundColor == 'transparent')
	config.omitBackground = true

app.get('/new-image-*', (req, res) => {
	const imgWidth = config.boxSize - (config.margin * 2)
	res.send('<html style="padding: 0; margin: 0"><body style="background-color: #'+config.backgroundColor+'; padding: 0; margin: 0"><div style="width: '+imgWidth+'px; height: '+imgWidth+'px; margin: '+config.margin+'px; background: url(\'https://image.tmdb.org/t/p/'+config.tmdbPrefix+'/'+req.path.replace('/new-image-','')+'.png\') no-repeat center; background-size: contain"></div></body></html>')
})


async function processImage(imgPath) {
	const imgLoc = path.join(imgFolder, imgPath.substr(1))
	if (fs.existsSync(imgLoc))
		return Promise.resolve({ quick: true })
	const browser = await puppeteer.launch({ defaultViewport: { width: config.boxSize, height: config.boxSize } })
	const page = await browser.newPage()
	await page.goto('http://localhost:' + config.port + '/new-image-' + imgPath.replace('/','').replace('.png',''), { waitUntil: 'networkidle0' })
	await page.screenshot({ path: imgLoc, omitBackground: config.omitBackground })
	await browser.close()
	return Promise.resolve()
}

const logoPaths = JSON.parse(fs.readFileSync('./logo_paths.json', 'utf8'))

const logoCount = Object.keys(logoPaths).length

const async = require('async')

let successCount = 0
let errorCount = 0

const queue = async.queue((task, cb) => {
	console.log(queue.length() + ' / '  + logoCount)
	processImage(task.url).then(resp => {
		successCount++
		console.log('success')
		if ((resp || {}).quick)
			cb()
		else
			setTimeout(() => { cb() }, config.delay)
	}).catch(err => {
		errorCount++
		console.log('error')
		setTimeout(() => { cb() }, config.delay)
	})
})

queue.drain(() => {
  console.log('end')
  console.log('success: ' + successCount + ' / error: ' + errorCount)
  process.exit(0)
})

const exportFolder = path.join(__dirname, 'export')

if (!fs.existsSync(exportFolder))
    fs.mkdirSync(exportFolder)

const imgFolder = path.join(exportFolder, config.backgroundColor + '-' + config.logo)

if (!fs.existsSync(imgFolder))
    fs.mkdirSync(imgFolder)

getPort({ port: 9192 }).then(port => {
	config.port = port
	app.listen(config.port, async () => {
		for (const [key, value] of Object.entries(logoPaths))
			queue.push({ url: value })
	})
}).catch(err => {
	console.error(err)
	process.exit(1)
})
