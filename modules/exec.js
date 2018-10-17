module.exports = {
    name: 'exec',
    type: 'owner',
    usage: 'exec <command>',
    permission: 6,
    help: 'Allows bot administrators to execute shell commands.',
    main: function(bot, msg) {
        var Discord = require('discord.js');

        if (msg.author.id === require('../config.json').owner) {
            var embed = new Discord.RichEmbed()
                .setFooter(`${msg.author.username}`, `${msg.author.avatarURL}`)
                .setTimestamp();

            require('child_process').exec(msg.content, (err, stdout, stderr) => {
                if (err) {
                    embed.setColor(0xFF0000)
                        .setTitle('Command Execution Error')
                        .addField('Error', '```sh\n' + stderr + '```');
                } else {
                    embed.setColor(0x00FF00)
                        .setTitle('Command Execution Success')
                        .addField('Result', '```sh\n' + stdout + '```');
                }
                msg.channel.send({ embed: embed });
            });
        } else {
            msg.reply('you do not have permission to use this command!');
        }
    },
};
