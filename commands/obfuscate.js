const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function obfuscateCommand(sock, chatId, message) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ JAVASCRIPT OBFUSCATOR\n┣➤ Usage: Reply to a .js file\n┣➤ with .obfuscate command\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        // Check if quoted message is a document
        const documentMsg = quotedMessage.documentMessage;
        if (!documentMsg || !documentMsg.fileName.endsWith('.js')) {
            await sock.sendMessage(chatId, {
                text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ ERROR\n┣➤ Please reply to a .js file\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ OBFUSCATION STARTED\n┣➤ Downloading file...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        }, { quoted: message });

        // Download the file
        const buffer = await sock.downloadMediaMessage(message);
        if (!buffer) {
            throw new Error('Failed to download file');
        }

        // Create temp directory
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempId = Date.now();
        const inputPath = path.join(tempDir, `input_${tempId}.js`);
        const outputPath = path.join(tempDir, `obfuscated_${tempId}.js`);

        // Save input file
        fs.writeFileSync(inputPath, buffer);

        // Obfuscate the code
        await sock.sendMessage(chatId, {
            text: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ OBFUSCATION PROCESS\n┣➤ Applying transformations...\n╰━━━━━━━━━━━━━━━━━━━━⬣'
        });

        const obfuscatedCode = await hardObfuscate(inputPath);

        // Save obfuscated file
        fs.writeFileSync(outputPath, obfuscatedCode);

        // Send obfuscated file
        await sock.sendMessage(chatId, {
            document: fs.readFileSync(outputPath),
            fileName: `obfuscated_by_knox_${tempId}.js`,
            caption: '╭╺╼━━─━■■━━─━╾╸\n┣⬣ OBFUSCATION COMPLETE\n┣➤ File successfully obfuscated\n┣➤ Protection: HARD LEVEL\n┣➤ Anti-deobfuscation: ENABLED\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\nObfuscated by KNOX MD\n> DARK EMPIRE TECH',
            mimetype: 'application/javascript'
        });

        // Cleanup
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.log('Obfuscate error:', error);
        await sock.sendMessage(chatId, {
            text: `╭╺╼━━─━■■━━─━╾╸\n┣⬣ OBFUSCATION FAILED\n┣➤ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━⬣\n\n> DARK EMPIRE TECH`
        }, { quoted: message });
    }
}

async function hardObfuscate(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Advanced obfuscation techniques
    let obfuscated = code;
    
    // 1. String obfuscation
    obfuscated = obfuscateStrings(obfuscated);
    
    // 2. Variable name mangling
    obfuscated = mangleVariables(obfuscated);
    
    // 3. Control flow flattening
    obfuscated = flattenControlFlow(obfuscated);
    
    // 4. Dead code injection
    obfuscated = injectDeadCode(obfuscated);
    
    // 5. Anti-debugging traps
    obfuscated = addAntiDebug(obfuscated);
    
    // 6. Encoding
    obfuscated = encodeCode(obfuscated);
    
    // 7. Add KNOX header
    obfuscated = `/*\n * Obfuscated by KNOX MD\n * Hard Obfuscation Level\n * Anti-Deobfuscation Enabled\n * DARK EMPIRE TECH\n */\n\n${obfuscated}`;
    
    return obfuscated;
}

function obfuscateStrings(code) {
    // Convert strings to encoded arrays
    return code.replace(/'([^']*)'|"([^"]*)"/g, (match, single, double) => {
        const str = single || double;
        const chars = [];
        for (let i = 0; i < str.length; i++) {
            chars.push(str.charCodeAt(i));
        }
        return `String.fromCharCode(${chars.join(',')})`;
    });
}

function mangleVariables(code) {
    const variables = new Set();
    const regex = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    
    // Collect variable names
    while ((match = regex.exec(code)) !== null) {
        variables.add(match[2]);
    }
    
    // Generate random names
    const mapping = {};
    variables.forEach(variable => {
        mapping[variable] = generateRandomName();
    });
    
    // Replace variable names
    let result = code;
    Object.entries(mapping).forEach(([original, replacement]) => {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        result = result.replace(regex, replacement);
    });
    
    return result;
}

function generateRandomName() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
    const length = Math.floor(Math.random() * 5) + 3;
    let name = '';
    for (let i = 0; i < length; i++) {
        name += chars[Math.floor(Math.random() * chars.length)];
    }
    return name;
}

function flattenControlFlow(code) {
    // Simple control flow flattening
    return code.replace(/\bif\s*\(([^)]+)\)\s*{([^}]+)}/g, (match, condition, body) => {
        const switchVar = generateRandomName();
        return `let ${switchVar}=0;while(${switchVar}===0){if(${condition}){${body}${switchVar}=1;}}`;
    });
}

function injectDeadCode(code) {
    // Inject random dead code
    const deadCode = [
        'const _dead_' + Date.now() + '=function(){return Math.random()*1000;};',
        'let _junk_' + Math.random().toString(36).substr(2) + '=Array(100).fill(0).map(()=>Math.random());',
        'function _fake_' + crypto.randomBytes(4).toString('hex') + '(){try{throw new Error()}catch(e){}}'
    ];
    
    const lines = code.split('\n');
    const insertAt = Math.floor(lines.length / 2);
    lines.splice(insertAt, 0, ...deadCode);
    return lines.join('\n');
}

function addAntiDebug(code) {
    const antiDebug = `
// Anti-debugging protection
const _antiDebug_${Date.now()} = () => {
    const start = Date.now();
    debugger;
    const end = Date.now();
    if (end - start > 100) {
        throw new Error("Debugger detected!");
    }
};
try {
    _antiDebug_${Date.now()}();
} catch (e) {
    // Silent catch
}

// Anti-console protection
const _realConsole = console;
console = new Proxy({}, {
    get(target, prop) {
        if (prop === 'log' || prop === 'warn' || prop === 'error') {
            return function() {
                // Do nothing or log to a hidden location
            };
        }
        return _realConsole[prop];
    }
});
`;
    
    return antiDebug + '\n' + code;
}

function encodeCode(code) {
    // Simple base64 encoding of function bodies
    return code.replace(/function\s+([^(]+)\(([^)]*)\)\s*{([^}]+)}/g, (match, name, args, body) => {
        const encodedBody = Buffer.from(body).toString('base64');
        return `function ${name}(${args}){eval(Buffer.from("${encodedBody}","base64").toString())}`;
    });
}

module.exports = obfuscateCommand;