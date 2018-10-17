const Discord = require("discord.js"); //Bibliothèque Javascript de Discord

var fs = require("fs");

const PREFIX = "::";	//Ce qu'il y a au début de la commande, exemple ici : "-:ping"
const PREFIXCOMMAND = "&";
const PREFIX_SOUND = "mak.";

var bot = new Discord.Client(); // C'est pour dire que le bot est comme un utilisateur au serveur (normalement c'est ça, je sais plus, mais c'est obligatoire en gros, cherche pas xD)

var file = "";
var helpmsg = "";


//ecrit dans la console quand le bot est pret
bot.on("ready", function () {
    console.log("Ready")
	bot.user.setStatus("online");
})


bot.on("message", function (message) {
    
	
	if (message.content.startsWith(PREFIXCOMMAND)){
		var args = message.content.substring(PREFIXCOMMAND.length).split(" ");
		
		const emojiList = bot.emojis.map(e=>e.toString()).join("#");
		var ListEmoji = emojiList.split("#");			
		var pageTot = Math.floor(ListEmoji.length / 25);
		
		switch (args[0].toLowerCase()) {		//commands with // prefix	
			case "plshelpIreallyneedtopee":
				if (!args[1])
				{
					message.channel.send("List of commands : `&random`, `&list`, `&large`");
					message.channel.send("Normal Usage : `::[name of the emoji]`	(example : `::citron`)")
					return;
				}
				else if (args[1] == "random" || args[1] == "//random")
				{
					message.channel.send("`//random`, post a random emoji")
				}
				else if (args[1] == "list" || args[1] == "//list")
				{
					message.channel.send("`//list [n° of the page]`, Show a list of the emoji")
				}
				else if (args[1] == "large" || args[1] == "//large")
				{
					message.channel.send("`//large [name of the emoji]`, Show a largest version of the emoji")
				}
				break
			case "random":
				randemo = Math.floor((Math.random() * ListEmoji.length));
				message.delete();
				message.channel.send(ListEmoji[randemo]);
				break
			
			case "list":
				if (!args[1]) currentPage = 0;
				else currentPage = args[1] - 1; //check if int
				if (currentPage > pageTot){
					message.channel.send("Page not found");
					return;
				}
				message.delete();
				const embed = new Discord.RichEmbed()
				var limit = 24 + (24 * currentPage);
				if(ListEmoji.length - (25 * currentPage) < 25) limit = ListEmoji.length;
					for(var i=(24 * currentPage);i<limit; i++){	
						var testemoji = ListEmoji[i];
						embed.addField(testemoji,
							ListEmoji[i+1], true)
						i++
					}
				message.channel.send({ embed});
				message.channel.send("Page " + (currentPage + 1) + " / " + (pageTot + 1));
				break
			
			case "large":
				if (!args[1]) {
					message.channel.send("No emoji specified");
					return;
				}
				else
				{
					var large = bot.emojis.findKey("name", args[1]);
					if (large != null)
					{
						message.delete();
						message.channel.send("https://cdn.discordapp.com/emojis/" + large + ".png");
					}
					else
					{
						message.channel.send("Emoji not found");
					}
				}
				break
		}
	}
	
	
	
	if (!message.guild) return;
	if (message.content.toLowerCase().startsWith(PREFIX_SOUND)){
		
		var args = message.content.substring(PREFIX_SOUND.length).split(" ");

		if (args[0] == "help"){
			message.channel.send(helpmsg);
		}
		else if (message.guild.voiceConnection){
			return;
		}
		else {
			split = helpmsg.split("	");
			search = split.find(function(str) {
									return str == args[0];
								});
			if (search != undefined){
				if (message.member.voiceChannel) {
					message.member.voiceChannel.join()
					.then(connection => { // Connection is an instance of VoiceConnection
						message.delete();
						const dispatcher = connection.playFile('MP3/'+args[0]+'.wav');
						dispatcher.on('end', () => message.member.voiceChannel.leave());
					})
				.catch(console.log);
				} else {
					message.reply('You need to join a voice channel first!');
				}
			}
		}
	}
	
	

    //Si ne commence pas par le PREFIX, ignore
    if (!message.content.startsWith(PREFIX)) return;

    //sépare les mots de la phrase (ne compte pas le PREFIX)
    var args = message.content.substring(PREFIX.length).split(" ");

	const emoji = bot.emojis.find("name", args[0]);
	if (emoji != null){
		message.delete();
		message.channel.send(`${emoji}`);
	}
});
//connecte le bon bot.
bot.login(process.env.BOT_TOKEN)
