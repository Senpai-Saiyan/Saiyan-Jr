var googl = require('goo.gl');
var config = require('../config.json');

module.exports = {
    name: 'expand',
    type: 'utility',
    usage: 'expand <URL>',
    permission: 1,
    help: 'Expands a goo.gl URL.',
    main: function(bot, msg) {
        googl.setKey(config.googl);

        googl.expand(msg.content)
            .then(longURL => {
                msg.channel.send('URL expanded to ' + longURL);
            })
            .catch(err => {
                msg.channel.send(err);
                console.error(err.message);
            });
    },
};
