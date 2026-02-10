const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function unblurCommand(sock, chatId, message) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage || !quotedMessage.imageMessage) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ IMAGE UNBLUR/UPSCALE\n┣➤ Usage: Reply to an image with\n┣➤ .unblur <scale>\n┣➤ Scales: 2, 4, 8, 16\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        // Get scale from command
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const args = text.split(' ');
        const scale = args[1] || '4';
        
        const validScales = ['2', '4', '8', '16'];
        if (!validScales.includes(scale)) {
            await sock.sendMessage(chatId, {
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ INVALID SCALE\n┣➤ Available scales: ${validScales.join(', ')}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ IMAGE PROCESSING\n┣➤ Downloading image...\n┣➤ Scale: ${scale}x\n╰━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: message });

        // Download image
        const buffer = await sock.downloadMediaMessage(message);
        if (!buffer) {
            throw new Error('Failed to download image');
        }

        // Create temp directory
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempId = Date.now();
        const inputPath = path.join(tempDir, `input_${tempId}.jpg`);
        const outputPath = path.join(tempDir, `unblurred_${tempId}.jpg`);

        // Save input image
        fs.writeFileSync(inputPath, buffer);

        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PROCESSING\n┣➤ Enhancing image quality...\n┣➤ Removing blur and upscaling\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        });

        // Unblur image
        const result = await unblurImage(inputPath, scale);

        if (result.success) {
            // Download enhanced image
            const enhancedResponse = await axios.get(result.output_url, {
                responseType: 'arraybuffer'
            });

            fs.writeFileSync(outputPath, enhancedResponse.data);

            // Send enhanced image
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(outputPath),
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ IMAGE ENHANCED\n┣➤ Scale: ${scale}x\n┣➤ Quality: Enhanced\n┣➤ Job ID: ${result.job_id}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nEnhanced by KNOX MD\n> DARK EMPIRE TECH`
            });

            // Cleanup
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.log('Unblur error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ ENHANCEMENT FAILED\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function unblurImage(filePath, upscale = '4') {
    const scale = ['2', '4', '8', '16'];
    
    if (!scale.includes(String(upscale))) {
        throw new Error(`Invalid scale, use: ${scale.join(', ')}`);
    }

    // Upload image
    const filename = path.basename(filePath);
    
    const uploadRes = await axios.post(
        'https://api.unblurimage.ai/api/common/upload/upload-image',
        new URLSearchParams({ file_name: filename }).toString(),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                origin: 'https://unblurimage.ai',
                referer: 'https://unblurimage.ai/',
                'Product-Serial': crypto.randomUUID()
            }
        }
    );
    
    const { url, object_name } = uploadRes.data.result;

    const buffer = fs.readFileSync(filePath);

    await axios.put(url, buffer, {
        headers: {
            'content-type': 'image/jpeg',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
        }
    });

    // Create job
    const jobRes = await axios.post(
        'https://api.unblurimage.ai/api/imgupscaler/v1/ai-image-upscaler-v2/create-job',
        new URLSearchParams({
            original_image_url: `https://cdn.unblurimage.ai/${object_name}`,
            upscale_type: String(upscale)
        }).toString(),
        {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                origin: 'https://unblurimage.ai',
                referer: 'https://unblurimage.ai/',
                authorization: '',
                'Product-Serial': crypto.randomUUID()
            }
        }
    );

    const job = jobRes.data.result;
    
    // Poll job status
    let attempts = 0;
    const maxAttempts = 30; // 2.5 minutes max

    while (attempts < maxAttempts) {
        const statusRes = await axios.get(
            `https://api.unblurimage.ai/api/imgupscaler/v1/ai-image-upscaler-v2/get-job/${job.job_id}`,
            {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                    'Product-Serial': crypto.randomUUID()
                }
            }
        );

        const statusData = statusRes.data;

        if (statusData.code === 100000 && statusData.result?.output_url) {
            return {
                success: true,
                job_id: job.job_id,
                input_url: job.input_url,
                output_url: statusData.result.output_url
            };
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
    }

    throw new Error('Job timeout after 2.5 minutes');
}

module.exports = unblurCommand;