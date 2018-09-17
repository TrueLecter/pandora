const PaginationEmbed = require('./PaginationEmbed');
const EmptyListException = require('../exceptions/EmptyListException');
const { MessageEmbed } = require('discord.js');
const { emojis } = require('../config');
const {
    functions: { capitalizeFirstLetter, imageUrl },
    fileDb: { translate },
} = require('../util');

class BerriesListEmbed extends PaginationEmbed {
    constructor (initialMessage, berries) {
        super(initialMessage);

        if (!berries.length) { throw new EmptyListException('Nothing to do with empty baits list'); }

        const embeds = berries.map((berry, idx, arr) => new MessageEmbed()
            .setTitle(`${translate(berry.name)} (${berry.grade}★)`)
            .setThumbnail(imageUrl('berries/' + berry.image))
            .addField('Rarity', capitalizeFirstLetter(berry.rarity), true)
            .addField('Stat', capitalizeFirstLetter(berry.target_stat), true)
            .addField('Great rate', `${(100 * berry.great_chance)}%`, true)
            .addField('Stat value', berry.is_percentage ? `${(100 * berry.value)}%` : berry.value, true)
            .addField('Sell price', `${berry.sell_cost}${emojis.gold}`, true)
            .addField('Eat cost', `${berry.eat_cost}${emojis.gold}`, true)
            .setFooter(`Page ${idx + 1}/${arr.length}`)
        );

        this.setArray(embeds).showPageIndicator(false);
    }
}

module.exports = BerriesListEmbed;
