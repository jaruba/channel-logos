const fs = require('fs')
const path = require('path')

const exportFolder = path.join(__dirname, 'export')

if (!fs.existsSync(exportFolder)) {
    console.error(Error('"./export" folder does not exist'))
    process.exit(1)
}

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

let types = getDirectories(exportFolder)

if (!(types || []).length) {
	console.error(Error('"./export" folder does not have any subfolders'))
}

types = types.map(el => el.split(path.sep).pop())

console.log('Image export types: ' + JSON.stringify(types))

const async = require('async')
const processor = require('./index')

const queue = async.queue((task, cb) => {
	console.log('Started processing images for type:')
	console.log(task)
	processor({ logo: task.logo, backgroundColor: task.backgroundColor }).then(() => {
		cb()
	}).catch(() => {
		cb()
	})
}, 1)

queue.drain(() => {
	console.log('Finished processing all image types')
	process.exit(0)
})

types.forEach(type => {
	queue.push({ logo: type.split('-')[1], backgroundColor: type.split('-')[0] })
})
