const { MessageEmbed } = require('discord.js');
const {
    fileDb: { goddessesFuzzy, goddesses, translate },
    functions: { getPrefix, imageUrl },
    categories,
    cmdResult,
} = require('../util');

const instructions = (message) => {
    const prefix = getPrefix(message);
    const msg = {
        title: `${prefix}goddess [<name>]`,
        fields: [
            {
                name: '<name>',
                value: `Get goddess data.\n*e.g. ${prefix}goddess sera*`
            }
        ]
    };

    return message.channel
        .send({ embed: msg })
        .then(m => ({
            status_code: cmdResult.NOT_ENOUGH_ARGS,
        }));
};

const command = (message, args) => {
    const name = args.join(' ');

    const candidates = goddessesFuzzy.search(name);

    if (!candidates.length) {
        return message.channel
            .send('Goddess not found!')
            .then(m => ({
                status_code: cmdResult.ENTITY_NOT_FOUND,
            }));
    }

    const goddess = goddesses[candidates[0].path];

    const msg = new MessageEmbed()
        .setTitle(translate(goddess.name))
        .addField(translate(goddess.skill_name), translate(goddess.skill_description))
        .setThumbnail(imageUrl('heroes/' + goddess.image));

    return message.channel
        .send(msg)
        .then(m => ({
            status_code: cmdResult.SUCCESS,
            target: goddess.id,
            arguments: JSON.stringify({ input: args.join(' ') }),
        }));
};

exports.run = (message, args) => {
    if (!args.length) { return instructions(message); }

    return command(message, args);
};

exports.category = categories.DB;
