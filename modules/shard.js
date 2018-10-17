module.exports = {
    name: 'shard',
    type: 'core',
    usage: 'shard',
    permission: 1,
    help: 'Tells you what shard you\'re on.',
    main: function(bot, msg) {
        if (bot.shard) {
            msg.channel.send('Shard ' + (bot.shard.id + 1) + '/' + bot.shard.count);
        } else {
            msg.channel.send('Shard 1/1');
        }
    },
};
