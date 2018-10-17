const os = require('os'), Discord = require('discord.js'), osu = require('os-utils');
module.exports = {
    name: 'stats',
    type: 'core',
    usage: 'stats',
    permission: 1,
    help: 'Gives the bot\'s current statistics.',
    main: function(bot, msg) {
        var vals = {},
            date = new Date(bot.uptime);

        vals.memory = Math.round((os.totalmem() - os.freemem()) / 1000000);
        vals.totalmem = Math.round(os.totalmem() / 1000000);
        vals.strDate = date.getUTCDate() - 1 + 'd ' + date.getUTCHours() + 'h ' + date.getUTCMinutes() + 'm ' + date.getUTCSeconds() + 's';
        vals.owner = bot.users.get(require('../config.json').owner);

        if (bot.shard) {
            vals.shardid = bot.shard.id;
            vals.shardcount = bot.shard.count;
            bot.shard.fetchClientValues('guilds.size').then(g => {
                vals.guilds = g.reduce((prev, val) => prev + val, 0);
                bot.shard.fetchClientValues('channels.size').then(c => {
                    vals.channels = c.reduce((prev, val) => prev + val, 0);
                    bot.shard.fetchClientValues('users.size').then(u => {
                        vals.users = u.reduce((prev, val) => prev + val, 0);
                        osu.cpuUsage(v => {
                            vals.cpu = v.toFixed(2);
                            sendStats(vals);
                        });
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        } else {
            vals.shardid = 1;
            vals.shardcount = 1;
            vals.guilds = bot.guilds.length;
            vals.channels = bot.channels.length;
            vals.users = bot.users.length;
            sendStats(vals);
        }

        function sendStats(vals2) {
            var stats = new Discord.RichEmbed()
                .setAuthor(bot.user.username + ' Stats', bot.user.avatarURL)
                .setFooter('Powered by ' + bot.user.username, bot.user.avatarURL)
                .setTimestamp()
                .setColor(msg.guild.me.displayColor)
                .addField('**Owner**', vals2.owner.username + '#' + vals2.owner.discriminator + '\n(' + vals.owner.id + ')', true)
                .addField('**Library**', 'discord.js (v' + require('discord.js').version + ')', true)
                .addField('**Shard**', vals2.shardid + 1 + '/' + vals2.shardcount, true)
                .addField('**Servers**', vals2.guilds, true)
                .addField('**Channels**', vals2.channels, true)
                .addField('**Users Served**', vals2.users, true)
                .addField('**Uptime**', vals2.strDate, true)
                .addField('**RAM Usage**', vals2.memory + 'MB / ' + vals2.totalmem + ' MB', true)
                .addField('**CPU Usage**', (vals2.cpu * 100) + '%', true)
                .addField('**Host**', os.hostname() + ' (' + os.type() + ')', true);

            msg.channel.send({ embed: stats });
        }
    },
};
