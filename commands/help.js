const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╭╺╼━━─━■━━━⬣━━━■━━─━━╾⬣
┣⬣ *BOT NAME ${settings.botName || 'KNOX-MD'}*  
┣⬣ Version: *${settings.version || '3.0.0'}*
┣⬣ by ${settings.botOwner || 'CODEBREAKER'}
┣⬣ YT : ${global.ytch}
╰━━━━━━━━━━━━━━━━━━━━⬣



╭╺╼━─━■「GENERAL」■━━─━╾╸
┣➤ .knox or .menu
┣➤ .ping
┣➤ .alive
┣➤ .tts
┣➤ .owner
┣➤ .joke
┣➤ .quote
┣➤ .fact
┣➤ .weather
┣➤ .news
┣➤ .attp
┣➤ .lyrics
┣➤ .8ball
┣➤ .groupinfo
┣➤ .admins 
┣➤ .vv
┣➤ .trt
┣➤ .ss
┣➤ .jid
┣➤ .url
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「ADMIN」■━━─━╾╸
┣➤ .ban
┣➤ .promote
┣➤ .demote
┣➤ .mute
┣➤ .unmute
┣➤ .del
┣➤ .kick
┣➤ .warnings
┣➤ .warn
┣➤ .antilink
┣➤ .antibadword
┣➤ .clear
┣➤ .tag
┣➤ .tagall
┣➤ .tagnotadmin
┣➤ .hidetag
┣➤ .chatbot
┣➤ .resetlink
┣➤ .antitag
┣➤ .welcome
┣➤ .goodbye
┣➤ .setgdesc
┣➤ .setgname
┣➤ .setgpp
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「OWNER」■━━─━╾╸
┣➤ .mode
┣➤ .clearsession
┣➤ .antidelete
┣➤ .cleartmp
┣➤ .update
┣➤ .settings
┣➤ .setpp
┣➤ .autoreact
┣➤ .autostatus
┣➤ .autostatus react
┣➤ .autotyping
┣➤ .autoread
┣➤ .anticall
┣➤ .pmblocker
┣➤ .pmblocker setmsg
┣➤ .setmention
┣➤ .mention
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「IMG/STICKER」■━━─━╾╸
┣➤ .blur
┣➤ .simage
┣➤ .sticker
┣➤ .removebg
┣➤ .remini
┣➤ .crop
┣➤ .tgsticker
┣➤ .meme
┣➤ .take
┣➤ .emojimix
┣➤ .igs
┣➤ .igsc
╰━━━━━━━━━━━━━━━━⬣  

╭╺╼━─━■「PIES」■━━─━╾╸
┣➤ .pies
┣➤ .china 
┣➤ .indonesia 
┣➤ .japan 
┣➤ .korea 
┣➤ .hijab
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「GAME」■━━─━╾╸
┣➤ .tictactoe
┣➤ .hangman
┣➤ .guess
┣➤ .trivia
┣➤ .answer
┣➤ .truth
┣➤ .dare
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「AI」■━━─━╾╸
┣➤ .gpt
┣➤ .gemini
┣➤ .imagine
┣➤ .flux
┣➤ .sora
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「FUN」■━━─━╾╸
┣➤ .compliment
┣➤ .insult
┣➤ .flirt 
┣➤ .shayari
┣➤ .goodnight
┣➤ .roseday
┣➤ .character
┣➤ .wasted
┣➤ .ship
┣➤ .simp
┣➤ .stupid
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「TXT」■━━─━╾╸
┣➤ .metallic 
┣➤ .ice 
┣➤ .snow 
┣➤ .impressive 
┣➤ .matrix 
┣➤ .light 
┣➤ .neon 
┣➤ .devil 
┣➤ .purple 
┣➤ .thunder 
┣➤ .leaves 
┣➤ .1917 
┣➤ .arena 
┣➤ .hacker 
┣➤ .sand 
┣➤ .blackpink 
┣➤ .glitch 
┣➤ .fire 
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「DOWNLOAD」■━━─━╾╸
┣➤ .play
┣➤ .song
┣➤ .spotify
┣➤ .instagram
┣➤ .facebook
┣➤ .tiktok
┣➤ .video
┣➤ .ytmp4
┣➤ .pin
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「MISC」■━━─━╾╸
┣➤ .heart
┣➤ .horny
┣➤ .circle
┣➤ .lgbt
┣➤ .lolice
┣➤ .its-so-stupid
┣➤ .namecard 
┣➤ .oogway
┣➤ .tweet
┣➤ .ytcomment 
┣➤ .comrade 
┣➤ .gay 
┣➤ .glass 
┣➤ .jail 
┣➤ .passed 
┣➤ .triggered
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「ANIME」■━━─━╾╸
┣➤ .nom 
┣➤ .poke 
┣➤ .cry 
┣➤ .kiss 
┣➤ .pat 
┣➤ .hug 
┣➤ .wink 
┣➤ .facepalm 
╰━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「GIT」■━━─━╾╸
┣➤ .git
┣➤ .github
┣➤ .sc
┣➤ .script
┣➤ .repo
╰━━━━━━━━━━━━━━━━⬣
`;

    try {
        const imagePath = path.join(__dirname, '../assets/knox.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD by Mr Unique Hacker',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;