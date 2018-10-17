module.exports = {
    name: 'restartshards',
    type: 'owner',
    usage: 'restartshards',
    permission: 6,
    help: 'Restarts all of the bots shards.',
    main: function(bot, msg) {
        if (!bot.shard) return msg.channel.send(`This bot isn't sharded, nub!`);
        msg.channel.send(':wave: All shards of ' + bot.user.username + ' are restarting...');

        setTimeout(() => {
            bot.shard.broadcastEval('process.exit(0)');
        }, 1000);
        return null;
    },
};
