module.exports = {
    name: 'restart',
    type: 'owner',
    usage: 'restart',
    permission: 6,
    help: 'Restarts the bot.',
    main: function(bot, msg) {
        if (msg.author.id === require('../config.json').owner) {
            if (!bot.shard) {
                msg.channel.send(':wave: ' + bot.user.username + ' is restarting...');
            } else				{
                msg.channel.send(':wave: Shard ' + bot.shard.id + ' of ' + bot.user.username + ' is restarting...');
            }

            setTimeout(() => {
                process.exit();
            }, 1000);
        } else {
            msg.reply('you do not have permission to do this!');
        }
    },
};
