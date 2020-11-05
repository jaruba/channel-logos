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

// defaults:

let config = {
	delay: 0, // 0ms
	logo: 'color',
	backgroundColor: 'transparent',
	boxSize: 200,
	margin: 20,
	omitBackground: false
}

let imgFolder = ''

function addExtras(config) {

	if (config.logo == 'color')
		config.tmdbPrefix = 'w200'
	else
		config.tmdbPrefix = 'w200_filter(negate,000,666)'

	console.log(config)

	if (config.backgroundColor == 'transparent')
		config.omitBackground = true


	imgFolder = path.join(exportFolder, config.backgroundColor + '-' + config.logo)

	if (!fs.existsSync(imgFolder))
		fs.mkdirSync(imgFolder)

	return config

}

app.get('/local-image-*', (req, res) => {
	const filename = req.path.replace('/local-image-','')+'.png'
	res.sendFile(path.join(__dirname, 'custom', filename))
})

app.get('/new-image-*', (req, res) => {
	const imgWidth = config.boxSize - (config.margin * 2)
	const filename = req.path.replace('/new-image-','')+'.png'
	let imgPath
	let extraStyle = ''
	if (fs.existsSync(path.join(__dirname, 'custom', filename))) {
		imgPath = 'http://localhost:' + config.port + req.path.replace('/new-image-','/local-image-')
		if (config.logo == 'white')
			extraStyle = '; filter: brightness(0.3) invert(1) grayscale(100%)'
	} else
		imgPath = 'https://image.tmdb.org/t/p/'+config.tmdbPrefix+'/'+filename
	res.send('<html style="padding: 0; margin: 0"><body style="background-color: #'+config.backgroundColor+'; padding: 0; margin: 0"><div style="width: '+imgWidth+'px; height: '+imgWidth+'px; margin: '+config.margin+'px; background: url(\''+imgPath+'\') no-repeat center; background-size: contain'+extraStyle+'"></div></body></html>')
})


async function processImage(imgPath) {
	const imgLoc = path.join(imgFolder, imgPath.substr(1))
	if (fs.existsSync(imgLoc))
		return Promise.resolve({ quick: true })
	const browser = await puppeteer.launch({ defaultViewport: { width: config.boxSize, height: config.boxSize, deviceScaleFactor: 2 } })
	const page = await browser.newPage()
	await page.goto('http://localhost:' + config.port + '/new-image-' + imgPath.replace('/','').replace('.png',''), { waitUntil: 'networkidle0' })
	await page.screenshot({ path: imgLoc, omitBackground: config.omitBackground })
	await browser.close()
	return Promise.resolve()
}

const logoPaths = JSON.parse(fs.readFileSync('./logo_paths.json', 'utf8'))

const logoCount = Object.keys(logoPaths).length

const async = require('async')

const exportFolder = path.join(__dirname, 'export')

if (!fs.existsSync(exportFolder))
    fs.mkdirSync(exportFolder)

function init() {
	return new Promise((resolve, reject) => {
		config = addExtras(config)

		getPort({ port: 9192 }).then(port => {
			config.port = port

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
			}, 3)

			queue.drain(() => {
				resolve()
			})
			app.listen(config.port, async () => {
				for (const [key, value] of Object.entries(logoPaths))
					queue.push({ url: value })
			})
		}).catch(err => {
			reject(err)
		})
	})
}

if (require.main === module) {
	// started with `npm run`

	const args = (process.argv || []).slice(2)

	if (!args[3]) console.log ('No margin set, using "20"')
	else config.margin = parseInt(args[3])

	if (!args[2]) console.log ('No box size set, using "200"')
	else config.boxSize = parseInt(args[2])

	if (!args[1]) console.log ('No background color set, using "transparent"')
	else config.backgroundColor = args[1]

	if (!args[0]) console.log ('No logo preference set, using "color"');
	else config.logo = args[0]

	init().then(() => {
		process.exit(0)
	}).catch(err => {
		console.log(err)
		process.exit(1)
	})

} else {
	// required as a module
	module.exports = newConfig => {
		for (const [key, value] of Object.entries(newConfig || {}))
			config[key] = newConfig[key]
		return init()
	}
}


