var Discord = require('discord.js');

module.exports = {
    name: 'settings',
    type: 'core',
    usage: 'settings <arguments>',
    permission: 4,
    help: 'Changes server settings.',
    main: function(bot, msg) {
        // var validSettings = ['announcementChannel', 'welcomeMessage', 'leaveMessage', 'banMessage', 'joinRole', 'botRole', 'inviteLinkDeletion', 'mentionSpamProtection', 'modLogChannel']
        var validSettings = ['joinRole', 'botRole', 'inviteLinkDeletion', 'mentionSpamProtection', 'modLogChannel'];
        var joinLeaveSettings = ['welcomeMessage', 'leaveMessage', 'banMessage'];
        var channelSettings = ['announcementChannel', 'modLogChannel'];
        var roleSettings = ['joinRole', 'botRole'];
        var booleanSettings = ['inviteLinkDeletion', 'mentionSpamProtection', 'modLogs'];
        // var acceptedArgs = '``{server:name}``, ``{user:username}``, ``{user:mention}``, ``{user:discrim}``, ``{server:membercount}``';

        if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.reply("you do not have permission to manage this server's setings!");

        if (!msg.args[0]) {
            var settings = new Discord.RichEmbed()
                .setAuthor(`Guild settings for ${msg.guild.name}`, msg.guild.iconURL)
                .setDescription(`Use "settings <settingName>" to change a setting!`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Powered by ${bot.user.username}`, bot.user.avatarURL)
                .setTimestamp();
            bot.getAllSettings(msg.guild.id).then(obj => {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && key !== 'id' && key !== 'name' && key !== 'prefix') {
                        settings.addField(key, obj[key].toString() || 'None', true);
                    }
                }
                msg.channel.send({ embed: settings });
            });
            msg.channel.send('Welcome/Leave/Ban messages are currently disabled for maintainance!');
        } else if (joinLeaveSettings.indexOf(msg.args[0]) > -1) {
            msg.reply('sorry, this is disabled for now for bug fixes!');
            /* bot.getCurrentBooleanSetting(msg.args[0], msg.guild.id).then(value => {
                processJoinLeaveSettings(msg.args[0], value)
            })*/
        } else if (channelSettings.indexOf(msg.args[0]) > -1) {
            msg.reply('sorry, this is disabled for now for bug fixes!');
            /* bot.getCurrentSetting(msg.args[0], msg.guild.id).then(value => {
                processChannelSetting(msg.args[0], value);
            })*/
        } else if (roleSettings.indexOf(msg.args[0]) > -1) {
            bot.getCurrentSetting(msg.args[0], msg.guild.id).then(value => {
                processRoleSetting(msg.args[0], value);
            });
        } else if (booleanSettings.indexOf(msg.args[0]) > -1) {
            bot.getCurrentBooleanSetting(msg.args[0], msg.guild.id).then(value => {
                processBooleanSetting(msg.args[0], value);
            });
        } else {
            msg.reply('please specify a valid argument! Accepted arguments: ' + validSettings.join(', '));
        }

        /* function processJoinLeaveSettings(setting, value) {
            if (value === 1) {
                var isOn = true;
            } else if (value === 0) {
                isOn = false;
            }
            msg.channel.send(`The ${setting} for this server is **${isOn ? 'on' : 'off'}**. Do you want to turn it **${isOn ? 'off' : 'on'}**? (Reply with 'yes' or 'no')`);
            var collector = msg.channel.createCollector(
                m => m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no',
                { time: 30000 }
            );
            collector.on('collect', m => {
                if (m.content.toLowerCase() === 'yes' && m.author.id === msg.author.id) {
                    if (isOn) {
                        value = 0;
                    } else {
                        value = 1;
                    }
                    var val = bot.setNewValue(setting + 'sEnabled', msg.guild.id, value);
                    msg.channel.send(`${setting} ${val ? 'enabled' : 'disabled'}.`);
                    msg.channel.send(`Make sure to configure the announcementChannel as well!`);
                    collector.stop();
                } else if (m.content.toLowerCase() === 'no' && m.author.id === msg.author.id) {
                    msg.channel.send(`The ${setting} is staying **${value ? 'on' : 'off'}**.`);
                    collector.stop();
                    msg.channel.send(`Would you like to edit the ${setting}?`);
                    var collector3 = msg.channel.createCollector(
                        m2 => m2.content.toLowerCase() === 'yes' || m2.content.toLowerCase() === 'no',
                        { time: 30000 }
                    );
                    collector3.on('collect', m2 => {
                        if (m2.content.toLowerCase() === 'yes' && m2.author.id === msg.author.id) {
                            promptForMessage();
                        }
                    });
                }
                if (val) {
                    promptForMessage();
                }
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.send('No messages were detected within 30 seconds. Aborting...');
                }
                console.log(`Collected ${collected.size} items`);
            });
            function promptForMessage() {
                msg.channel.send(`What would you like the ${setting} to be? You may include the following arguments in your welcome message: ${acceptedArgs}`);
                var collector2 = msg.channel.createCollector(
                    m => msg.author.id === m.author.id,
                    { time: 60000 }
                );
                collector2.on('collect', m => {
                    m.channel.send(`${setting} set to \`${bot.setNewValue(setting, m.guild.id, m.content)}\`!`);
                    collector2.stop();
                });
                collector2.on('end', collected => {
                    if (collected.size === 0) {
                        msg.channel.send('No messages were detected within 60 seconds. Aborting...');
                    }
                    console.log(`Collected ${collected.size} items`);
                });
            }
        }

        function processChannelSetting(setting, value) {
            msg.channel.send(`The current ${setting} for this server is <#${value}>. Do you want to change it? (Reply with 'yes' or 'no')`);
            var collector = msg.channel.createCollector(
                m => m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no',
                { time: 30000 }
            );
            collector.on('collect', m => {
                var change = false;
                if (m.content.toLowerCase() === 'yes' && m.author.id === msg.author.id) {
                    change = true;
                    collector.stop();
                } else if (m.content.toLowerCase() === 'no' && m.author.id === msg.author.id) {
                    msg.channel.send(`The ${setting} will remain as <#${value}>.`);
                    collector.stop();
                }
                if (change) {
                    msg.channel.send(`What would you like the ${setting} to be? (Mention a channel)`);
                    var collector2 = msg.channel.createCollector(
                        m2 => msg.author.id === m2.author.id,
                        { time: 60000 }
                    );
                    collector2.on('message', m2 => {
                        if (m2.mentions.channels.array()[0]) {
                            m2.channel.send(`${setting} set to <#${bot.setNewValue(setting, m2.guild.id, m2.mentions.channels.array()[0].id)}>!`);
                            collector2.stop();
                        } else {
                            m2.channel.send(`Please mention a channel!`);
                        }
                    });
                    collector2.on('end', collected => {
                        if (collected.size === 0) {
                            msg.channel.send('No messages were detected within 60 seconds. Aborting...');
                        }
                        console.log(`Collected ${collected.size} items`);
                    });
                }
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.send('No messages were detected within 30 seconds. Aborting...');
                }
                console.log(`Collected ${collected.size} items`);
            });
        } */

        function processRoleSetting(setting, value) {
            msg.channel.send(`The current ${setting} for this server is **${value}**. Do you want to change it? (Reply with 'yes' or 'no')`);
            var collector = msg.channel.createCollector(
                m => m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no',
                { time: 30000 }
            );
            collector.on('collect', m => {
                var e = false;
                if (m.content.toLowerCase() === 'yes' && m.author.id === msg.author.id) {
                    e = true;
                    collector.stop();
                } else if (m.content.toLowerCase() === 'no' && m.author.id === msg.author.id) {
                    msg.channel.send(`The ${setting} will remain as **${value}**.`);
                    collector.stop();
                }
                if (e) {
                    msg.channel.send(`What would you like the ${setting} to be? (Say the name of a role, 'none' for none)`);
                    var collector2 = msg.channel.createCollector(
                        m2 => msg.author.id === m2.author.id,
                        { time: 60000 }
                    );
                    collector2.on('message', m2 => {
                        if (m2.guild.roles.find('name', m2.content)) {
                            m2.channel.send(`${setting} set to ${bot.setNewValue(setting, m.guild.id, m.guild.roles.find('name', m2.content).id)}!`);
                            collector2.stop();
                        } else if (m2.content.toLowerCase() === 'none') {
                            bot.setJoinRole(m2.guild.id, 'none');
                            m2.channel.send(`${setting} has been turned off!`);
                            collector2.stop();
                        } else {
                            m2.channel.send(`Please say the name of a valid role or none!`);
                        }
                    });
                    collector2.on('end', collected => {
                        if (collected.size === 0) {
                            msg.channel.send('No messages were detected within 60 seconds. Aborting...');
                        }
                        console.log(`Collected ${collected.size} items`);
                    });
                }
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.send('No messages were detected within 30 seconds. Aborting...');
                }
                console.log(`Collected ${collected.size} items`);
            });
        }

        function processBooleanSetting(setting, value) {
            msg.channel.send(`${setting} for this server is currently **${value ? 'on' : 'off'}**. Do you want to turn it ${value ? 'off' : 'on'}? (Reply with 'yes' or 'no')`);
            var collector = msg.channel.createCollector(
                m => m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no',
                { time: 30000 }
            );
            collector.on('collect', m => {
                if (m.content.toLowerCase() === 'yes' && m.author.id === msg.author.id) {
                    if (value === 1) {
                        value = 0;
                    } else {
                        value = 1;
                    }
                    value = bot.setNewValue(setting, msg.guild.id, value);
                    msg.channel.send(`${setting} ${value ? 'enabled' : 'disabled'}.`);
                    if (setting === 'modLogs' && setting) {
                        msg.channel.send('Please make sure to configure the modLogChannel setting to allow modLogs to work!');
                    }
                    collector.stop();
                } else if (m.content.toLowerCase() === 'no' && m.author.id === msg.author.id) {
                    msg.channel.send(`${setting} will remain **${value}**.`);
                    collector.stop();
                }
            });
            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.channel.send('No messages were detected within 30 seconds. Aborting...');
                }
            });
        }
        return null;
    },
};
