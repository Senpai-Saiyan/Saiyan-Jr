// Work on permission checks in this command
module.exports = {
    name: 'kick',
    type: 'moderation',
    usage: 'kick <usermention> <reason>',
    permission: 3,
    help: 'Kicks a specified user and places it in mod logs.',
    main: function(bot, msg) {
        const Discord = require('discord.js');
        var kickee = msg.mentions.users.array()[0];

        if (msg.member.hasPermission('KICK_MEMBERS') || msg.member.hasPermission('ADMINISTRATOR')) {
            try {
                var kicked = msg.guild.members.get(kickee.id);
                var user = bot.users.get(kickee.id);
                var guild = msg.guild;
                var reason = msg.content.split(' ').splice(1).join(' ');

                if (reason === '') {
                    reason = 'Not specified.';
                }

                kicked.kick(reason);

                msg.reply(kickee + ' has been successfullly kicked.');

                var ban = new Discord.RichEmbed();
                ban.setColor(0xFFB200)
                    .setAuthor(user.username, user.avatarURL)
                    .addField('Member Kicked', `**${user.username}#${user.discriminator} (${user.id}) got a foot up their ass.**`)
                    .addField('Violated by', msg.member.displayName)
                    .addField('Reason', reason)
                    .setFooter(`${guild.name} | ${guild.members.size} members`, `${guild.iconURL}`)
                    .setTimestamp();

                try {
                    var log = msg.guild.channels.find('name', 'mod-logs');
                    log.send({ embed: ban });
                } catch (e) {
                    msg.channel.send({ embed: ban });
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            msg.reply(' you do not have permission to perform this action!');
        }
    },
};
