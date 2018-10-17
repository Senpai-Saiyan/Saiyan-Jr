module.exports = {
    name: 'fml',
    type: 'fun',
    usage: 'fml',
    permission: 1,
    help: 'Grabs a fml entry',
    main: function(bot, msg) {
        var fml = require('fmylife'), { RichEmbed } = require('discord.js');
        fml.random().then(m => msg.channel.send({ embed: new RichEmbed()
            .setTitle('"Fuck my Life" Story')
            .setDescription(m)
            .setFooter('Powered by fmylife')
            .setTimestamp()
            .setColor(msg.guild.me.displayHexColor),
        }));
    },
};
