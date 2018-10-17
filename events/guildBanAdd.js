var Discord = require('discord.js');

exports.run = (bot, guild, user) => {
    guild.fetchAuditLogs({ options: { limit: 5 } }).then(logs => {
        var action = logs.entries.array()[0];
        if (action.executor !== bot.user && action.target !== user) {
            var ban = new Discord.RichEmbed();
            ban.setColor(0xFFB200)
                .setAuthor(user.username, user.avatarURL)
                .addField('Member Banned', `**:hammer: ${user.username}#${user.discriminator} (${user.id}) was banned from the server.**`)
                .addField('Responsible Moderator', action.executor.username)
                .addField('Reason', action.reason || 'Not Specified')
                .setFooter(`${guild.name} | ${guild.members.size} members`, `${guild.iconURL}`)
                .setTimestamp();
            bot.channels.get('373256239318302721').send({ embed: ban });
        }
    });
};
