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
    
    const defaultImage = path.join(__dirname, '../assets/knox.jpg');
    if (fs.existsSync(defaultImage)) {
        return defaultImage;
    }
    
    return null;
}

// Menu categories and their commands
const menus = {
    general: {
        name: 'GENERAL',
        commands: [
            '.knox', '.broadcast', '.ping', '.alive', '.tts', '.owner',
            '.joke', '.quote', '.fact', '.weather', '.news', '.attp',
            '.lyrics', '.8ball', '.groupinfo', '.admins', '.vv', '.trt',
            '.ss', '.jid', '.url', '.save'
        ]
    },
    admin: {
        name: 'ADMIN',
        commands: [
            '.ban', '.promote', '.demote', '.mute', '.unmute', '.del',
            '.kick', '.warnings', '.warn', '.antilink', '.antibadword',
            '.clear', '.tag', '.tagall', '.tagnotadmin', '.hidetag',
            '.chatbot', '.resetlink', '.antitag', '.welcome', '.goodbye',
            '.setgdesc', '.setgname', '.setgpp', '.vcf'
        ]
    },
    owner: {
        name: 'OWNER',
        commands: [
            '.mode', '.clearsession', '.antidelete', '.cleartmp', '.update',
            '.settings', '.setpp', '.autoreact', '.autostatus', '.autotyping',
            '.autoread', '.anticall', '.pmblocker', '.setmention', '.mention',
            '.obfuscate', '.sudo', '.autojoin'
        ]
    },
    imgsticker: {
        name: 'IMG/STICKER',
        commands: [
            '.blur', '.simage', '.sticker', '.removebg', '.remini',
            '.crop', '.tgsticker', '.meme', '.take', '.emojimix',
            '.igs', '.igsc', '.unblur'
        ]
    },
    pies: {
        name: 'PIES',
        commands: [
            '.pies', '.china', '.indonesia', '.japan', '.korea', '.hijab'
        ]
    },
    game: {
        name: 'GAME',
        commands: [
            '.tictactoe', '.hangman', '.guess', '.trivia', '.answer',
            '.truth', '.dare'
        ]
    },
    ai: {
        name: 'AI',
        commands: [
            '.gpt', '.gemini', '.imagine', '.flux', '.sora'
        ]
    },
    fun: {
        name: 'FUN',
        commands: [
            '.compliment', '.insult', '.flirt', '.shayari', '.goodnight',
            '.roseday', '.character', '.wasted', '.ship', '.simp', '.stupid'
        ]
    },
    textmaker: {
        name: 'TXT',
        commands: [
            '.metallic', '.ice', '.snow', '.impressive', '.matrix',
            '.light', '.neon', '.devil', '.purple', '.thunder',
            '.leaves', '.1917', '.arena', '.hacker', '.sand',
            '.blackpink', '.glitch', '.fire'
        ]
    },
    download: {
        name: 'DOWNLOAD',
        commands: [
            '.play', '.song', '.spotify', '.instagram', '.facebook',
            '.tiktok', '.video', '.ytmp4', '.pin', '.videoenhance',
            '.freetiktok'
        ]
    },
    misc: {
        name: 'MISC',
        commands: [
            '.heart', '.horny', '.circle', '.lgbt', '.lolice',
            '.its-so-stupid', '.namecard', '.oogway', '.tweet',
            '.ytcomment', '.comrade', '.gay', '.glass', '.jail',
            '.passed', '.triggered'
        ]
    },
    anime: {
        name: 'ANIME',
        commands: [
            '.nom', '.poke', '.cry', '.kiss', '.pat', '.hug',
            '.wink', '.facepalm'
        ]
    },
    git: {
        name: 'GIT',
        commands: [
            '.git', '.github', '.sc', '.script', '.repo'
        ]
    }
};

function formatMenu(menuKey) {
    const menu = menus[menuKey];
    if (!menu) return null;
    
    let formattedMenu = `╭╺╼━━─━■■━━─━╾╸\n┣⬣ ${menu.name} MENU\n`;
    
    menu.commands.forEach((cmd, index) => {
        formattedMenu += `┣➤ ${cmd}\n`;
    });
    
    formattedMenu += `╰━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`;
    
    return formattedMenu;
}

