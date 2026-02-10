const fs = require('fs');
const path = require('path');

async function broadcastCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const devNumber = '2347030626048@s.whatsapp.net';
        
        // Check if sender is the dev
        const normalizedSender = senderId.replace(/:[^@]+@/, '@');
        const normalizedDev = devNumber.replace(/:[^@]+@/, '@');
        
        if (normalizedSender !== normalizedDev) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ ACCESS DENIED\n┣➤ This command is only for developer\n┣➤ Contact: +2347030626048\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        
        // Extract message after .broadcast
        const broadcastMessage = text.replace(/^\.broadcast\s+/, '').trim();
        
        if (!broadcastMessage) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST SYSTEM\n┣➤ Usage: .broadcast <message>\n┣➤ Example: .broadcast Hello everyone!\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST STARTED\n┣➤ Collecting user data...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        }, { quoted: message });

        // Get all users who have interacted with the bot
        const users = await getBroadcastUsers();
        
        if (users.length === 0) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ NO USERS FOUND\n┣➤ No users to broadcast to\n┣➤ Bot needs to have interacted with users\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST PROCESSING\n┣➤ Users: ${users.length}\n┣➤ Sending messages...\n╰━━━━━━━━━━━━━━━━━━━━⬣`
        });

        let successful = 0;
        let failed = 0;

        // Format the message
        const formattedMessage = `╭╺╼━━─━■■━━─━╾╸\n┣⬣ IMPORTANT ANNOUNCEMENT\n┗╼━━━━━━━━━─━■\n${broadcastMessage}\n■━━─━╾╸\n╰━━━━━━━━━━━━━━━━⬣\n\n> KNOX MD | DARK EMPIRE TECH`;

        // Send to each user
        for (let i = 0; i < users.length; i++) {
            const userJid = users[i];
            
            try {
                await sock.sendMessage(userJid, { text: formattedMessage });
                successful++;
                
                // Update progress every 10 users
                if ((i + 1) % 10 === 0 || i === users.length - 1) {
                    await sock.sendMessage(chatId, {
                        text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST PROGRESS\n┣➤ Sent: ${i + 1}/${users.length}\n┣➤ Successful: ${successful}\n┣➤ Failed: ${failed}\n╰━━━━━━━━━━━━━━━━━━━━⬣`
                    });
                }
                
                // Delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.log(`Failed to send to ${userJid}:`, error.message);
                failed++;
            }
        }

        // Send final report
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST COMPLETE\n┣➤ Total Users: ${users.length}\n┣➤ Successful: ${successful}\n┣➤ Failed: ${failed}\n┣➤ Success Rate: ${((successful / users.length) * 100).toFixed(1)}%\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        });

        // Log the broadcast
        logBroadcast(broadcastMessage, successful, failed, users.length);

    } catch (error) {
        console.log('Broadcast error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ BROADCAST ERROR\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function getBroadcastUsers() {
    try {
        const users = [];
        const dataDir = path.join(__dirname, '../data');
        
        // Check messageCount.json for users
        const messageCountFile = path.join(dataDir, 'messageCount.json');
        if (fs.existsSync(messageCountFile)) {
            const data = JSON.parse(fs.readFileSync(messageCountFile, 'utf8'));
            
            // Get all users who have sent messages
            if (data.users) {
                for (const userId of Object.keys(data.users)) {
                    // Only include individual users (not groups)
                    if (!userId.endsWith('@g.us') && !users.includes(userId)) {
                        users.push(userId);
                    }
                }
            }
        }
        
        // Check store.json if available
        const storeFile = path.join(dataDir, 'store.json');
        if (fs.existsSync(storeFile)) {
            try {
                const storeData = JSON.parse(fs.readFileSync(storeFile, 'utf8'));
                if (storeData.chats) {
                    for (const [jid, chat] of Object.entries(storeData.chats)) {
                        if (!jid.endsWith('@g.us') && !users.includes(jid)) {
                            users.push(jid);
                        }
                    }
                }
            } catch (e) {
                console.log('Error reading store.json:', e.message);
            }
        }
        
        return users;
    } catch (error) {
        console.log('Error getting broadcast users:', error);
        return [];
    }
}

function logBroadcast(message, successful, failed, total) {
    try {
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const broadcastLogFile = path.join(dataDir, 'broadcast_log.json');
        let log = { broadcasts: [] };
        
        if (fs.existsSync(broadcastLogFile)) {
            log = JSON.parse(fs.readFileSync(broadcastLogFile, 'utf8'));
        }
        
        log.broadcasts.unshift({
            timestamp: new Date().toISOString(),
            message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
            successful,
            failed,
            total,
            successRate: ((successful / total) * 100).toFixed(1) + '%'
        });
        
        // Keep only last 50 broadcasts
        if (log.broadcasts.length > 50) {
            log.broadcasts = log.broadcasts.slice(0, 50);
        }
        
        fs.writeFileSync(broadcastLogFile, JSON.stringify(log, null, 2));
    } catch (error) {
        console.log('Error logging broadcast:', error);
    }
}

module.exports = broadcastCommand;