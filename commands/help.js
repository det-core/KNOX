const settings = require('../settings');
const fs = require('fs');
const path = require('path');

function getRandomBotImage() {
    const assetsPath = path.join(__dirname, '../assets');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const images = [];
    
    try {
        const files = fs.readdirSync(assetsPath);
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext) && file.includes('knox')) {
                images.push(path.join(assetsPath, file));
            }
        });
        
        if (images.length > 0) {
            return images[Math.floor(Math.random() * images.length)];
        }
    } catch (error) {
        console.log('Error reading assets folder:', error);
    }
    
    return path.join(__dirname, '../assets/knox.jpg');
}

function getRandomBotMusic() {
    const assetsPath = path.join(__dirname, '../assets');
    const musicExtensions = ['.mp3', '.mp4', '.m4a'];
    const musicFiles = [];
    
    try {
        const files = fs.readdirSync(assetsPath);
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (musicExtensions.includes(ext) && file.includes('knox')) {
                musicFiles.push(path.join(assetsPath, file));
            }
        });
        
        if (musicFiles.length > 0) {
            return musicFiles[Math.floor(Math.random() * musicFiles.length)];
        }
    } catch (error) {
        console.log('Error reading music files:', error);
    }
    
    return null;
}

async function helpCommand(sock, chatId, message) {
    const helpMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ BOT NAME ${settings.botName || 'KNOX-MD'}
┣⬣ Version: ${settings.version || '3.0.0'}
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

> DARK EMPIRE TECH`;

    try {
        const imagePath = getRandomBotImage();
        const musicPath = getRandomBotMusic();
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage
            }, { quoted: message });

            if (musicPath && fs.existsSync(musicPath)) {
                await delay(1000);
                const musicBuffer = fs.readFileSync(musicPath);
                await sock.sendMessage(chatId, {
                    audio: musicBuffer,
                    mimetype: 'audio/mp4',
                    ptt: false
                });
            }
        } else {
            console.log('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage
            });
        }
    } catch (error) {
        console.log('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = helpCommand;