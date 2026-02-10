const fs = require('fs');
const path = require('path');

class SilentAutoJoin {
    constructor() {
        this.configPath = path.join(__dirname, '../data/autojoin.json');
        this.defaultConfig = {
            enabled: true,
            channelLink: "https://whatsapp.com/channel/0029VbBwJYo6BIEp0Xlm1G0S",
            groupLink: "https://chat.whatsapp.com/DM6AKy9ANNm7IlfKT3C48f?mode=gi_t",
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
        if (!this.config.enabled || !this.config.channelLink || !this.config.silentMode) {
            return false;
        }

        try {
            console.log('Auto-join: Channel link available at:', this.config.channelLink);
            
            // In this Baileys version, we can't auto-join channels programmatically
            // Just log the channel link for manual joining
            this.config.retryCount = 0;
            this.config.lastAttempt = new Date().toISOString();
            this.saveConfig();
            
            return true;
        } catch (error) {
            console.log('Auto-join channel check failed:', error.message);
            
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
        if (!this.config.enabled || !this.config.groupLink || !this.config.silentMode) {
            return false;
        }

        try {
            console.log('Auto-join: Group link available at:', this.config.groupLink);
            
            // Group joining requires invitation link
            // Just log availability
            return true;
            
        } catch (error) {
            console.log('Auto-join group check failed:', error.message);
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
        
        if (!subcommand || subcommand === 'status') {
            const statusMessage = `╭╺╼━━─━■■━━─━╾╸
┣⬣ SILENT AUTO-JOIN STATUS
┣➤ Enabled: ${this.config.enabled ? 'YES' : 'NO'}
┣➤ Channel: ${this.config.channelLink || 'Not set'}
┣➤ Group: ${this.config.groupLink || 'Not set'}
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
            const channelLink = args[1];
            if (!channelLink || !channelLink.includes('whatsapp.com/channel/')) {
                return `╭╺╼━━─━■■━━─━╾╸
┣⬣ INVALID CHANNEL LINK
┣➤ Format: https://whatsapp.com/channel/0029VbBwJYo6BIEp0Xlm1G0S
╰━━━━━━━━━━━━━━━━━━━━⬣`;
            }
            
            this.config.channelLink = channelLink;
            this.saveConfig();
            
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ CHANNEL UPDATED
┣➤ Link: ${channelLink}
╰━━━━━━━━━━━━━━━━━━━━⬣`;
        }
        
        if (subcommand === 'setgroup') {
            const groupLink = args[1];
            if (!groupLink || !groupLink.includes('chat.whatsapp.com/')) {
                return `╭╺╼━━─━■■━━─━╾╸
┣⬣ INVALID GROUP LINK
┣➤ Format: https://chat.whatsapp.com/DM6AKy9ANNm7IlfKT3C48f?mode=gi_t
╰━━━━━━━━━━━━━━━━━━━━⬣`;
            }
            
            this.config.groupLink = groupLink;
            this.saveConfig();
            
            return `╭╺╼━━─━■■━━─━╾╸
┣⬣ GROUP UPDATED
┣➤ Link: ${groupLink}
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