const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function videoenhancerCommand(sock, chatId, message) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage || !quotedMessage.videoMessage) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCER\n┣➤ Usage: Reply to a video with\n┣➤ .videoenhance <resolution>\n┣➤ Resolutions: 480p, 720p, 1080p\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        // Get resolution from command
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const args = text.split(' ');
        const resolution = args[1] || '720p';
        
        const validResolutions = ['480p', '720p', '1080p'];
        if (!validResolutions.includes(resolution.toLowerCase())) {
            await sock.sendMessage(chatId, {
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ INVALID RESOLUTION\n┣➤ Available: ${validResolutions.join(', ')}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCEMENT\n┣➤ Downloading video...\n┣➤ Resolution: ${resolution}\n╰━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: message });

        // Download video using Baileys function
        const stream = await downloadContentFromMessage(quotedMessage.videoMessage, 'video');
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        if (!buffer || buffer.length === 0) {
            throw new Error('Failed to download video');
        }

        // Create temp directory
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempId = Date.now();
        const inputPath = path.join(tempDir, `input_${tempId}.mp4`);
        const outputPath = path.join(tempDir, `enhanced_${tempId}.mp4`);

        // Save input video
        fs.writeFileSync(inputPath, buffer);

        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PROCESSING\n┣➤ Enhancing video quality...\n┣➤ Using FFmpeg for upscaling\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        });

        // Get resolution dimensions
        const dimensions = {
            '480p': '854x480',
            '720p': '1280x720', 
            '1080p': '1920x1080'
        };

        // Enhance video using FFmpeg (free)
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    '-c:v libx264',
                    '-preset slow',
                    '-crf 18',
                    '-c:a aac',
                    '-b:a 192k',
                    '-vf', `scale=${dimensions[resolution]}:flags=lanczos`,
                    '-pix_fmt yuv420p'
                ])
                .output(outputPath)
                .on('end', () => {
                    console.log('FFmpeg processing completed');
                    resolve();
                })
                .on('error', (err) => {
                    console.log('FFmpeg error:', err);
                    reject(err);
                })
                .run();
        });

        // Check if output file exists
        if (!fs.existsSync(outputPath)) {
            throw new Error('FFmpeg processing failed - no output file');
        }

        const fileSize = fs.statSync(outputPath).size;
        if (fileSize === 0) {
            throw new Error('FFmpeg processing failed - empty output file');
        }

        // Send enhanced video
        await sock.sendMessage(chatId, {
            video: fs.readFileSync(outputPath),
            caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCED\n┣➤ Resolution: ${resolution}\n┣➤ Quality: Upscaled\n┣➤ Size: ${(fileSize / 1024 / 1024).toFixed(2)}MB\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nEnhanced by KNOX MD\n> DARK EMPIRE TECH`
        });

        // Cleanup
        try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.log('Cleanup error:', cleanupError);
        }

    } catch (error) {
        console.log('Video enhance error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ ENHANCEMENT FAILED\n┣➤ Error: ${error.message}\n┣➤ Note: Free enhancement uses FFmpeg upscaling\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

module.exports = videoenhancerCommand;