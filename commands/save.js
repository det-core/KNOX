const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function saveCommand(sock, chatId, message) {
    try {
        // Check if this is a reply to a status
        const isStatus = message.key?.remoteJid === 'status@broadcast';
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        // If not replying to anything and not a status
        if (!quotedMessage && !isStatus) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVER\n┣➤ Usage: Reply to a WhatsApp status\n┣➤ with .save command\n┣➤ Supports: Photos, Videos, Audio, Text\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        let mediaMessage;
        let mediaType;
        let caption = '';

        // If replying to a status
        if (isStatus) {
            mediaMessage = message.message;
            // Determine message type
            if (mediaMessage.imageMessage) {
                mediaType = 'image';
                caption = mediaMessage.imageMessage.caption || '';
            } else if (mediaMessage.videoMessage) {
                mediaType = 'video';
                caption = mediaMessage.videoMessage.caption || '';
            } else if (mediaMessage.audioMessage) {
                mediaType = 'audio';
            } else if (mediaMessage.conversation) {
                mediaType = 'text';
            } else if (mediaMessage.extendedTextMessage) {
                mediaType = 'text';
            }
        } 
        // If replying to a quoted message
        else {
            if (quotedMessage.imageMessage) {
                mediaMessage = quotedMessage.imageMessage;
                mediaType = 'image';
                caption = quotedMessage.imageMessage.caption || '';
            } else if (quotedMessage.videoMessage) {
                mediaMessage = quotedMessage.videoMessage;
                mediaType = 'video';
                caption = quotedMessage.videoMessage.caption || '';
            } else if (quotedMessage.audioMessage) {
                mediaMessage = quotedMessage.audioMessage;
                mediaType = 'audio';
            } else if (quotedMessage.documentMessage) {
                mediaMessage = quotedMessage.documentMessage;
                mediaType = 'document';
                caption = quotedMessage.documentMessage.fileName || '';
            } else if (quotedMessage.conversation || quotedMessage.extendedTextMessage?.text) {
                mediaType = 'text';
            }
        }

        // Create save directory
        const saveDir = path.join(__dirname, '../saved_status');
        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        const timestamp = Date.now();
        const sender = message.key.participant || message.key.remoteJid;
        const senderNumber = sender.split('@')[0];

        // Handle different media types
        if (mediaType === 'text') {
            // Save text status
            let textContent = '';
            if (isStatus) {
                textContent = message.message?.conversation || 
                            message.message?.extendedTextMessage?.text || '';
            } else {
                textContent = quotedMessage?.conversation || 
                            quotedMessage?.extendedTextMessage?.text || '';
            }

            const textFile = path.join(saveDir, `status_text_${timestamp}.txt`);
            const content = `Status Saved: ${new Date().toLocaleString()}\nFrom: ${senderNumber}\n\n${textContent}`;
            fs.writeFileSync(textFile, content);

            // Send text file
            await sock.sendMessage(chatId, {
                document: fs.readFileSync(textFile),
                fileName: `status_text_${timestamp}.txt`,
                caption: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVED\n┣➤ Type: TEXT\n┣➤ Time: ' + new Date().toLocaleTimeString() + '\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nSaved by DARK EMPIRE TECH',
                mimetype: 'text/plain'
            });

            // Cleanup
            fs.unlinkSync(textFile);

        } else if (mediaType === 'image') {
            // Download and save image
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ SAVING STATUS\n┣➤ Downloading image...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
            });

            const stream = await downloadContentFromMessage(mediaMessage, 'image');
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const imagePath = path.join(saveDir, `status_image_${timestamp}.jpg`);
            fs.writeFileSync(imagePath, buffer);

            // Send saved image
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(imagePath),
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVED\n┣➤ Type: IMAGE\n┣➤ Time: ${new Date().toLocaleTimeString()}\n┣➤ Caption: ${caption || 'No caption'}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nSaved by DARK EMPIRE TECH`
            });

            // Cleanup
            fs.unlinkSync(imagePath);

        } else if (mediaType === 'video') {
            // Download and save video
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ SAVING STATUS\n┣➤ Downloading video...\n┣➤ This may take a moment\n╰━━━━━━━━━━━━━━━━━━━━⬣'
            });

            const stream = await downloadContentFromMessage(mediaMessage, 'video');
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const videoPath = path.join(saveDir, `status_video_${timestamp}.mp4`);
            fs.writeFileSync(videoPath, buffer);

            // Send saved video
            await sock.sendMessage(chatId, {
                video: fs.readFileSync(videoPath),
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVED\n┣➤ Type: VIDEO\n┣➤ Time: ${new Date().toLocaleTimeString()}\n┣➤ Duration: ${mediaMessage.seconds || 'Unknown'}s\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nSaved by DARK EMPIRE TECH`
            });

            // Cleanup
            fs.unlinkSync(videoPath);

        } else if (mediaType === 'audio') {
            // Download and save audio
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ SAVING STATUS\n┣➤ Downloading audio...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
            });

            const stream = await downloadContentFromMessage(mediaMessage, 'audio');
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const audioPath = path.join(saveDir, `status_audio_${timestamp}.mp3`);
            fs.writeFileSync(audioPath, buffer);

            // Send saved audio
            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp3',
                fileName: `status_audio_${timestamp}.mp3`,
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVED\n┣➤ Type: AUDIO\n┣➤ Time: ${new Date().toLocaleTimeString()}\n┣➤ Duration: ${mediaMessage.seconds || 'Unknown'}s\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nSaved by DARK EMPIRE TECH`
            });

            // Cleanup
            fs.unlinkSync(audioPath);

        } else if (mediaType === 'document') {
            // Download and save document
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ SAVING STATUS\n┣➤ Downloading document...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
            });

            const stream = await downloadContentFromMessage(mediaMessage, 'document');
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            const fileName = mediaMessage.fileName || `status_document_${timestamp}.bin`;
            const docPath = path.join(saveDir, fileName);
            fs.writeFileSync(docPath, buffer);

            // Send saved document
            await sock.sendMessage(chatId, {
                document: fs.readFileSync(docPath),
                fileName: fileName,
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ STATUS SAVED\n┣➤ Type: DOCUMENT\n┣➤ File: ${fileName}\n┣➤ Time: ${new Date().toLocaleTimeString()}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nSaved by DARK EMPIRE TECH`,
                mimetype: mediaMessage.mimetype || 'application/octet-stream'
            });

            // Cleanup
            fs.unlinkSync(docPath);

        } else {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ ERROR\n┣➤ Unsupported media type or status\n┣➤ Only images, videos, audio, and text are supported\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            });
            return;
        }

    } catch (error) {
        console.log('Save command error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ SAVE FAILED\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

module.exports = saveCommand;