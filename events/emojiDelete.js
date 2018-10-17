exports.run = (bot, emoji) => {
    bot.channels.get(bot.config.eventlogging).send({
        embed: {
            title: ':card_box: Emoji Deleted',
            fields: [{
                name: 'Guild',
                value: emoji.guild.name,
                inline: true,
            }, {
                name: 'Name',
                value: `${emoji.name}`,
                inline: true,
            }],
            timestamp: new Date(),
            color: '16711680',
        },
    });
};
