module.exports = {
    name: 'coinflip',
    type: 'fun',
    usage: 'coinflip',
    permission: 1,
    help: 'Flips a coin.',
    main: function(bot, msg) {
        msg.channel.send(`The coin landed on ${Math.random() > 0.5 ? 'Heads' : 'Tails'}!`);
    },
};
