const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./servers.sqlite');
const fs = require('fs');
const unirest = require('unirest');
const invitelink = /discord(?:app\.com|\.gg)[/invite/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9-]{2,32})/g;
var afkJson = fs.readFileSync('./afk.json'),
    afk = JSON.parse(afkJson),
    channel = null,
    stdin = process.openStdin(),
    Discord = require('discord.js');
if (process.argv[2] && process.argv[2] === '--travis') var config = require('./config-example.json');
else config = require('./config.json');

module.exports = bot => {
    /**
     * Server Related Functions
     */

    bot.fetchGuildSize = function() {
        return new Promise(
            resolve => {
                if (bot.shard) {
                    bot.shard.fetchClientValues('guilds.size').then(g => {
                        resolve(g.reduce((prev, val) => prev + val, 0));
                    }).catch(console.error);
                } else {
                    resolve(bot.guilds.size);
                }
            }
        );
    };

    bot.sendServerCount = function() {
        bot.fetchGuildSize().then(guilds => {
            unirest.post('https://bots.discord.pw/api/bots/' + bot.user.id + '/stats')
                .headers({
                    Authorization: bot.config.dbotspw,
                    'Content-Type': 'application/json',
                })
                .send({
                    server_count: guilds,
                })
                .end(response => {
                    bot.log(JSON.stringify(response.body));
                });

            unirest.post('https://discordbots.org/api/bots/stats')
                .headers({
                    Authorization: bot.config.dbotsorg,
                    'Content-Type': 'application/json',
                })
                .send({
                    server_count: guilds,
                })
                .end(response => {
                    bot.log(JSON.stringify(response.body));
                });

            unirest.post("boop")
                .headers({
                    Authorization: bot.config.bfd,
                })
                .send({
                    server_count: guilds,
                })
                .end(response => {
                    bot.log(JSON.stringify(response.body));
                });
        });

        bot.log('All server counts posted successfully!');
    };

    bot.syncServers = function() {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS servers (
					id VARCHAR(25) PRIMARY KEY, 
					prefix VARCHAR(10), 
					announcementChannel VARCHAR(25),
					welcomeMessagesEnabled BOOLEAN, 
					welcomeMessage VARCHAR(200), 
					leaveMessagesEnabled BOOLEAN, 
					leaveMessage VARCHAR(200),
					banMessagesEnabled BOOLEAN,
					banMessage VARCHAR(200),
					modLogs BOOLEAN,
					modLogChannel VARCHAR(25),
					joinRole VARCHAR(20),
					botRole VARCHAR(20), 
					inviteLinkDeletion BOOLEAN,
					mentionSpamProtection BOOLEAN,
					givemeRoles BLOB)`);
            bot.guilds.forEach(guild => {
                try {
                    // console.log(`Inserting ${guild.name} into the database.`);
                    if (guild.channels.array() && guild.channels.array()[0]) {
                        db.run(`INSERT OR IGNORE INTO servers VALUES (
								"${guild.id}", 
								"${config.prefix}", 
								"${guild.channels.array()[0].id}",
								0, 
								"Welcome {user:username} to the server!",
								0, 
								"{user:username} left the server 😢",
								0,
								"{user:username} was banned from the server 🔨",
								0,
								"${guild.channels.array()[0].id}",
								"none", 
								"none", 
								0,
								0,
								"")`);
                    } else {
                        db.run(`INSERT OR IGNORE INTO "servers" VALUES (
                            "${guild.id}",
                            "${config.prefix}",
                            "none",
                            0,
                            "Welcome {user:username} to the server!",
                            0,
                            "{user:username} left the server 😢",
                            0,
                            "{user:username} was banned from the server 🔨",
                            0,
                            "none",
                            "none",
                            "none",
                            0,
                            0,
                            "")`);
                    }
                } catch (err) {
                    console.log(err.stack);
                }
            });
        });
        bot.log('Servers synced.');
    };

    bot.removeServer = function(guild) {
        db.run(`DELETE FROM servers WHERE id = ${guild.id}`);
        bot.log(guild.name + ' successfully removed from the database!');
    };

    bot.addServer = function(guild) {
        db.run(`INSERT OR IGNORE INTO servers VALUES (
				"${guild.id}", 
				"${bot.config.prefix}", 
				"${guild.channels.array()[0].id}", 
				0, 
				"Welcome {user:username} to the server!", 
				0, 
				"{user:username} left the server 😢",
				0,
				"{user:username} was banned from the server 🔨",
				0,
				"${guild.channels.array()[0].id}",
				"none", 
				"none", 
				0,
				0,
				"")`);
        bot.log(guild.name + ' successfully inserted into the database!');
    };

    bot.checkForUpvote = function(msg) {
        return new Promise(resolve => {
            unirest.get(`https://discordbots.org/api/bots/${bot.user.id}/votes`)
                .headers({
                    Authorization: bot.config.dbotsorg,
                })
                .end(result => {
                    console.log(result.body);
                    var voters = result.body;
                    for (var i = 0; i < voters.length; i++) {
                        if (voters[i].id === msg.author.id) { resolve(true); }
                    }
                    if (msg.author.id === bot.config.owner) resolve(true);
                    if (msg.guild.members.get(bot.config.owner) && msg.guild.members.get(bot.config.owner).hasPermission('MANAGE_MESSAGES')) resolve(true);
                    resolve(false);
                    // Set to false on Stable
                });
        });
    };

    bot.promptForUpvote = function(msg, command) {
        msg.channel.send(`To use the **${command}** command, please go upvote me on discordbots.org! ` +
            `You can do so by visiting the link below, signing in, and clicking upvote! ` +
            `If you have already upvoted, give the bot a few minutes to update its list of voters.\n` +
            `https://discordbots.org/bot/${bot.user.id}`);
    };

    /**
     * Giveme Roles Functions
     */

    bot.setGivemeRoles = function(roles, guild) {
        roles = roles.join(',');
        db.run(`UPDATE servers SET givemeRoles = "${roles}" WHERE id = ${guild.id}`);
        return roles;
    };

    bot.getGivemeRoles = function(guild) {
        return new Promise(
            (resolve, reject) => {
                db.all(`SELECT * FROM servers WHERE id = "${guild.id}"`, (err, rows) => {
                    if (err || !rows[0]) reject(err);
                    else resolve(rows[0].givemeRoles);
                });
            }
        );
    };

    /**
     * Prefix Related Functions
     */

    bot.getPrefix = function(msg) {
        return new Promise(
            (resolve, reject) => {
                db.all(`SELECT * FROM servers WHERE id = "${msg.guild.id}"`, (err, rows) => {
                    if (err || !rows[0]) reject(err);
                    else resolve(rows[0].prefix);
                });
            }
        );
    };

    bot.setPrefix = function(prefix, guild) {
        db.run('UPDATE servers SET prefix = "' + prefix + '" WHERE id = ' + guild.id);
        return prefix;
    };

    /**
     * Server Settings Related Functions
     */

    bot.setNewValue = function(setting, id, text) {
        db.run(`UPDATE servers SET ${setting} = "${text}" WHERE id = "${id}"`);
        return text;
    };

    bot.setNewBoolValue = function(setting, id, text) {
        db.run(`UPDATE servers SET ${setting} = ${text} WHERE id = "${id}"`);
        return text;
    };

    bot.getCurrentBooleanSetting = function(setting, id) {
        return new Promise(resolve => {
            db.all('SELECT * FROM servers WHERE id = ' + id, (err, rows) => {
                if (err) throw err;
                resolve(rows[0][setting]);
            });
        });
    };

    bot.getCurrentSetting = function(setting, id) {
        return new Promise(resolve => {
            db.all('SELECT * FROM servers WHERE id = ' + id, (err, rows) => {
                if (err) throw err;
                resolve(rows[0][setting]);
            });
        });
    };

    bot.getAllSettings = function(id) {
        return new Promise(resolve => {
            db.all('SELECT * FROM servers WHERE id = ' + id, (err, rows) => {
                if (err) throw err;
                resolve(rows[0]);
            });
        });
    };

    /**
	 * Core message processing functions
	 */

    // Implement categories of commands and check this based on those
    bot.enabled = function(command, guild) {
        if (command || guild) {
            return true;
        } else {
            return false;
        }
    };

    bot.permLevel = function(msg) {
        if (msg.author.id === bot.config.owner) {
            return 6;
        } else if (msg.author.id === msg.guild.owner.id) {
            return 5;
        } else if (msg.member.hasPermission('MANAGE_GUILD')) {
            return 4;
        } else if (msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            return 3;
        } else if (msg.member.hasPermission('MANAGE_MESSAGES')) {
            return 2;
        } else if (!bot.blacklist(msg.author.id)) {
            return 1;
        } else {
            return 0;
        }
    };

    bot.processMessage = function(msg) {
        if (channel && msg.channel.id === channel) bot.log(msg.guild.name + ' | ' + msg.channel.name + ' | ' + msg.member.displayName + ' | ' + msg.cleanContent);

        if (msg.author.bot) return;

        afkJson = fs.readFileSync('./afk.json');
        afk = JSON.parse(afkJson);
        if (afk.length !== 0) {
            for (let i = 0; i < afk.length; i++) {
                if (afk[i].id === msg.author.id) {
                    afk.splice(i, 1);
                    fs.writeFileSync('./afk.json', JSON.stringify(afk, null, 3));
                    msg.channel.send(':ok_hand: Welcome back **' + msg.author.username + "**! I've removed your AFK status!")
                        .then(msg2 => {
                            setTimeout(() => {
                                msg2.delete();
                            }, 20000);
                        });
                }
                if (msg.mentions.users.size > 0 && afk.length !== 0) {
                    if (msg.content.indexOf(afk[i].id) !== -1 && msg.author.id !== afk[i].id) {
                        var nick = msg.guild.members.get(afk[i].id).displayName;
                        msg.channel.send({
                            embed: new Discord.RichEmbed().setDescription(':robot: **' + nick + '** is AFK: **' + afk[i].reason + '**'),
                        })
                            .then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete();
                                }, 20000);
                            });
                    }
                }
            }
        }

        if (msg.content.match(invitelink) && this.permLevel(msg) < 2) {
            this.getCurrentBooleanSetting('inviteLinkDeletion', msg.guild.id).then(setting => {
                if (setting && msg.deletable) {
                    msg.delete().then(() => {
                        msg.reply('this server does not allow invite links! :no_entry_sign:');
                    });
                } else if (setting && !msg.deletable) {
                    msg.guild.owner.send('I tried to delete an invite link in your server, but do not have permissions to!');
                }
            });
        }

        if (msg.mentions.users.array().length > 4) {
            this.getCurrentBooleanSetting('mentionSpamProtection', msg.guild.id).then(setting => {
                if (setting && msg.deletable) {
                    msg.delete().then(() => {
                        msg.reply("don't mention more than 4 people at once! :no_entry_sign:");
                    });
                } else if (setting && !msg.deletable) {
                    msg.guild.owner.send('I tried to delete some mention spam in your server, but do not have permissions to!');
                }
            });
        }

        if (msg.isMentioned(bot.user)) {
            if (msg.content.toLowerCase().includes('resetprefix') && msg.member.hasPermission('ADMINISTRATOR')) {
                bot.setPrefix(bot.config.prefix, msg.guild);
                msg.reply('I have reset this server\'s prefix to ``' + bot.config.prefix + '``!');
            } else if (msg.content.toLowerCase().includes('prefix')) {
                bot.getPrefix(msg).then(prefix => {
                    msg.reply('my prefix for this server is `' + prefix + '`!');
                });
            }

            if (msg.content.toLowerCase().includes('help')) {
                msg.content = '%help';
                msg.args = ['%help'];
                bot.commands.get('help').main(bot, msg);
            }
        }

        this.getPrefix(msg).then(prefix => {
            if (msg.content.startsWith(prefix)) {
                try {
                    msg.prefix = prefix;
                    msg.args = msg.content.split(/\s+/g);
                    msg.content = msg.content.substring(msg.content.indexOf(' ') + 1, msg.content.length) || null;
                    var command = msg.args.shift().slice(prefix.length).toLowerCase();
                    var cmd = bot.commands.get(command);
                    // || bot.commands.get(bot.aliases.get(command))
                    var perms = bot.permLevel(msg);

                    if (!cmd) {
                        return;
                    } else if (perms === 0) {
                        msg.reply('you are blacklisted from using the bot!');
                    } else if (perms < cmd.permission) {
                        msg.reply('you do not have permission to do this!');
                    } else if (bot.enabled(cmd)) {
                        bot.logCommand(command, msg.content, msg.author.username, msg.channel.name, msg.guild.name);
                        try {
                            cmd.main(bot, msg);
                        } catch (err) {
                            msg.channel.send('Oh no! We encountered an error:\n```' + err.stack + '```');
                        }
                    }
                } catch (err) {
                    msg.channel.send('Oh no! We encountered an error:\n```' + err.stack + '```');
                    bot.error(err.stack);
                }
            }
        });
    };

    /**
	 * Core bot functions
	 */

    bot.send = function(channel2, text) {
        var color = channel2.guild.me.displayHexColor || '#ffb200';
        channel2.send(new Discord.RichEmbed().setColor(color).setDescription(text)
            .setFooter(bot.user.username, bot.user.avatarURL));
    };

    bot.blacklist = function(id) {
        var blacklistJson = fs.readFileSync('./blacklist.json'),
            blacklist = JSON.parse(blacklistJson);
        for (var i = 0; i < blacklist.length; i++) {
            if (blacklist[i] === id) { return true; }
        }
        return false;
    };

    bot.startGameCycle = function() {
        bot.fetchGuildSize().then(guilds => {
            bot.user.setActivity(`${guilds} Servers | ${config.prefix}help`, { type: 'watching' });
            setInterval(() => {
                });
            }, 300000);
    };

    bot.awaitConsoleInput = function() {
        stdin.addListener('data', d => {
            d = d.toString().trim();
            if (d.startsWith('channels')) {
                bot.channels.forEach(channel2 => {
                    if (channel2.type === 'text' && channel2.permissionsFor(channel2.guild.me).has(['READ_MESSAGES', 'SEND_MESSAGES'])) { bot.log(channel2.guild.name + ' | #' + channel2.name + ' | (' + channel2.id + ')'); }
                });
            } else if (d.startsWith('bind') && channel) {
                d = d.substring(d.indexOf(' ') + 1, d.length);
                if (bot.channels.get(d)) {
                    channel = d;
                    bot.log('Console rebound to channel ' + bot.channels.get(d).name + ' in ' + bot.channels.get(d).guild.name + '!');
                }
            } else if (channel) {
                try {
                    bot.channels.get(channel).send(d);
                } catch (err) {
                    bot.log(err);
                }
            } else if (bot.channels.get(d)) {
                channel = d;
                bot.log('Console bound to channel ' + bot.channels.get(d).name + ' in ' + bot.channels.get(d).guild.name + '!');
            }
        });
    };

    bot.webhook = function(header, text, color) {
        var request = require('request');
        try {
            var d = {
                attachments: [{
                    color: color,
                    fields: [{
                        title: header,
                        value: text,
                    }],
                    ts: new Date() / 1000,
                }],
            };
            if (config.webhook) {
                request({
                    url: config.webhook + '/slack',
                    method: 'POST',
                    body: d,
                    json: true,
                });
            }
        } catch (err) {
            bot.error(err);
        }
    };

    bot.joinleavehook = function(type, guild) {
        var request = require('request');
        bot.fetchGuildSize().then(guilds => {
            try {
                if (type === 'join') {
                    var color = '#FFB200';
                    var title = ':inbox_tray: New Guild! | Now in ' + guilds + ' guilds.';
                } else if (type === 'leave') {
                    color = '#FF0000';
                    title = ':outbox_tray: Left Guild | Now in ' + guilds + ' guilds.';
                }

                var members = 0,
                    bots = 0;
                guild.members.forEach(member => {
                    if (member.user.bot) {
                        bots++;
                    } else {
                        members++;
                    }
                });

                var d = {
                    attachments: [{
                        color: color,
                        title: title,
                        thumb_url: guild.iconURL,
                        fields: [{
                            title: 'Server Name',
                            value: guild.name,
                            short: true,
                        }, {
                            title: 'Created',
                            value: guild.createdAt.toLocaleString(),
                            short: true,
                        }, {
                            title: 'ID',
                            value: guild.id,
                            short: true,
                        }, {
                            title: 'Owner',
                            value: guild.owner.user.username,
                            short: true,
                        }, {
                            title: 'Member Count',
                            value: members,
                            short: true,
                        }, {
                            title: 'Bot Count',
                            value: bots,
                            short: true,
                        }],
                        footer: bot.user.username,
                        ts: new Date() / 1000,
                    }],
                };

                if (guild.features[0]) {
                    d.attachments[0].fields.push({
                        title: 'Features',
                        value: guild.features.join('\n'),
                    });
                    d.attachments[0].text = 'Partnered Server';

                    if (guild.features.includes('INVITE_SPLASH')) { d.attachments[0].image_url = guild.splashURL + '?size=2048'; }
                }
                if (config.logwebhook) {
                    request({
                        url: config.logwebhook + '/slack',
                        method: 'POST',
                        body: d,
                        json: true,
                    });
                }
            } catch (err) {
                bot.error(err);
            }
        });
    };

    /**
	 * Logging functions
	 */

    bot.logCommand = function(command, arguments, user, channel2, server) {
        bot.webhook('Command Executed', `**Command:** ${command}\n**User:** ${user}\n**Arguments:** ${arguments}\n**Server:** ${server}\n**Channel:** #${channel2}`, '#0000FF');
    };

    bot.error = function(err) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [ERROR] | ' + err.stack);
            bot.webhook('ERROR', '[SHARD ' + bot.shard.id + '] [ERROR] | ' + err.stack, '#FF0000');
        } else {
            console.log(this.timestamp() + ' [ERROR] | ' + err.stack);
            bot.webhook('ERROR', '[ERROR] | ' + err.stack, '#FF0000');
        }
    };

    bot.debug = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [DEBUG] | ' + txt);
        } else {
            console.log(this.timestamp() + ' [DEBUG] | ' + txt);
        }
    };

    bot.warn = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + '] [WARN]  | ' + txt);
            bot.webhook('Warning', ' [SHARD ' + bot.shard.id + '] [WARN]  | ' + txt, '#FFFF00');
        } else {
            console.log(this.timestamp() + ' [WARN]  | ' + txt);
            bot.webhook('Warning', '[WARN]  | ' + txt, '#FFFF00');
        }
    };

    bot.log = function(txt) {
        if (bot.shard) {
            console.log(this.timestamp() + ' [SHARD ' + bot.shard.id + ']  [LOG]  | ' + txt);
            bot.webhook('Log', '[SHARD ' + bot.shard.id + '] ' + txt, '#000000');
        } else {
            console.log(this.timestamp() + '  [LOG]  | ' + txt);
            bot.webhook('Log', txt, '#000000');
        }
    };

    bot.timestamp = function() {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds();
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }
        return '[' + hours + ':' + minutes + ':' + seconds + ']';
    };

    /**
	 * Utility functions for information retrieval
	 */

    bot.displayServer = function(msg, serverID) {
        db.run(`SELECT * FROM servers WHERE id = ${serverID}`, (err, row) => {
            if (err) {
                msg.channel.send(err);
            } else {
                msg.channel.send(JSON.stringify(row));
            }
        });
    };
};
