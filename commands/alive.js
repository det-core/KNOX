const settings = require("../settings");
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

async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `╭╺╼━━─━■■━━─━╾╸
┣⬣ KNOX BOT STATUS
┣➤ Version: ${settings.version}
┣➤ Status: ONLINE
┣➤ Mode: PUBLIC
┣➤ Uptime: ${formatTime(process.uptime())}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭╺╼━─━■「FEATURES」■━━─━╾╸
┣➤ Group Management
┣➤ Antilink Protection
┣➤ Auto-Join System
┣➤ Multi-Media Support
┣➤ AI Integration
┣➤ Game System
┣➤ Download Tools
╰━━━━━━━━━━━━━━━━⬣

Type .menu for full command list

> DARK EMPIRE TECH`;

        const imagePath = getRandomBotImage();
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: message1
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: message1
            }, { quoted: message });
        }
    } catch (error) {
        console.log('Error in alive command:', error);
        const errorMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ BOT STATUS
┣➤ Status: ONLINE
┣➤ Error: ${error.message}
╰━━━━━━━━━━━━━━━━━━━━⬣

> DARK EMPIRE TECH`;
        
        await sock.sendMessage(chatId, { text: errorMessage }, { quoted: message });
    }
}

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

module.exports = aliveCommand;