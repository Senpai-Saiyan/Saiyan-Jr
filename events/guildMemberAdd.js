var Discord = require('discord.js');

exports.run = (bot, member) => {
    bot.getCurrentSetting('welcomeMessagesEnabled', member.guild.id).then(res => {
        if (res === 1) {
            bot.getCurrentSetting('welcomeMessage', member.guild.id).then(text => {
                var welcome = new Discord.RichEmbed()
                    .setAuthor(member.user.username, member.user.avatarURL)
                    .setFooter(member.guild.name)
                    .setTimestamp()
                    .setColor('#00FF00');
                text = text.replace('{server:name}', member.guild.name)
                    .replace('{server:membercount}', member.guild.members.size)
                    .replace('{user:mention}', member.user)
                    .replace('{user:username}', member.user.username)
                    .replace('{user:discrim}', member.user.discriminator);
                welcome.addField('User Joined', text);
                bot.getCurrentSetting('announcementChannel', member.guild.id).then(id => {
                    member.guild.channels.get(id).send({
                        embed: welcome,
                    });
                });
            });
        }
    });

    if (member.user.bot) {
        bot.getCurrentSetting('botRole', member.guild.id).then(setting => {
            if (setting === 'none') return;
            var role = member.guild.roles.get(setting);
            if (role && role.comparePositionTo(member.guild.me.highestRole) < 0) {
                member.addRole(role);
            } else {
                member.guild.owner.send('Your bot role has either been deleted, or is otherwise invalid. Please fix it so it can continue working as intended!');
            }
        });
    } else {
        bot.getCurrentSetting('joinRole', member.guild.id).then(setting => {
            if (setting === 'none') return;
            var role = member.guild.roles.get(setting);
            if (role && role.comparePositionTo(member.guild.me.highestRole) < 0) {
                member.addRole(role);
            } else {
                member.guild.owner.send('Your member role has either been deleted, or is otherwise invalid. Please fix it so it can continue working as intended!');
            }
        });
    }
};
