module.exports = {
    name: 'giveme',
    type: 'utility',
    usage: 'giveme <rolename>',
    permission: 1,
    help: 'Gives the user a specified role from an allowed list.',
    main: async function(bot, msg) {
        var Discord = require('discord.js');
        try {
            bot.getGivemeRoles(msg.guild).then(roles => {
                var allowedRoles = roles.split(',');
                if (allowedRoles[0] === '' || roles === '' || !allowedRoles[0]) {
                    allowedRoles = [];
                }
                var cmd = msg.content.split(' ')[0];

                console.log(allowedRoles[0]);

                if (cmd === 'list' | cmd === '-l' || cmd === null) {
                    var list = '';
                    for (var i = 0; i < allowedRoles.length; i++) {
                        list += allowedRoles[i] + '\n';
                    }
                    msg.channel.send({
                        embed: new Discord.RichEmbed().setColor('#0000FF').setTimestamp()
                            .setFooter(bot.user.username)
                            .addField('Roles avaliable to self assign', list),
                    });
                } else if (cmd === 'add') {
                    if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.reply("you do not have permission to manage this server's giveme setings!");
                    var roleToAdd = msg.content.split(' ');
                    roleToAdd.shift();
                    roleToAdd = roleToAdd.join(' ').trim();
                    console.log(roleToAdd);

                    if (msg.guild.roles.find('name', roleToAdd)) {
                        allowedRoles.push(roleToAdd);
                        bot.setGivemeRoles(allowedRoles, msg.guild);
                        msg.channel.send('Successfully added the role to the database!');
                    } else {
                        msg.channel.send('Could not find that role in this server!');
                    }
                } else if (cmd === 'remove') {
                    if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.reply("you do not have permission to manage this server's giveme setings!");
                    var role = msg.content.split(' ');
                    role.shift();
                    role = role.join(' ').trim();
                    console.log(role);
                    if (allowedRoles[0] && allowedRoles.indexOf(role) > -1) {
                        allowedRoles.splice(allowedRoles.indexOf(role), 1);
                        bot.setGivemeRoles(allowedRoles, msg.guild);
                        msg.channel.send('Successfully removed the role `' + role + '` from the list!');
                    } else {
                        msg.channel.send('Could not remove this role from the giveme list!');
                    }
                } else if (cmd === 'take') {
                    if (!allowedRoles[0]) return msg.channel.send('This server does not have any giveme roles setup!');

                    var taken = '';
                    var takenCount = 0;
                    var notFoundCount = 0;
                    roles = [];

                    var rolesToRemove = msg.content.split(' ');
                    rolesToRemove.shift();
                    msg.content = rolesToRemove.join(' ').trim();

                    if (msg.content.indexOf(',') > -1) {
                        roles = msg.content.split(',');
                    } else if (msg.content !== null) {
                        roles[0] = msg.content;
                    }

                    for (i = 0; i < roles.length; i++) {
                        var found = false;
                        for (var j = 0; j < allowedRoles.length; j++) {
                            if (allowedRoles[j].toLowerCase() === roles[i].trim().toLowerCase()) {
                                console.log('Found ' + roles[i] + ' ' + allowedRoles[j]);
                                found = true;
                                role = msg.guild.roles.find('name', allowedRoles[j]);
                                var member = msg.member;
                                if (member.roles.has(role.id)) {
                                    member.removeRole(role).catch(bot.error);
                                    taken += `${role.name} \n`;
                                    takenCount++;
                                }
                            }
                        }
                        if (!found) {
                            console.log('Could not find ' + roles[i]);
                            notFoundCount++;
                        }
                    }

                    var givemeEmbed = new Discord.RichEmbed()
                        .setFooter(bot.user.username)
                        .setTimestamp()
                        .setColor('#0000FF');
                    if (takenCount > 0) {
                        givemeEmbed.addField(`Successfully took ${takenCount} role(s) from you!`, taken);
                    }
                    if (notFoundCount > 0) {
                        givemeEmbed.addField(`Couldn't find ${notFoundCount} role(s)!`, `Try ${msg.prefix}giveme list to get a list of roles avaliable!`);
                    }

                    msg.channel.send({ embed: givemeEmbed });
                } else {
                    if (!allowedRoles[0]) return msg.channel.send('This server does not have any giveme roles setup!');

                    var assigned = '';
                    var assignedCount = 0;
                    var alreadyHad = '';
                    var alreadyHadCount = 0;
                    notFoundCount = 0;
                    roles = [];

                    if (msg.content.indexOf(',') > -1) {
                        roles = msg.content.split(',');
                    } else if (msg.content !== null) {
                        roles[0] = msg.content;
                    } else {
                        return msg.channel.send('Please specify either roles you want to self assign or an argument!');
                    }

                    console.log(roles[0]);

                    for (i = 0; i < roles.length; i++) {
                        found = false;
                        for (j = 0; j < allowedRoles.length; j++) {
                            if (allowedRoles[j].toLowerCase() === roles[i].trim().toLowerCase()) {
                                console.log('Found ' + roles[i] + ' ' + allowedRoles[j]);
                                found = true;
                                role = msg.guild.roles.find('name', allowedRoles[j]);
                                member = msg.member;
                                if (member.roles.has(role.id)) {
                                    alreadyHad += `${role.name} \n`;
                                    alreadyHadCount++;
                                } else {
                                    member.addRole(role).catch(bot.error);
                                    assigned += `${role.name} \n`;
                                    assignedCount++;
                                }
                            }
                        }
                        if (!found) {
                            console.log('Could not find ' + roles[i]);
                            notFoundCount++;
                        }
                    }

                    givemeEmbed = new Discord.RichEmbed()
                        .setFooter(bot.user.username)
                        .setTimestamp()
                        .setColor('#0000FF');
                    if (assignedCount > 0) {
                        givemeEmbed.addField(`Successfully gave you ${assignedCount} role(s)!`, assigned);
                    }
                    if (alreadyHadCount > 0) {
                        givemeEmbed.addField(`You already had ${alreadyHadCount} role(s)!`, alreadyHad);
                    }
                    if (notFoundCount > 0) {
                        givemeEmbed.addField(`Couldn't find ${notFoundCount} role(s)!`, `Try ${msg.prefix}giveme list to get a list of roles avaliable!`);
                    }

                    msg.channel.send({ embed: givemeEmbed });
                }
                return null;
            });
        } catch (err) {
            msg.channel.send(err);
        }
    },
};

