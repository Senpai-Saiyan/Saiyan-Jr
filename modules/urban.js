/* module.exports = {
    name: 'urban',
    type: 'fun',
    usage: 'urban <word>',
    permission: 1,
    help: 'Defines a word from the Urban Dictionary.',
    main: function(bot, msg) {
        bot.checkForUpvote(msg).then(res => {
            if (res) {
                var urban = require('urban'),
                    definition = urban(msg.content);
                try {
                    definition.first(def => {
                        if (def !== undefined) {
                            const Discord = require('discord.js');
                            const embed = new Discord.RichEmbed()
                                .setTitle('Urban Dictionary')
                                .setColor(0xffff00)
                                .setDescription(def.word)
                                .setFooter('Triggered by ' + msg.author.username, msg.author.avatarURL)
                                .setThumbnail('')
                                .setTimestamp()
                                .addField('Definition', def.definition, false)
                                .addField('Example', def.example, false)
                            msg.channel.send({ embed: embed });
                        } else {
                            msg.channel.send('Could not find word.');
                        }
                    });
                } catch (err) {
                    msg.channel.send('An error occurred.');
                }
            } else {
                bot.promptForUpvote(msg, this.name);
            }
        });
    },
};
*/
