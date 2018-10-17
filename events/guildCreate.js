exports.run = (bot, guild) => {
    setTimeout(() => {
        bot.addServer(guild);
        bot.sendServerCount(bot);
        bot.joinleavehook('join', guild);
    }, 3000);
};
