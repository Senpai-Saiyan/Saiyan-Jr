exports.run = (bot, emoji) => {
    bot.channels.get(bot.config.eventlogging).send(
        {
            embed: {
                title: ':card_box: Emoji Created',
                fields: [{
                    name: 'Guild',
                    value: emoji.guild.name,
                    inline: true,
                }, {
                    name: 'Name',
                    value: `${emoji.name} <:${emoji.name}:${emoji.id}>`,
                    inline: true,
                }], timestamp: new Date(), color: '65280',
            },
        });
};
