const Discord = require('discord.js');
const discordInfo = require('./config.json');

//const hook = new Discord.WebhookClient(discordInfo.webhook, discordInfo.token);
// Permissions= 80960

const client = new Discord.Client();
var channels = {'760244271218688046':1, '759872556659376129': 0};
var Meta = require('html-metadata-parser');
var regex_cloud = new RegExp(/(azure|aws|gcp|google cloud)/);
var regex_cloud_specific_aws = new RegExp(/(aws|lambda)/);
var regex_cloud_specific_azure = new RegExp(/(azure|cosmosdb)/);
var reaction_categories = {1: '☁️', 11: '📘'};

var log_metadata = function(link, title, description, image){
	if(image == undefined) image = false;
	var title1 = title.toLowerCase();
	var description1 = description.toLowerCase();
	var return_msg = [];
	if(title1.match(regex_cloud) || description1.match(regex_cloud)){
		if(title1.match(regex_cloud_specific_azure) || description1.match(regex_cloud_specific_azure))
			return_msg.push(11);
		return_msg.push(1);
	}

	// After basic categorisation - send link plus title, description and image to DB
	// insert code here
	// Return categorisation to handle the reaction
	return return_msg;
};

client.on("message", function(message) { 
 	if (message.author.bot) return;  
 	if(channels[message.channel.id] != undefined && channels[message.channel.id] == 1){
 		if (message.content.match(/http(s|):\/\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]+/) == null) return;
 		//message.reply('You just pasted this link!: '+ message.content.match(/http(s|):\/\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]+/)[0]);
 		message.react('💯');
 		message.reply('Thanks for sharing, please keep feeding this channel with geeky news');
 		var category = 0;
 		Meta.parser(message.content.match(/http(s|):\/\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]+/)[0], function (err, result) {
			if(Object.keys(result.meta).length > 0){
				//Meta tags are found in the page, otherwise it might be a file 
				if(result['og'] != undefined)
			 		category = log_metadata('', result['og']['title'], result['og']['description'], (result['og']['image'] != undefined ? result['og']['image'] : false));
		 	 	else if(result['meta'] != undefined) 
					category = log_metadata('', result['meta']['title'],result['meta']['description']);
				if(category !== 0){
					for (var i = 0; i < category.length; i++) {
						if(reaction_categories[category[i]] != undefined)
							message.react(reaction_categories[category[i]]);
					}
				}
			}
		})
 	}
});



client.login(discordInfo.token);

var forfun = "              _______\n\
         ..-'`       ````---.\n\
       .'          ___ .'````.'SS'.\n\
      /        ..-SS####'.  /SSHH##'.\n\
     |       .'SSSHHHH##|/#/#HH#H####'.\n\
    /      .'SSHHHHH####/||#/: \\SHH#####\\\n\
   /      /SSHHHHH#####/!||;`___|SSHH###\\\n\
-..__    /SSSHHH######.         \\SSSHH###\\\n\
`.'-.''--._SHHH#####.'           '.SH####/\n\
  '. ``'-  '/SH####`/_             `|H##/\n\
  | '.     /SSHH###|`'==.       .=='/\\H|\n\
  |   `'-.|SHHHH##/\\__\\/        /\\//|~|/\n\
  |    |S#|/HHH##/             |``  |\n\
  |    \\H' |H#.'`              \\    |\n\
  |        ''`|               -     /\n\
  |          /H\\          .----    /\n\
  |         |H#/'.           `    /\n\
  |          \\| | '..            /\n\
  |    ^~DLF   /|    ''..______.'\n\
   \\          //\\__    _..-. | \n\
    \\         ||   ````     \\ |_\n\
     \\    _.-|               \\| |_\n\
     _\\_.-'   `'''''-.        |   `--.\n\
 ''``    \\            `''-;    \\ /\n\
          \\      .-'|     ````.' -\n\
          |    .'  `--'''''-.. |/\n\
          |  .'               \\|\n\
          |.'";
console.log('Link is running');
console.log(forfun);