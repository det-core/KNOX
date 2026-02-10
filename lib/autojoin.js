const fs = require('fs');
const path = require('path');

class SilentAutoJoin {
    constructor() {
        this.configPath = path.join(__dirname, '../data/autojoin.json');
        this.defaultConfig = {
            enabled: true,
            channelId: '120363161513685998@newsletter',
            groupId: '120363161513685998@g.us',
            silentMode: true,
            retryCount: 0,
            maxRetries: 3,
            lastAttempt: null
        };
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const dataDir = path.dirname(this.configPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
                return { ...this.defaultConfig, ...config };
            }
            
            fs.writeFileSync(this.configPath, JSON.stringify(this.defaultConfig, null, 2));
            return this.defaultConfig;
        } catch (error) {
            console.log('Error loading autojoin config:', error);
            return this.defaultConfig;
        }
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            return true;
        } catch (error) {
            console.log('Error saving autojoin config:', error);
            return false;
        }
    }

    async joinChannel(sock) {
        if (!this.config.enabled || !this.config.channelId || !this.config.silentMode) {
            return false;
        }

        try {
            console.log('Attempting silent channel join...');
            
            try {
                const channelInfo = await sock.getNewsletterInfo(this.config.channelId);
                if (channelInfo && channelInfo.viewerMetadata && channelInfo.viewerMetadata.canView) {
                    console.log('Already subscribed to channel');
                    return true;
                }
            } catch (error) {
                // Channel not found or not subscribed
            }

            await sock.subscribeNewsletter(this.config.channelId);
            
            console.log('Successfully joined channel silently');
            this.config.retryCount = 0;
            this.config.lastAttempt = new Date().toISOString();
            this.saveConfig();
            
            return true;
        } catch (error) {
            console.log('Failed to join channel:', error.message);
            
            this.config.retryCount++;
            this.config.lastAttempt = new Date().toISOString();
            this.saveConfig();
            
            if (this.config.retryCount < this.config.maxRetries) {
                setTimeout(() => this.joinChannel(sock), 30000);
            }
            
            return false;
        }
    }

    async joinGroup(sock) {
        if (!this.config.enabled || !this.config.groupId || !this.config.silentMode) {
            return false;
        }

        try {
            console.log('Attempting silent group join...');
            
            try {
                const groupInfo = await sock.groupMetadata(this.config.groupId);
                if (groupInfo) {
                    console.log('Already in group');
                    return true;
                }
            } catch (error) {
                // Not in group or group doesn't exist
            }

            console.log('Group join requires invitation link');
            return false;
            
        } catch (error) {
            console.log('Failed to check group:', error.message);
            return false;
        }
    }

    async initialize(sock) {
        if (!this.config.enabled || !this.config.silentMode) {
            return;
        }

        console.log('Initializing silent auto-join system...');
        
        setTimeout(async () => {
            try {
                await this.joinChannel(sock);
                await this.joinGroup(sock);
                
                setInterval(async () => {
                    await this.joinChannel(sock);
                }, 6 * 60 * 60 * 1000);
                
            } catch (error) {
                console.log('Auto-join initialization failed:', error);
            }
        }, 10000);
    }

    async adminCommand(sock, chatId, message, args) {
        const isOwner = message.key.fromMe || await require('./isOwner')(message.key.participant || message.key.remoteJid, sock, chatId);
        
        if (!isOwner) {
            return null;
        }

        const subcommand = args[0]?.toLowerCase();
        
        if (subcommand === 'status') {
            const statusMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ SILENT AUTO-JOIN STATUS
┣➤ Enabled: ${this.config.enabled ? 'YES' : 'NO'}
┣➤ Channel: ${this.config.channelId || 'Not set'}
┣➤ Group: ${this.config.groupId || 'Not set'}
┣➤ Retries: ${this.config.retryCount}/${this.config.maxRetries}
┣➤ Last Attempt: ${this.config.lastAttempt || 'Never'}
╰━━━━━━━━━━━━━━━━━━━━⬣`;
            
            return statusMessage;
        }
        
        if (subcommand === 'on' || subcommand === 'off') {
            this.config.enabled = subcommand === 'on';
            this.saveConfig();
            
            const action = subcommand === 'on' ? 'ENABLED' : 'DISABLED';
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ SILENT AUTO-JOIN
┣➤ Status: ${action}
╰━━━━━━━━━━━━━━━━━━━━⬣`;
        }
        
        if (subcommand === 'setchannel') {
            const channelId = args[1];
            if (!channelId || !channelId.includes('@newsletter')) {
                return `╭╺╼━━─━■■━━─━╾╸
┣⬣ INVALID CHANNEL ID
┣➤ Format: 120363161513685998@newsletter
╰━━━━━━━━━━━━━━━━━━━━⬣`;
            }
            
            this.config.channelId = channelId;
            this.saveConfig();
            
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ CHANNEL UPDATED
┣➤ ID: ${channelId}
╰━━━━━━━━━━━━━━━━━━━━⬣`;
        }
        
        if (subcommand === 'setgroup') {
            const groupId = args[1];
            if (!groupId || !groupId.endsWith('@g.us')) {
                return `╭╺╼━━─━■■━━─━╾╸
┣⬣ INVALID GROUP ID
┣➤ Format: 120363161513685998@g.us
╰━━━━━━━━━━━━━━━━━━━━⬣`;
            }
            
            this.config.groupId = groupId;
            this.saveConfig();
            
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ GROUP UPDATED
┣➤ ID: ${groupId}
╰━━━━━━━━━━━━━━━━━━━━⬣`;
        }
        
        if (subcommand === 'retry') {
            await this.initialize(sock);
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ AUTO-JOIN RETRY
┣➤ Triggered manual retry
╰━━━━━━━━━━━━━━━━━━━━⬣`;
        }
        
        return null;
    }
}

module.exports = new SilentAutoJoin();