function formatAllMenus() {
    let allMenus = `╭╺╼━━─━■■━━─━╾╸
┣⬣ KNOX MD v${settings.version || '3.0.0'}
┣⬣ Created by ${settings.botOwner || 'CODEBREAKER'}
┣⬣ YT : ${global.ytch || 'NullWhisperss'}
╰━━━━━━━━━━━━━━━━━━━━⬣\n\n`;

    // Add each menu category
    for (const [key, menu] of Object.entries(menus)) {
        allMenus += `╭╺╼━─━■「${menu.name}」■━━─━╾╸\n`;
        // Show first 8 commands as preview, then indicate more
        const previewCommands = menu.commands.slice(0, 8);
        previewCommands.forEach(cmd => {
            allMenus += `┣➤ ${cmd}\n`;
        });
        if (menu.commands.length > 8) {
            allMenus += `┣➤ ...and ${menu.commands.length - 8} more\n`;
        }
        allMenus += `┣➤ Use .${key} for full list\n`;
        allMenus += `╰━━━━━━━━━━━━━━━━⬣\n\n`;
    }

    allMenus += `> DARK EMPIRE TECH`;
    
    return allMenus;
}

function getMenuList() {
    let menuList = `╭╺╼━━─━■■━━─━╾╸
┣⬣ AVAILABLE MENUS
┗╼━━━━━━━━━─━■\n`;

    for (const [key, menu] of Object.entries(menus)) {
        menuList += `┣➤ .${key} - ${menu.name}\n`;
    }

    menuList += `■━━─━╾╸
┣➤ .allmenu - Show all commands
┣➤ .knox - Show full menu
╰━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`;

    return menuList;
}

async function helpCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const command = text.toLowerCase().trim();

        // Handle .menu command
        if (command === '.menu') {
            const welcomeMsg = `╭╺╼━━─━■■━━─━╾╸
┣⬣ Hi! Thanks for using KNOX MD
┣⬣ Created By ${settings.botOwner || 'CODEBREAKER'}
┗╼━━━━━━━━━─━■
┣➤ Use .knox to see full menu
┣➤ Use .allmenu for all commands
┣➤ Use .<category> for specific menu
■━━─━╾╸
╰━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`;

            await sock.sendMessage(chatId, { text: welcomeMsg }, { quoted: message });
            return;
        }

        // Handle .allmenu command
        if (command === '.allmenu' || command === '.all') {
            const allMenus = formatAllMenus();
            
            const imagePath = getRandomBotImage();
            if (imagePath && fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                await sock.sendMessage(chatId, {
                    image: imageBuffer,
                    caption: allMenus
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: allMenus }, { quoted: message });
            }
            return;
        }

        // Handle .knox or full menu
        if (command === '.knox' || command === '.fullmenu' || command === '.help') {
            const fullMenu = formatAllMenus();
            
            const imagePath = getRandomBotImage();
            if (imagePath && fs.existsSync(imagePath)) {
                const imageBuffer = fs.readFileSync(imagePath);
                await sock.sendMessage(chatId, {
                    image: imageBuffer,
                    caption: fullMenu
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: fullMenu }, { quoted: message });
            }
            return;
        }

        // Handle category menus (e.g., .admin, .general, etc.)
        const categoryCommand = command.slice(1); // Remove the dot
        if (menus[categoryCommand]) {
            const categoryMenu = formatMenu(categoryCommand);
            if (categoryMenu) {
                await sock.sendMessage(chatId, { text: categoryMenu }, { quoted: message });
                return;
            }
        }

        // Handle .menulist or .categories
        if (command === '.menulist' || command === '.categories' || command === '.cat') {
            const menuList = getMenuList();
            await sock.sendMessage(chatId, { text: menuList }, { quoted: message });
            return;
        }

        // If no specific command matched, show menu list
        if (command.startsWith('.')) {
            const menuList = getMenuList();
            await sock.sendMessage(chatId, { 
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ MENU NOT FOUND\n┣➤ Use .menu to see available categories\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n${menuList}`
            }, { quoted: message });
        }

    } catch (error) {
        console.log('Error in help command:', error);
        // Fallback to simple text
        await sock.sendMessage(chatId, { 
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ KNOX BOT MENU\n┣➤ Use .menu for categories\n┣➤ Use .knox for full menu\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
        }, { quoted: message });
    }
}

module.exports = helpCommand;