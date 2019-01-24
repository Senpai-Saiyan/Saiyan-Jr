const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./../config.json');
module.exports = {
    name: 'changenick',
    type: 'core',
    usage: '&changenick <nickname>',
    permission: 3,
    help: 'changes bots nickname in current server',
    main: function(bot, msg) {
              msg.channel.send('Nickname Changed!');
              },
};
