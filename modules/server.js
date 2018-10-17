module.exports = {
    name: 'server',
    type: 'informational',
    usage: 'server',
    permission: 1,
    help: 'Provides information about the server.',
    main: function(bot, msg) {
        const Discord = require('discord.js');
        var members = 0, bots = 0;

        msg.guild.members.forEach(member => {
            if (member.user.bot) {
                bots++;
            } else {
                members++;
            }
        });

        const embed = new Discord.RichEmbed()
            .setTitle(msg.guild.name)
            .setColor(msg.guild.me.displayColor)
            .setFooter('Triggered by ' + msg.author.username, msg.author.avatarURL)
            .setThumbnail(msg.guild.iconURL)
            .setTimestamp()
            .addField('**Name**', msg.guild.name, true)
            .addField('**Created**', msg.guild.createdAt.toLocaleString(), true)
            .addField('**ID**', msg.guild.id, true)
            .addField('**Owner**', msg.guild.owner.user.username, true)
            .addField('**Default Channel**', msg.guild.defaultChannel || 'None', true)
            .addField('**Region**', msg.guild.region, true)
            .addField('**Total Members**', msg.guild.members.size, true)
            .addField('**User Count**', members, true)
            .addField('**Bot Count**', bots, true)
            .addField('**Channel Count**', msg.guild.channels.size, true)
            .addField('**Roles**', msg.guild.roles.size, true);

        if (msg.guild.features[0]) {
            embed.addField('**Features**', msg.guild.features.join('\n'))
                .setDescription('<:partner:314068430556758017> Partnered Server <:partner:314068430556758017>');
            if (msg.guild.features.includes('INVITE_SPLASH')) {
                embed.setImage(msg.guild.splashURL + '?size=2048');
            }
        } else {
            embed.setDescription('Server Information');
        }
        msg.channel.send({ embed: embed });
    },
};
