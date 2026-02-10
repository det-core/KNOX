async function testCommand(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ TEST COMMAND\n┣➤ Bot is working\n┣➤ Connection: OK\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
        }, { quoted: message });
    } catch (error) {
        console.log('Test command error:', error);
    }
}

module.exports = testCommand;