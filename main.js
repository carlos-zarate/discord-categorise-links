const Discord = require('discord.js');
const discordInfo = require('./config.json');

const hook = new Discord.WebhookClient(discordInfo.webhook, discordInfo.token);

function exampleFunc() {
    console.log("BOIZZZ");
};

exampleFunc();