exports.run = (bot, debug) => {
    if (debug.toString().indexOf('[connection') > -1) return;
    bot.debug(debug);
};
