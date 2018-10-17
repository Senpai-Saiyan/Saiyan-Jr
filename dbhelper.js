var config = require('./config.json'),
    Discord = require('discord.js'),
    bot = new Discord.Client();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./servers.sqlite');

bot.on('ready', () => {
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
            console.log(`Inserting ${guild.name} into the database.`);
            if (guild.channels.array() && guild.channels.array()[0]) {
                db.run(`INSERT OR IGNORE INTO servers VALUES (
						"${guild.id}", 
						"${config.prefix}", 
						"${guild.channels.array()[0].id}", 
						0, 
						"Welcome {user:username} to the server!", 
						0, 
						"{user:username} left the server :cry:",
						0,
						"{user:username} was banned from the server :hammer:",
						0,
						"${guild.channels.array()[0].id}",
						"none", 
						"none", 
						0,
						0,
						"")`);
            } else {
                db.run(`INSERT OR IGNORE INTO servers VALUES (
                                                "${guild.id}",
                                                "${config.prefix}",
                                                "none",
                                                0,
                                                "Welcome {user:username} to the server!",
                                                0,
                                                "{user:username} left the server :cry:",
                                                0,
                                                "{user:username} was banned from the server :hammer:",
                                                0,
                                                "none",
                                                "none",
                                                "none",
                                                0,
                                                0,
                                                "")`);
            }
        });
    });
    console.log('Servers synced.');
});

bot.login(config.token)
;
