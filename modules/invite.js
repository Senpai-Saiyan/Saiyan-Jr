module.exports = {
    name: 'invite',
    type: 'core',
    usage: 'invite',
    permission: 1,
    help: 'Gives you the bot\'s invite link',
    main: function(bot, msg) {
        msg.channel.send('Add me now at https://discordapp.com/oauth2/authorize?client_id=' + bot.user.id + '&scope=bot&permissions=21469585838');
    },
};
