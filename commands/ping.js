const os = require('os');
const settings = require('../settings.js');

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

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: 'Testing ping...' }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);
        
        const totalMem = Math.round(os.totalmem() / (1024 * 1024));
        const freeMem = Math.round(os.freemem() / (1024 * 1024));
        const usedMem = totalMem - freeMem;
        const memPercent = Math.round((usedMem / totalMem) * 100);

        const botInfo = `╭╺╼━━─━■■━━─━╾╸
┣⬣ BOT PERFORMANCE
┣➤ Ping: ${ping} ms
┣➤ Uptime: ${uptimeFormatted}
┣➤ Version: v${settings.version}
┣➤ Memory: ${usedMem}MB/${totalMem}MB (${memPercent}%)
┣➤ Platform: ${os.platform()} ${os.arch()}
╰━━━━━━━━━━━━━━━━━━━━⬣

> DARK EMPIRE TECH`;

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });

    } catch (error) {
        console.log('Error in ping command:', error);
        const errorMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ ERROR
┣➤ Failed to get bot status
┣➤ ${error.message}
╰━━━━━━━━━━━━━━━━━━━━⬣

> DARK EMPIRE TECH`;
        
        await sock.sendMessage(chatId, { text: errorMessage });
    }
}

module.exports = pingCommand;