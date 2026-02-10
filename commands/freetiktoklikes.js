const axios = require('axios');

async function freetiktoklikesCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        
        // Extract TikTok URL
        const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
        if (!urlMatch) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ FREE TIKTOK LIKES\n┣➤ Usage: .freetiktok <tiktok_url>\n┣➤ Example: .freetiktok https://vt.tiktok.com/ZSaRyk39b/\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        const tiktokUrl = urlMatch[1];
        
        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PROCESSING\n┣➤ Sending likes request...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        }, { quoted: message });

        const result = await sendTikTokLikes(tiktokUrl);

        if (result.success) {
            await sock.sendMessage(chatId, {
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ TIKTOK LIKES SENT\n┣➤ URL: ${tiktokUrl}\n┣➤ Status: ${result.message}\n┣➤ Likes: ${result.likes || 'Processing'}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nPowered by KNOX MD\n> DARK EMPIRE TECH`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ REQUEST FAILED\n┣➤ Error: ${result.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
            }, { quoted: message });
        }

    } catch (error) {
        console.log('TikTok likes error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ ERROR\n┣➤ ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function sendTikTokLikes(url) {
    try {
        // Get initial page to get token and cookies
        const page = await axios.get('https://leofame.com/free-tiktok-likes', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
            }
        });

        const html = page.data;
        const tokenMatch = html.match(/var\s+token\s*=\s*'([^']+)'/);
        
        if (!tokenMatch) {
            throw new Error('Token not found');
        }

        const token = tokenMatch[1];
        const cookies = page.headers['set-cookie']
            ? page.headers['set-cookie'].map(v => v.split(';')[0]).join('; ')
            : '';

        // Send likes request
        const response = await axios.post(
            'https://leofame.com/free-tiktok-likes?api=1',
            new URLSearchParams({
                token: token,
                timezone_offset: 'Asia/Jakarta',
                free_link: url
            }).toString(),
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://leofame.com',
                    'Referer': 'https://leofame.com/free-tiktok-likes',
                    'Cookie': cookies
                }
            }
        );

        const data = response.data;
        
        if (data.success) {
            return {
                success: true,
                message: data.message || 'Likes sent successfully',
                likes: data.likes_count
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to send likes'
            };
        }

    } catch (error) {
        console.log('TikTok API error:', error.message);
        return {
            success: false,
            message: error.message || 'Service temporarily unavailable'
        };
    }
}

module.exports = freetiktoklikesCommand;