const Discord = require('discord.js');

module.exports = {
    name: 'user',
    type: 'informational',
    usage: 'user <optional-mention>',
    permission: 1,
    help: 'Provides information about a user.',
    main: function(bot, msg) {
        var member = msg.member;
        if (msg.mentions.users.array()[0]) {
            member = msg.guild.members.get(msg.mentions.users.array()[0].id);
        }
        var user = member.user;
        var roles = member.roles.size;

        if (user.presence.game) {
            var game = user.presence.game.name;
        } else {
            game = 'None';
        }

        var info = new Discord.RichEmbed()
            .setAuthor(user.username + '#' + user.discriminator, user.avatarURL)
            .setDescription('***User Information***')
            .setColor(member.displayHexColor)
            .setFooter('Triggered by ' + msg.author.username, msg.author.avatarURL)
            .setTimestamp()
            .setThumbnail(user.avatarURL)
            .addField('**Username**', user.username, true)
            .addField('**Display Name**', member.displayName, true)
            .addField('**ID**', user.id, true)
            .addField('**Account Created**', new Date(user.createdAt), true)
            .addField('**Join Date**', new Date(member.joinedAt), true)
            .addField('**Bot**', user.bot, true);

        if (user.presence.status === 'offline') {
            info.addField('**Status**', '<:offline:313956277237710868> Offline', true);
        } else if (user.presence.status === 'idle') {
            info.addField('**Status**', '<:away:313956277220802560> Idle', true);
        } else if (user.presence.status === 'online') {
            info.addField('**Status**', '<:online:313956277808005120> Online', true);
        } else if (user.presence.status === 'dnd') {
            info.addField('**Status**', '<:dnd:313956276893646850> Do Not Disturb', true);
        }
        if (member.hoistRole) {
            var hoist = member.hoistRole.name;
        } else {
            hoist = 'None';
        }

        if (member.colorRole) {
            var colorR = member.colorRole.name;
        } else {
            colorR = 'None';
        }
        info.addField('**Game**', game, true)
            .addField('**Roles**', roles, true)
            .addField('**Color**', member.displayHexColor, true)
            .addField('**Highest Role**', member.highestRole.name, true)
            .addField('**Hoist Role**', hoist, true)
            .addField('**Color Role**', colorR, true)
            .addField('**Avatar Link**', '[Avatar](' + user.avatarURL + ')', true);

        msg.channel.send({ embed: info });
    },
};
