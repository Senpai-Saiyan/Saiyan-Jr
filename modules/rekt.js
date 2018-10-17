module.exports = {
    name: 'rekt',
    type: 'images',
    usage: 'rekt',
    permission: 1,
    help: 'Yer mum',
    main: function(bot, msg) {
msg.channel.send("Vegeta rekts Black", {
    file: "https://cdn.glitch.com/100fa598-3afb-45d2-857b-b66b044c2a0e%2Fc8f9935f575b4c91d40970d1a0d57222b23c782a_hq.gif" // Or replace with FileOptions object
});

        }
    };
