var GoogleSearch = require('google-search');
var config = require('../config.json');
const Discord = require('discord.js');
var google = new GoogleSearch({
    key: config.key,
    cx: config.cx,
});

module.exports = {
    name: 'google',
    type: 'utility',
    usage: 'google <query>',
    permission: 1,
    help: 'Queries Google for information.',
    main: function(bot, msg) {
        bot.checkForUpvote(msg).then(res => {
            if (res) {
                google.build({
                    q: msg.content,
                    num: 1,
                }, (err, response) => {
                    console.log(err);
                    console.log(response);
                    if (err) {
                        console.error(err);
                        msg.channel.send('ERROR: Search failed');
                        return;
                    }
                    if (response.totalResults === 0 || response.items === undefined) {
                        msg.channel.send('No results.');
                    } else if (response.items !== undefined) {
                        console.log(response);
                        var results = new Discord.RichEmbed();
                        var link = response.items[0].link;
                        var title = response.items[0].title;
                        var desc = response.items[0].snippet;
                        results.setAuthor('Google', 'https://maxcdn.icons8.com/Share/icon/Logos/google_logo1600.png', 'https://www.google.com/')
                            .setTitle(title)
                            .setURL(link)
                            .setDescription(desc + ' [more](' + link + ')')
                            .setTimestamp()
                            .setColor(msg.guild.me.displayColor)
                            .setFooter('Some schmuck', bot.user.avatarURL);
                        msg.channel.send({ embed: results });
                    }
                });
            } else {
                bot.promptForUpvote(msg, this.name);
            }
        });
    },
};
