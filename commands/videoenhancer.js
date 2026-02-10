const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function videoenhancerCommand(sock, chatId, message) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage || !quotedMessage.videoMessage) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCER\n┣➤ Usage: Reply to a video with\n┣➤ .videoenhance <resolution>\n┣➤ Resolutions: 720p, 1080p, 4k\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        // Get resolution from command
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const args = text.split(' ');
        const resolution = args[1] || '4k';
        
        const validResolutions = ['720p', '1080p', '4k', '2k'];
        if (!validResolutions.includes(resolution.toLowerCase())) {
            await sock.sendMessage(chatId, {
                text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ INVALID RESOLUTION\n┣➤ Available: ${validResolutions.join(', ')}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCEMENT\n┣➤ Downloading video...\n┣➤ Resolution: ${resolution}\n╰━━━━━━━━━━━━━━━━━━━━⬣`
        }, { quoted: message });

        // Download video
        const buffer = await sock.downloadMediaMessage(message);
        if (!buffer) {
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
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ PROCESSING\n┣➤ Enhancing video quality...\n┣➤ This may take a few minutes\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        });

        // Enhance video
        const result = await enhanceVideo(inputPath, resolution);

        if (result.success) {
            // Download enhanced video
            const enhancedResponse = await axios.get(result.output_url, {
                responseType: 'arraybuffer'
            });

            fs.writeFileSync(outputPath, enhancedResponse.data);

            // Send enhanced video
            await sock.sendMessage(chatId, {
                video: fs.readFileSync(outputPath),
                caption: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ VIDEO ENHANCED\n┣➤ Resolution: ${resolution}\n┣➤ Quality: Enhanced\n┣➤ Job ID: ${result.job_id}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nEnhanced by KNOX MD\n> DARK EMPIRE TECH`
            });

            // Cleanup
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.log('Video enhance error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ ENHANCEMENT FAILED\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function enhanceVideo(filePath, resolution = '4k') {
    const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36';
    const API = 'https://api.unblurimage.ai/api/upscaler';

    function productserial() {
        const raw = [
            UA,
            process.platform,
            process.arch,
            Date.now(),
            Math.random()
        ].join('|');
        return crypto.createHash('md5').update(raw).digest('hex');
    }

    const product = productserial();

    // Upload video
    const form1 = new FormData();
    form1.append('video_file_name', path.basename(filePath));

    const uploadRes = await axios.post(`${API}/v1/ai-video-enhancer/upload-video`,
        form1,
        {
            headers: {
                ...form1.getHeaders(),
                'user-agent': UA,
                origin: 'https://unblurimage.ai',
                referer: 'https://unblurimage.ai/'
            }
        }
    );

    const uploadData = uploadRes.data.result;

    // Put to OSS
    const stream = fs.createReadStream(filePath);
    await axios.put(uploadData.url, stream, {
        headers: {
            'content-type': 'video/mp4'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
    });

    const cdnUrl = 'https://cdn.unblurimage.ai/' + uploadData.object_name;

    // Create job
    const form2 = new FormData();
    form2.append('original_video_file', cdnUrl);
    form2.append('resolution', resolution);
    form2.append('is_preview', 'false');

    const jobRes = await axios.post(`${API}/v2/ai-video-enhancer/create-job`,
        form2,
        {
            headers: {
                ...form2.getHeaders(),
                'user-agent': UA,
                origin: 'https://unblurimage.ai',
                referer: 'https://unblurimage.ai/',
                'product-serial': product
            }
        }
    );

    if (jobRes.data?.code !== 100000) {
        throw new Error(JSON.stringify(jobRes.data));
    }

    const jobId = jobRes.data.result.job_id;

    // Poll job status
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
        const statusRes = await axios.get(`${API}/v2/ai-video-enhancer/get-job/${jobId}`,
            {
                headers: {
                    'user-agent': UA,
                    origin: 'https://unblurimage.ai',
                    referer: 'https://unblurimage.ai/',
                    'product-serial': product
                }
            }
        );

        const statusData = statusRes.data;

        if (statusData.code === 100000 && statusData.result?.output_url) {
            return {
                success: true,
                job_id: jobId,
                input_url: statusData.result.input_url,
                output_url: statusData.result.output_url
            };
        }

        if (statusData.code !== 300010) {
            throw new Error(JSON.stringify(statusData));
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
    }

    throw new Error('Job timeout after 5 minutes');
}

module.exports = videoenhancerCommand;