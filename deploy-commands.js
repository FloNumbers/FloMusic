const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('join').setDescription('joins a channel'),
    new SlashCommandBuilder().setName('pause').setDescription('pauses the song'),
    new SlashCommandBuilder().setName('unpause').setDescription('unpauses the song'),
    new SlashCommandBuilder().setName('skip').setDescription('skips the song'),
    new SlashCommandBuilder().setName('queue').setDescription('shows the song queue'),
    new SlashCommandBuilder().setName('play').setDescription('plays a song').addStringOption((e) => {
        e.setName('youtubelink'); 
        e.setRequired(true); 
        e.setDescription('link to youtube video')
        return e
    }),
    new SlashCommandBuilder().setName('leave').setDescription('leaves the channel'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORDJS_BOT_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
