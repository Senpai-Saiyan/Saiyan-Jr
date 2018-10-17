module.exports = {
    name: 'sudo',
    type: 'owner',
    usage: 'sudo',
    permission: 6,
    help: 'Executes a command on behalf of another user.',
    main: function(bot, msg) {
        msg.delete();
        msg.author = msg.mentions.users.array()[0];
        msg.member = msg.guild.members.get(msg.author.id);
        msg.content = msg.content.substring(msg.content.indexOf(' ') + 1, msg.content.length);
        bot.processMessage(msg);
    },
};
