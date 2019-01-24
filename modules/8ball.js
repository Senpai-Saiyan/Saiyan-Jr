module.exports = {
    name: '8ball',
    type: 'fun',
    usage: '8ball',
    permission: 1,
    help: 'Simulates an 8ball.',
    main: function(bot, msg) {
        var predictions = [
            'It is certain',
            'The moon says it is so',
            'Without a doubt',
            'Yes definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Chances are high',
            'Yes',
            'Signs point to hell no',
            'fuck you I am busy',
            'Ask your mother',
            'Oh. Oh. Oh. You have my condolences.',
            'Cannot predict now',
            'what was the question again?',
            "Not in a million years",
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful',
            'the hell kinda question is that? GTFO!',
          'Maybe',
          'No. Hell No. Nope. Sorry guy.'
        ];
        msg.reply(predictions[Math.floor(Math.random() * (predictions.length - 0))]);
    },
};
