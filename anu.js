const fs = require('fs')
const chalk = require('chalk')

// For Number
global.ownerNumber = '48666666672@s.whatsapp.net'
global.contactOwner = '48666666672'

// For Name
global.ownerName = 'DJong'
global.credits = '© DJbots-MD'
global.botName = 'DJBots-MD'

// Message
global.messOwner = 'Only For Owner'
global.messPrem = 'Sorry you are not a premium user'

global.keyopenai = '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'

// Session Name
global.sessionName = 'session'

// Thumbnail
global.thumb = 'https://i.ibb.co/dPz6kCy/IMG-20230806-WA0040.jpg'


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})