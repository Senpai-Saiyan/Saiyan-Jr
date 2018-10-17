exports.run = (bot, guild) => {
    bot.removeServer(guild);
    bot.sendServerCount(bot);
    bot.joinleavehook('leave', guild);
};
