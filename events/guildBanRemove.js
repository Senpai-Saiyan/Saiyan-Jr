var Discord = require('discord.js');

exports.run = (bot, guild, user) => {
    guild.fetchAuditLogs({ options: { limit: 5 } }).then(logs => {
        var action = logs.entries.array()[0];
        var ban = new Discord.RichEmbed();
        ban.setColor(0x00FF00)
            .setAuthor(user.username, user.avatarURL)
            .addField('Member Unbanned', `**${user.username}#${user.discriminator} (${user.id}) was unbanned from the server.**`)
            .addField('Responsible Moderator', action.executor.username)
            .addField('Reason', action.reason || 'Not Specified')
            .setFooter(`${guild.name} | ${guild.members.size} members`, `${guild.iconURL}`)
            .setTimestamp();
        bot.channels.get('489463353031393290').send({ embed: ban });
    });
};
