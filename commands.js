const { Events } = require('discord.js');
const client = require('./client');
const prefix = '!';
// crée moi une commande avec prefix pour le dev

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    // the command is like !ping args
    const command = message.content.slice(prefix.length).split(' ')[0];
    const args = message.content.slice(prefix.length + command.length).trim().split(' ');
    if (command === 'ping') {
        return message.reply('pong');
    }
});