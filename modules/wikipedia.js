module.exports = {
    name: 'wikipedia',
    type: 'informational',
    usage: 'wikipedia <query>',
    permission: 1,
    help: 'Fetches a Wikipedia article',
    main: async function(bot, msg) {
        const { RichEmbed } = require('discord.js'), wiki = require('wikijs').default;
        msg.content = msg.content.replace(/ /g, '_');
        if (msg.content.toLowerCase().indexOf('discord') > -1) msg.content = msg.content.toLowerCase().replace('discord', 'Discord_(software)');
        wiki().page(msg.content).then(async function(page) { // eslint-disable-line prefer-arrow-callback
            const info = await page.summary();
            const image = await page.mainImage();
            msg.channel.send({
                embed: new RichEmbed()
                    .setAuthor('Wikipedia: ' + page.raw.title, 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/220px-Wikipedia-logo-v2.svg.png', page.raw.fullurl)
                    .setFooter('Powered by wikijs')
                    .setDescription(info.indexOf('\n') > -1 ? info.substring(0, info.indexOf('\n')) + `\n[Read More](${page.raw.fullurl})` : info + `\n[Read More](${page.raw.fullurl})`)
                    .setImage(image)
                    .setTimestamp()
                    .setColor(msg.guild.me.displayHexColor),
            });
        });
    },
};
