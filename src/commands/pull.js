const {
    functions: { getPrefix, random, makePullImage, createImage, makeInRange },
    categories,
    cmdResult,
    fileDb: { heroes, translate }
} = require('../util');

const { MessageAttachment, MessageEmbed } = require('discord.js');

const _ = require('lodash');

const pickContractGrade = () => {
    const roll = Math.random();
    if (roll >= 0 && roll <= 0.81) {
        return '3';
    } else if (roll > 0.81 && roll <= 0.81 + 0.149) {
        return '4';
    } else if (roll > 0.81 + 0.149 && roll <= 0.81 + 0.149 + 0.035) {
        return '5';
    }
    return '6';
};

const collection = heroes.filter(h => h.type && h.type !== 'limited' && h.type !== 'secret' && h.type !== 'legendary');

const sortedForms = [3, 4, 5, 6].map(k => ({
    k: k,
    v: _.flatten(collection.map(h => h.forms.map(f => { f.hero = h; return f; }))).filter(f => Number(f.star) === Number(k))
})).reduce((res, kv) => { res[kv.k] = kv.v; return res; }, {});

sortedForms.guaranteed = sortedForms[4].filter(f => f.hero.type === 'contract');

const instructions = (message) => {
    const prefix = getPrefix(message);

    return message.channel.send({
        embed:
            {
                title: `${prefix}pull`,
                description: 'Perform 10 premium contracts pull.',
                /*fields: [
                    {
                        name: '<collection>',
                        value: `Collection to pick from.
                        Can be one of \`${Object.keys(pickMapping).join(', ')}\``,
                    }
                ]*/
            }
    }).then(m => ({
        status_code: cmdResult.NOT_ENOUGH_ARGS,
    }));
};

const pickItem = async (message, args) => {
    const pull = new Array(makeInRange(parseInt(args[0]) || 10, 1, 20)).fill(0).map((_, idx) => {
        if ((1 + idx) % 10) {
            const grade = pickContractGrade();
            return sortedForms[grade][random(0, sortedForms[grade].length - 1)];
        } else {
            return sortedForms.guaranteed[random(0, sortedForms.guaranteed.length - 1)];
        }
    });

    const canvas = await makePullImage(pull);

    const embed = _.chunk(pull.map((form, idx) => {
        if (form.star < 4) return `${idx + 1}. ${translate(form.name)} (${form.star}★)`;
        if (form.hero.type === 'contract') return `**${idx + 1}. ${translate(form.name)} (${form.star}★)${(idx + 1) % 10 ? ' **' : ' (Guaranteed)**'}`;
        return `*${idx + 1}. ${translate(form.name)} (${form.star}★)*`;
    }), 10).reduce((e, p) => e.addField('\u200b', p.join('\n')), new MessageEmbed()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
        .setImage('attachment://pull.png')
    );

    return message.channel.send({ embed: embed, files: [new MessageAttachment(await canvas.getBufferAsync('image/png'), 'pull.png')] })
    .then(m => ({
        status_code: cmdResult.SUCCESS,
        target: 'pull',
        arguments: JSON.stringify({ }),
    }));
};

exports.run = (message, args) => pickItem(message, args);

exports.category = categories.MISC;