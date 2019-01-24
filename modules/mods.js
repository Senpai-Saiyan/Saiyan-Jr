const Discord = require('discord.js');

module.exports = {
    name: 'mods',
    type: 'informational',
    usage: 'mods',
    permission: 1,
    help: 'Gives you information about the server moderators.',
    main: function(bot, msg) {
        var members = {};

        msg.guild.members.forEach(member => {
            if (member.hasPermission('KICK_MEMBERS') && !member.user.bot) {
                if (!members[member.hoistRole ? member.hoistRole.name : 'None']) {
                    members[member.hoistRole ? member.hoistRole.name : 'None'] = [];
                }
                members[member.hoistRole ? member.hoistRole.name : 'None'].push(member);
            }
        });

        var mods = new Discord.RichEmbed()
            .setTitle('Moderators on ' + msg.guild.name)
            .setThumbnail(msg.guild.iconURL)
            .setFooter("Powered by Aliens", bot.user.iconURL)
            .setColor(msg.guild.me.displayColor)
            .setTimestamp();

        for (var role in members) {
            var str = '';
            var arr = members[role];

            for (var i = 0; i < arr.length; i++) {
                var user = arr[i].user;
                if (user.presence.status === 'offline') {
                    str += '<:offline:313956277237710868> **' + arr[i].displayName + '**\n';
                } else if (user.presence.status === 'idle') {
                    str += '<:away:313956277220802560> **' + arr[i].displayName + '**\n';
                } else if (user.presence.status === 'online') {
                    str += '<:online:313956277808005120> **' + arr[i].displayName + '**\n';
                } else if (user.presence.status === 'dnd') {
                    str += '<:dnd:313956276893646850> **' + arr[i].displayName + '**\n';
                }
            }

            arr = members[role];
            mods.addField(role, str);
        }

        msg.channel.send({ embed: mods });
    },
};
