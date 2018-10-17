module.exports = {
    name: 'final',
    type: 'images',
    usage: 'final',
    permission: 1,
    help: 'Final Flash',
    main: function(bot, msg) {
msg.channel.send("FINAL FLASH!", {
    file: "https://cdn.glitch.com/100fa598-3afb-45d2-857b-b66b044c2a0e%2Fa95ee0aab2a9d31da17dfbedc9da235fe5614166_hq.gif" // Or replace with FileOptions object
});

        }
    };
