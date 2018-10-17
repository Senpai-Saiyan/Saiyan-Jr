var myGoogleNews = require('my-google-news');
var Discord = require('discord.js');

module.exports = {
    name: 'news',
    type: 'informational',
    usage: 'news <query>',
    permission: 1,
    help: 'Gets news from Google News.',
    main: function(bot, msg) {
        bot.checkForUpvote(msg).then(u => {
            if (u) {
                var e = new Discord.RichEmbed()
                    .setTitle('Google News')
                    .setColor(msg.guild.me.displayColor)
                    .setFooter('Powered by Google News, not Saiyan')
                    .setTimestamp();
                myGoogleNews.resultsPerPage = 10;
                myGoogleNews(msg.content, (err, res) => {
                    if (err) console.error(err);
                    res.links.forEach(item => {
                        e.addField(item.title, item.href);
                        console.log(item.description + '\n');
                    });
                    msg.channel.send({ embed: e });
                });
            } else {
                bot.promptForUpvote(msg, this.name);
            }
        });
    },
};
