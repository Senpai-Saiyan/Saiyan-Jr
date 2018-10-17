module.exports = {
    name: 'take',
    type: 'moderation',
    usage: 'take <user> <role>',
    permission: 3,
    help: 'Takes a user\'s role from them',
    main: function(bot, msg) {
        if (!msg.member.hasPermission('MANAGE_ROLES_OR_PERMISSIONS') && !msg.member.hasPermission('ADMINISTRATOR')) {
            return msg.channel.send(':x: You do not have the necessary permissions to perform this action!');
        }
        if (!msg.guild.members.get(bot.user.id).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
            return msg.channel.send(":x: I can't assign or deassign roles in this server!");
        }

        var user = msg.mentions.users.array()[0],
            roleToTake = msg.content.split(' ').splice(1).join(' ')
                .trim();
        let role = msg.guild.roles.find('name', roleToTake);

        if (!role) {
            return msg.channel.send(':x: Role does not exist!');
        }
        if (msg.guild.members.get(bot.user.id).highestRole.comparePositionTo(role) < 1) {
            return msg.channel.send(':x: I don\'t have permissions to edit this role, please check the role order!');
        }
        if (msg.member.highestRole.comparePositionTo(role) < 1) {
            return msg.channel.send(':x: Your highest role is lower than this role, so you cannot deassign it!');
        }

        msg.guild.members.get(user.id).removeRole(role).then(m => {
            if (!m.roles.has(role.id)) {
                msg.channel.send('Successfully removed role *' + roleToTake + '* from ' + user + '.');
            } else {
                msg.channel.send('Failed to remove role *' + roleToTake + '* from ' + user + '.');
            }
        })
            .catch(console.error);
        return null;
    },
};
