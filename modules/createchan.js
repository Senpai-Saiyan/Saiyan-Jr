module.exports = {
    name: 'createchan',
    type: 'moderation',
    usage: 'createchan <channel>',
    permission: 4,
    help: 'Creates a channel of the specified name.',
    main: function(bot, msg) {
        if (msg.member.hasPermission('MANAGE_CHANNELS')) {
            try {
                msg.guild.createChannel(msg.content, 'text')
                    .then(chan => msg.channel.send('Alright, I have created the channel <#' + chan.id + '>!'));
            } catch (err) {
                console.log(err);
                msg.channel.send('ERR: ' + err);
            }
        }
    },
};
