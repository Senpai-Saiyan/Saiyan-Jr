module.exports = {
    name: 'fight',
    type: 'fun',
    usage: '<p>fight <user>',
    permission: 1,
    help: 'Simulates a fight against another user.',
    main: function(bot, msg) {
        var responses = [
            ' Galic Gunned ',
            ' was fisted by ',
            ' was hit by a blast from ',
            ' was decked in the snoz by ',
            ' was sniffed by ',
            ' was kidney punched by ',
            ' was run over with a whale by ',
            ' had their bank account emptied by ',
            ' had a lewd object dropped on them by ',
            ' was beat up by ',
            ' was stabbed in the foot by ',
            ' lost all his money to ',
        ];
        var player1 = msg.author;
        var player2 = msg.mentions.users.array()[0];
        var hp1 = 1000;
        var hp2 = 1000;
        var damage = [100, 150, 200, 300, 50, 250];
        var turn1 = Math.random() > 0.5;
        var times = 0;

        if (player2.id === bot.user.id) {
            msg.channel.send(bot.user.username + ' **COMPLETELY AND UTTERLY DESTROYED** ' + player1.username + '! *[-999999 HP] [0 HP remaining]*');
            msg.channel.send("*Hint: Don't try to fight me! Nothing personnel, kid.*");
        } else if (player2.id === bot.config.owner) {
            msg.channel.send(player2.username + ' **COMPLETELY AND UTTERLY DESTROYED** ' + player1.username + '! *[-999999 HP] [0 HP remaining]*');
            msg.channel.send("*Hint: Don't try to fight " + player2.username + '! Nothing personnel, kid.*');
        } else if (player2 !== null) {
            while (hp1 > 0 && hp2 > 0) {
                times++;
                var i = Math.floor(Math.random() * responses.length);
                var x = Math.floor(Math.random() * damage.length);
                if (turn1 === true) {
                    hp2 -= damage[x];
                    sendMessage('**' + player2.username + '**' + responses[i] + '**' + player1.username + '**! *[-' + damage[x] + ' hp] [' + hp2 + ' HP remaining]*', times);
                    turn1 = false;
                } else {
                    hp1 -= damage[x];
                    sendMessage('**' + player1.username + '**' + responses[i] + '**' + player2.username + '**! *[-' + damage[x] + ' hp] [' + hp1 + ' HP remaining]*', times);
                    turn1 = true;
                }
            }

            if (hp1 <= 0) {
                sendMessage(player1 + ' lost! GG ' + player2 + '!', times);
            } else if (hp2 <= 0) {
                sendMessage(player2 + ' lost! GG ' + player1 + '!', times);
            }

            setTimeout(() => {
                msg.channel.fetchMessages({ limit: 100 })
                    .then(messages => {
                        var msgar = messages.array();
                        msgar = msgar.filter(msg2 => msg2.author.id === bot.user.id && msg2.content.includes('HP remaining'));
                        msgar.length = 20;
                        msgar.map(msg2 => msg2.delete().catch(console.error));
                    });
            }, (times * 1500) + 2000);
        } else {
            msg.reply('please mention someone!');
        }


        function sendMessage(content, times2) {
            setTimeout(() => {
                msg.channel.send(content);
            }, 1500 * times2);
        }
    },
};
