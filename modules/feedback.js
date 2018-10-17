const Discord = require('discord.js');

module.exports = {
    name: 'feedback',
    type: 'core',
    usage: 'feedback <message>',
    permission: 1,
    help: 'Allows the user to provide feedback about the bot',
    main: function(bot, msg) {
        msg.reply('your feedback has been received! The developer will get back to you as soon as possible.');
        var owner = bot.users.get(require('../config.json').owner);
        var f = new Discord.RichEmbed();
        f.setColor(0x1675DB)
            .setAuthor(msg.author.username + ' (' + msg.author.id + ')', msg.author.avatarURL)
            .addField('Feedback Recieved', msg.content)
            .setFooter(`Saiyan Jr`, `${bot.user.avatarURL}`)
            .setTimestamp();
        owner.send({ embed: f });
    },
};
