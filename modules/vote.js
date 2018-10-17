const { clearInterval } = require('timers');

module.exports = {
    name: 'vote',
    type: 'utility',
    usage: 'vote <question>',
    permission: 1,
    help: 'Creates a poll with two responses, yes or no.',
    main: function(bot, msg) {
        var yes = 0,
            no = 0,
            t = 60,
            responded = [],
            interval;
        msg.channel.send('A poll has been created! Question: ```' + msg.content + '```Answer with **yes** or **no.**\n')
            .then(msg2 => {
                msg2.channel.send('Time Remaining: **' + t + '**')
                    .then(timer => {
                        interval = setInterval(() => {
                            if (t >= 0) {
                                t -= 5;
                                timer.edit('Time Remaining: **' + t + '**');
                            }
                        }, 5000);
                    });

                const collector = msg.channel.createCollector(
                    m => m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'no',
                    { time: t * 1000 });
                collector.on('collect', m => {
                    if (m.content.toLowerCase() === 'yes' && responded.indexOf(m.author.id) < 0) {
                        responded.push(m.author.id);
                        yes++;
                    }
                    if (m.content.toLowerCase() === 'no' && responded.indexOf(m.author.id) < 0) {
                        responded.push(m.author.id);
                        no++;
                    }
                });
                collector.on('end', () => {
                    clearInterval(interval);
                    msg.channel.send('Voting is over! Tallying results...');
                    setTimeout(() => {
                        if (yes > no) {
                            msg.channel.send('**Yes** won with ' + yes + ' votes! No got ' + no + ' vote(s).');
                        } else if (yes < no) {
                            msg.channel.send('**No** won with ' + no + ' votes! Yes got ' + yes + ' vote(s).');
                        } else if (yes === no) {
                            msg.channel.send('**Yes** and **No** tied! Both got ' + yes + ' votes!');
                        }
                    }, 2000);
                });
            });
    },
};
