const { REST, Routes, Events, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const log = require('../logger');
const db = require('../db');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            const commands = [];
            client.commands = new Collection();
            const foldersPath = path.resolve(__dirname, '../commands');
            const commandFolders = fs.readdirSync(foldersPath);

            for (const folder of commandFolders) {
                const commandsPath = path.resolve(foldersPath, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.resolve(commandsPath, file);
                    const command = require(filePath);

                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                        commands.push(command.data.toJSON());
                        log.load(`⏳ Load command ${command.data.name}`);
                    } else {
                        log.error(`❌ Failed to load command ${file}`);
                    }
                }
            }
            const rest = new REST().setToken(process.env.DISCORD_TOKEN);
            try {
                log.load('⏳ Started refreshing application (/) commands.');
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands },
                );
                log.info(`✔️  Successfully reloaded ${commands.length} application (/) commands.`);
            } catch (error) {
                log.error(error);
            }

            await client.user.setActivity({
                name: 'blacklist users',
                type: ActivityType.Playing,
            });
        } catch (error) {
            log.error(error);
            console.error(error);
        }

        require('../table')
        log.info(`✔️  Logged in as ${client.user.tag}`);
    },
}