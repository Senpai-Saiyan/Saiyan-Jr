var fs = require('fs'),
    blacklistJson = fs.readFileSync('./blacklist.json'),
    blacklist = JSON.parse(blacklistJson);

module.exports = {
    name: 'blacklist',
    type: 'owner',
    usage: 'blacklist <id>',
    permission: 6,
    help: 'Adds a user to the blacklist.',
    main: function(bot, msg) {
        let id = msg.content,
            found = false,
            i = 0;
        while (i < blacklist.length && !found) {
            if (blacklist[i] === id) {
                found = true;
                msg.reply("they're already blacklisted you schmuck!");
            }
            i++;
        }
        if (!found) {
            blacklist.push(id);
            fs.writeFileSync('./blacklist.json', JSON.stringify(blacklist, null, 3));
            msg.channel.send('User ID ' + msg.content + ' has been blacklisted!');
        }
    },
};
