const Discord = require('discord.js');

module.exports = {
    name: 'channelperms',
    type: 'utility',
    usage: 'channelperms <optional-mention>',
    permission: 1,
    help: 'Provides a user\'s permissions in the specified channel.',
    main: function(bot, msg) {
        let member = msg.member;
        if (msg.mentions.users.array()[0]) {
            member = msg.guild.members.get(msg.mentions.users.array()[0].id);
        }

        let channel = msg.channel;
        if (msg.mentions.channels.array()[0]) {
            channel = msg.guild.channels.get(msg.mentions.channels.array()[0].id);
        }

        var p = member.permissionsIn(channel).serialize(true);

        var perms = new Discord.RichEmbed()
            .setAuthor(member.user.username + '#' + member.user.discriminator, member.user.avatarURL)
            .setDescription('User Permissions in ' + channel.name)
            .setColor(msg.guild.me.displayColor);

        var i = 0;
        for (var key in p) {
            if (p.hasOwnProperty(key) && i < 24) {
                if (p[key] === false) {
                    perms.addField(blah(key), ':x:', true);
                } else {
                    perms.addField(blah(key), ':white_check_mark:', true);
                }
                i++;
            }
            if (i === 24) {
                msg.channel.send({ embed: perms });
                perms = new Discord.RichEmbed()
                    .setColor(msg.guild.me.displayColor)
                    .setFooter('Triggered by ' + msg.author.username, msg.author.avatarURL)
                    .setTimestamp();
                i = 0;
            }
        }

        msg.channel.send({ embed: perms });

        function blah(str) {
            if (str === 'MANAGE_ROLES_OR_PERMISSIONS') str = 'MANAGE_ROLES';
            str = str.replace(new RegExp('_', 'g'), ' ');
            return str.replace(/\w\S*/g, txt => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    },
};
