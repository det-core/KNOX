const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function pinterestCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        
        // Extract Pinterest URL
        const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
        if (!urlMatch || !urlMatch[0].includes('pinterest')) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PINTEREST DOWNLOADER\n┣➤ Usage: .pinterest <pinterest_url>\n┣➤ Example: .pinterest https://pin.it/example\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        const pinterestUrl = urlMatch[0];
        
        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PROCESSING\n┣➤ Fetching Pinterest content...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        }, { quoted: message });

        const result = await downloadPinterest(pinterestUrl);

        if (result.success) {
            if (result.type === 'image') {
                // Send image
                await sock.sendMessage(chatId, {
                    image: result.buffer,
                    caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ PINTEREST IMAGE\n┣➤ Source: ${pinterestUrl}\n┣➤ Resolution: ${result.width}x${result.height}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nDownloaded by KNOX MD\n> DARK EMPIRE TECH`
                });
            } else if (result.type === 'video') {
                // Send video
                await sock.sendMessage(chatId, {
                    video: result.buffer,
                    caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ PINTEREST VIDEO\n┣➤ Source: ${pinterestUrl}\n┣➤ Duration: ${result.duration}s\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nDownloaded by KNOX MD\n> DARK EMPIRE TECH`
                });
            }
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.log('Pinterest error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ DOWNLOAD FAILED\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function downloadPinterest(url) {
    try {
        // Use a Pinterest downloader API
        const apiUrl = 'https://api.pinterestdownloader.com/api';
        
        // First, get video/image info
        const infoResponse = await axios.post(`${apiUrl}/info`, {
            url: url
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
            }
        });

        const info = infoResponse.data;
        
        if (!info.success) {
            // Try alternative method
            return await downloadPinterestAlternative(url);
        }

        // Download the media
        const downloadUrl = info.video_url || info.image_url;
        if (!downloadUrl) {
            throw new Error('No media URL found');
        }

        const mediaResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://www.pinterest.com/'
            }
        });

        const buffer = Buffer.from(mediaResponse.data);
        
        return {
            success: true,
            type: info.video_url ? 'video' : 'image',
            buffer: buffer,
            width: info.width || 0,
            height: info.height || 0,
            duration: info.duration || 0
        };

    } catch (error) {
        console.log('Pinterest API error:', error.message);
        return await downloadPinterestAlternative(url);
    }
}

async function downloadPinterestAlternative(url) {
    try {
        // Alternative method using savetik API
        const response = await axios.get(`https://www.savetik.co/api/ajaxSearch`, {
            params: {
                url: url,
                lang: 'en'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://www.savetik.co/'
            }
        });

        const data = response.data;
        
        if (!data.status) {
            throw new Error(data.message || 'Failed to fetch media');
        }

        // Extract download link
        const html = data.data;
        const videoMatch = html.match(/<a[^>]*href="([^"]*\.mp4[^"]*)"[^>]*download/i);
        const imageMatch = html.match(/<img[^>]*src="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"[^>]*/i);
        
        let downloadUrl;
        let type;
        
        if (videoMatch && videoMatch[1]) {
            downloadUrl = videoMatch[1];
            type = 'video';
        } else if (imageMatch && imageMatch[1]) {
            downloadUrl = imageMatch[1];
            type = 'image';
        } else {
            throw new Error('No media found');
        }

        // Download media
        const mediaResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
            }
        });

        const buffer = Buffer.from(mediaResponse.data);
        
        return {
            success: true,
            type: type,
            buffer: buffer,
            width: 0,
            height: 0,
            duration: 0
        };

    } catch (error) {
        console.log('Alternative method error:', error.message);
        throw new Error('Failed to download Pinterest content');
    }
}

module.exports = pinterestCommand;