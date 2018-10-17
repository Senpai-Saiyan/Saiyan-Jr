module.exports = {
    name: 'say',
    type: 'fun',
    usage: 'say',
    permission: 1,
    help: 'Makes the bot say something.',
    main: function(bot, msg) {
   if(msg.author.bot) return; {
            var content = msg.content;
            if (content.indexOf('mention:') > -1) {
                if (content.indexOf(' ', content.indexOf('mention:') + 8) > -1) {
                    var mention = content.substring(content.indexOf('mention:') + 8, content.indexOf(' ', content.indexOf('mention:') + 8));
                } else {
                    mention = content.substring(content.indexOf('mention:') + 8, content.length);
                }
                console.log(mention);
                if (bot.users.get(mention)) {
                    if (content.indexOf(' ', content.indexOf('mention:') + 8) > -1) {
                        content = content.replace(content.substring(content.indexOf('mention:'), content.indexOf(' ', content.indexOf('mention:') + 8)), '<@' + bot.users.get(mention).id + '>');
                    } else {
                        content = content.replace(content.substring(content.indexOf('mention:'), content.length, '<@' + bot.users.get(mention).id + '>'));
                    }
                }
                msg.channel.send(content);
            } else {
                msg.channel.send(content);
            }
            msg.delete();
        }
    },
};