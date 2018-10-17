var fs = require('fs'),
    afkJson = fs.readFileSync('./afk.json'),
    afk = JSON.parse(afkJson),
    Discord = require('discord.js');

module.exports = {
    name: 'afk',
    type: 'fun',
    usage: 'afk <reason>',
    permission: 1,
    help: 'Sets your afk status.',
    main: function(bot, msg) {
        afkJson = fs.readFileSync('./afk.json');
        afk = JSON.parse(afkJson);
        let mentions = msg.mentions;
        if (mentions.everyone) { return msg.channel.send("You're not allowed to mention everyone with this command!"); }
        if (mentions.users.array()[0]) { return msg.channel.send('Please don\'t mention anyone with this command!'); }

        bot.getPrefix(msg).then(prefix => {
            if (msg.content === prefix + 'afk') {
                var reason = 'Not Specified';
            } else {
                reason = msg.content.replace('@everyone', '@​everyone').replace('@here', '@​here');
            }

            if (reason.length > 150) { return msg.channel.send("Your AFK reason can't be above 150 characters!"); }

            afk.push({
                name: msg.author.username,
                id: msg.author.id,
                reason: reason,
            });
            msg.channel.send(':ok_hand: I will set your status as AFK in 20 seconds for the following reason: **' + reason + '**').then(e => {
                setTimeout(() => {
                    fs.writeFileSync('./afk.json', JSON.stringify(afk, null, 3));
                    e.delete();
                    e.channel.send({ embed: new Discord.RichEmbed().setDescription(':robot: **' + msg.member.displayName + '** is AFK: **' + reason + '**') });
                }, 20000);
            });
            return null;
        });
        return null;
    },
};
