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
    
    // Check if default image exists
    const defaultImage = path.join(__dirname, '../assets/knox.jpg');
    if (fs.existsSync(defaultImage)) {
        return defaultImage;
    }
    
    // If no image found, return null
    return null;
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
    try {
        const helpMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ BOT NAME ${settings.botName || 'KNOX-MD'}
┣⬣ Version: ${settings.version || '3.0.0'}
┣⬣ by ${settings.botOwner || 'CODEBREAKER'}
┣⬣ YT : ${global.ytch || 'NullWhisperss'}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「GENERAL」■━━─━╾╸
┣➤ .knox
┣➤ .broadcast
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
┣➤ .vcf
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
┣➤ .obfuscate 
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
┣➤ .unblur 
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
┣➤ .videoenhance
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

        const imagePath = getRandomBotImage();
        
        if (imagePath && fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage
            }, { quoted: message });

            // Send music if available (optional)
            const musicPath = getRandomBotMusic();
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
            // Send text-only version if no image
            await sock.sendMessage(chatId, { 
                text: helpMessage
            }, { quoted: message });
        }
    } catch (error) {
        console.log('Error in help command:', error);
        // Fallback to simple text
        await sock.sendMessage(chatId, { 
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ KNOX BOT MENU\n┣➤ Type .knox or .menu\n┣➤ For full command list\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
        }, { quoted: message });
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = helpCommand;