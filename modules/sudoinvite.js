module.exports = {
    name: 'sudoinvite',
    type: 'owner',
    usage: 'sudoinvite <server name>',
    permission: 6,
    help: 'Sends you an invite to the given server.',
    main: function(bot, msg) {
        if (msg.author.id === require('../config.json').owner) {
            const serverToInvite = msg.content;
            msg.channel.send('Alright, I am sending you an invite to ' + serverToInvite + '!');
            try {
                var server = bot.guilds.find('name', serverToInvite);
                server.channels.array()[0].createInvite()
                    .then(i => {
                        msg.author.send('https://discord.gg/' + i.code);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    },
};
