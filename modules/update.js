const child_process = require('child_process');
module.exports = {
    name: 'update',
    type: 'owner',
    usage: 'update',
    permission: 6,
    help: 'Pulls new changes from Github and restarts.',
    main: function(bot, msg) {
        if (msg.author.id !== require('../config.json').owner) return msg.reply('you are not allowed to do this!');
        msg.channel.send('Updating...').then(e => {
            var evaled = child_process.execSync('git pull').toString();
            e.channel.send('```' + evaled + '```');
            if (evaled.indexOf('Already up-to-date.') > -1) {
                e.channel.send('There was nothing to update!');
            } else {
                e.channel.send('New code successfully pulled!\nRestarting...');
                setTimeout(() => {
                    process.exit(0);
                }, 2000);
            }
        });
        return null;
    },
};
