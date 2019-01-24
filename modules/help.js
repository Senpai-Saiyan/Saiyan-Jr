const Discord = require('discord.js');
module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help <optional-arg>',
    permission: 1,
    help: 'Gives you the documentation for the bot\'s commands.',
    main: function(bot, msg) {
        if (!msg.args[0]) {
            /*
            msg.channel.send(':mailbox: Check your DMs!');
            const myCommands = bot.commands.filter(c => c.permission <= bot.permLevel(msg));
            var help = new Discord.RichEmbed();
            help.setTitle(bot.user.username + ' Command List')
                .setDescription(`Do ${prefix}help <commandname> for details`)
                .setColor([r, g, b]);
            myCommands.forEach(c => {
                if (help.fields.length < 25) {
                    help.addField(prefix + c.name, c.help, true);
                } else {
                    msg.author.send({ embed: help });
                    help = new Discord.RichEmbed()
                        .setColor([r, g, b])
                        .addField(prefix + c.name, c.help, true);
                }
            });
            help.setFooter(bot.user.username + ' Command List')
                .setTimestamp();
            msg.author.send({ embed: help });
            var invite = new Discord.RichEmbed()
                .setTitle(bot.user.username + ' Help Server')
                .setColor([r, g, b])
                .setDescription('Come join us at https://discord.gg/8T8Abhy for support and more!')
                .setTimestamp();
            msg.author.send({ embed: invite });
            */
            try {
                const myCommands = bot.commands.filter(c => c.permission <= bot.permLevel(msg));

                var help = new Discord.RichEmbed()
                    .setAuthor(bot.user.username + ' Help | ' + myCommands.size + ' Commands', bot.user.avatarURL)
                    .setColor(msg.guild.me.displayHexColor)
                    .setDescription('**My prefix for this server is `' + msg.prefix + '`.**' +
                        '\n\nFor details regarding a specific command, use ' + msg.prefix + 'help <command-name>.')
                    .setTimestamp()
                    .setFooter(bot.user.username + ' Help');

                let currentCategory = '';
                let output = ``;
                const sorted = myCommands.array().sort((p, c) => p.type > c.type ? 1 : p.name > c.name && p.type === c.type ? 1 : -1);
                sorted.forEach(c => {
                    const cat = toProperCase(c.type);
                    if (currentCategory !== cat && currentCategory !== ``) {
                        help.addField(currentCategory + ' Commands:', output);
                        output = '';
                        currentCategory = cat;
                    } else if (currentCategory !== cat) {
                        currentCategory = cat;
                    }
                    output += `\`\`${c.name}\`\` `;
                });
                help.addField(currentCategory + ' Commands:', output);
                help.addField('Need more help?', 'https://discord.gg/8T8Abhy');
                if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
                    msg.channel.send(help);
                } else {
                    msg.author.send(help);
                }
            } catch (error) {
                bot.error(error);
            }
        } else {
            let command = msg.args[0];
            if (bot.commands.has(command)) {
                command = bot.commands.get(command);
                if (command.permission > bot.permLevel(msg)) return;
                var helpCommand = new Discord.RichEmbed();
                helpCommand.setTitle(toProperCase(command.name) + ' Command')
                    .setFooter(bot.user.username + ' Help')
                    .setTimestamp()
                    .addField('Category', `${toProperCase(command.type)}`, true)
                    .addField('Description', `${command.help}`, true)
                    .addField('Usage', `${msg.prefix}${command.usage}`, true)
                    .setColor(msg.guild.me.displayHexColor)
                    .setDescription('*Need more help? Join our support server at https://discord.gg/8T8Abhy*');
                /* if (command.conf.aliases != "") {
                    helpCommand.addField('Aliases', `${command.conf.aliases.join(', ')}`)
                }*/
                msg.channel.send({ embed: helpCommand });
            }
        }

        function toProperCase(m) {
            return m.replace(/([^\W_]+[^\s-]*) */g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        }
    },
};
