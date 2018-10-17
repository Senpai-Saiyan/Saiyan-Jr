module.exports = {
    name: 'timeout',
    type: 'moderation',
    usage: 'timeout <duration>',
    permission: 2,
    help: 'Times out a specified channel for a period of time',
    main: function(bot, msg) {
        var time = msg.content;
        var id;

        if (!isNaN(time) && msg.member.hasPermission('MANAGE_MESSAGES')) {
            id = msg.guild.id;

            msg.channel.overwritePermissions(id, { SEND_MESSAGES: false }).then(
                msg.channel.send(`**This channel has been timed out for ${time} seconds by ${msg.author}.**`).then(msg2 => {
                    setTimeout(() => {
                        msg2.edit('**The timeout period has elapsed.**');
                        msg2.channel.overwritePermissions(id, { SEND_MESSAGES: true });
                    }, time * 1000);
                })
            );
        }
    },
};

