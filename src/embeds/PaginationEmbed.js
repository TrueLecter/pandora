const { Embeds: EmbedsMode } = require('discord-paginationembed');
const { Message } = require('discord.js');

class PaginationEmbed extends EmbedsMode {
    constructor (initialMessage) {
        if (initialMessage && !(initialMessage instanceof Message)) throw new Error('Initial message should be Discord.js Message object or null');
        super({
            navigationEmojis: {
                back: '◀',
                jump: '🅱',
                forward: '▶',
                delete: '🤔'
            }
        });

        this.setDisabledNavigationEmojis(['JUMP', 'DELETE']);
        this.addFunctionEmoji('🗑', (_, self) => {
            self.clientMessage.message.delete();
            if (initialMessage) initialMessage.delete();
        });

        if (initialMessage) {
            this.setAuthorizedUsers([initialMessage.author.id]);
            this.setChannel(initialMessage.channel);
        }
    }

    send () {
        return this.build();
    }
}

module.exports = PaginationEmbed;