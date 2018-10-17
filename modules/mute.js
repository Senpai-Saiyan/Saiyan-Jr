// Work on permission checks in this command
const Discord = require('discord.js');

module.exports = {
    name: 'mute',
    type: 'moderation',
    usage: 'mute <user>',
    permission: 3,
    help: 'Mutes a specified user.',
    main: function(bot, msg) {
        var mutee = msg.mentions.users.array();

        for (var k = 0; k < mutee.length; k++) {
            var reason = msg.content.split(' ').splice(mutee.length).join(' ');
            var user = bot.users.get(mutee[k].id);
            var guild = msg.guild;
            var member = msg.guild.members.get(mutee[k].id);

            if (member.hasPermission('ADMINISTRATOR')) {
                return msg.channel.send("I can't mute " + user + '!');
            }

            msg.guild.channels.forEach(channel => {
                if (channel.type === 'text') {
                    channel.overwritePermissions(member, { SEND_MESSAGES: false });
                }
            });

            msg.reply(member + ' has been muted.');

            var mute = new Discord.RichEmbed()
                .setColor(0xFFB200)
                .setAuthor(user.username, user.avatarURL)
                .addField('Member Muted', `**${user.username}#${user.discriminator} (${user.id}) was muted.**`)
                .addField('Responsible Moderator', msg.member.displayName)
                .addField('Reason', reason || 'Not Specified')
                .setFooter(`${guild.name}`, `${guild.iconURL}`)
                .setTimestamp();
            try {
                var log = msg.guild.channels.find('name', 'mod-logs') || msg.guild.channels.find('name', 'modlogs');
                log.send({ embed: mute });
            } catch (e) {
                msg.channel.send({ embed: mute });
            }
        }
        return null;
    },
};
