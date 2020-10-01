const Discord = require('discord.js');
const discordInfo = require('./config.json');

//const hook = new Discord.WebhookClient(discordInfo.webhook, discordInfo.token);
// Permissions= 80960

const client = new Discord.Client();
var channels = {'760244271218688046': 1, '759872556659376129': 1, '706519510680600587': 0};
var Meta = require('html-metadata-parser');
var giphy = require('giphy-api')(discordInfo.giphy_token);

//var GphApiClient = require('giphy-js-sdk-core');


var regex_cloud = new RegExp(/(azure|aws|gcp|google cloud)/);
var regex_cloud_specific_aws = new RegExp(/(aws|lambda)/);
var regex_cloud_specific_azure = new RegExp(/(azure|cosmosdb|azure VM|sentinel|mssql|logic apps|event hub|document db)/);
var regex_cloud_specific_gcp = new RegExp(/(google cloud|gcp|apigee|chronicle)/);
var reaction_categories = {1: '☁️', 11: '📘', 12: '📙', 13: '📗'};

var log_metadata = function(link, title, description, image){
	if(image == undefined) image = false;
	var title1 = title.toLowerCase();
	var description1 = description.toLowerCase();
	var return_msg = [];
	if(title1.match(regex_cloud) || description1.match(regex_cloud)){
		return_msg.push(1);
		if(title1.match(regex_cloud_specific_azure) || description1.match(regex_cloud_specific_azure))
			return_msg.push(11);
		if(title1.match(regex_cloud_specific_aws) || description1.match(regex_cloud_specific_aws))
			return_msg.push(12);
		if(title1.match(regex_cloud_specific_gcp) || description1.match(regex_cloud_specific_gcp))
			return_msg.push(13);
	}

	// After basic categorisation - send link plus title, description and image to DB
	// insert code here
	// Return categorisation to handle the reaction
	return return_msg;
};



client.on("message", function(message) { 

 	if (message.author.bot) return;  
 	if(channels[message.channel.id] != undefined && channels[message.channel.id] == 1){
 		if(message.content.startsWith("/")){
 			var search_keywords = message.content.split("/").slice(1).join(" ");
 			random_gif(search_keywords, message);
 		}

 		if (message.content.match(/[t]+[h]+[e]+(\s+|)[b]+[o]+[iy]+[z]+/i)){
 			var boifrom = boiz_flags(message.author.username);
 			random_gif('The Boys', message, "BOIZ "+boifrom);
 			return;
		} 		

 		if (message.content.match(/http(s|):\/\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]+/) == null) return;
		
 		//message.reply('You just pasted this link!: '+ message.content.match(/http(s|):\/\/[a-zA-Z0-9-._~:\/?#\[\]@!$&'()*+,;=]+/)[0]);
 		message.react('💯');
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
			} else {

			}
			message.reply('Thanks for sharing, please keep feeding this channel with geeky news');
		});
		
 	}
});


client.login(discordInfo.token);


/*For fun functions */


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


var boiz_flags = function(sender){
	switch(sender){
		case 'c4rl0s':
			return ':flag_co:';
		break;
		case '3rag0n':
			return ':flag_pt:';
		break;
		case 'Ant D':
			return ':flag_ua:';
		break;
		case 'IncidrThreat':
			return ':flag_gb:';
		break;
		case 'y0u$$':
			return ':flag_lb:';
		break;
		default:
			return '';
		break;
	};
};

var random_gif = function(keywords,message,extra_msg_str){
	if(extra_msg_str == undefined) extra_msg_str = false;
	giphy.random({
	    tag: keywords,
	}, function (err, res) {
		if(err == null){
			if(extra_msg_str != false)
				message.channel.send(extra_msg_str);
			message.channel.send(res.data.url);	
		} else
			console.log(err);
	});
};

console.log('Link is running');
console.log(forfun);