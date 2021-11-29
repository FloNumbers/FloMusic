// Require the necessary discord.js classes
require("dotenv").config()
const { Client, Intents, GuildMember, Guild } = require('discord.js');
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
let voiceConnection;
let player;
const queue = [];

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'join') {
		// establish voice connection
		voiceConnection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		await interaction.reply('connected to the voice channel');
	} else if (commandName === 'play') {
		youtubeUrl = interaction.options.getString('youtubelink');
		if (player == undefined) {
			// creates an audio player if there isn't one already
			createPlayer();
		}
		if (player.state.status != AudioPlayerStatus.Playing) {
			// plays the song if none is already playing
			playNow(youtubeUrl);
		} else {
			// adds to song if there is already one playing
			queue.push(youtubeUrl);
		}
		await interaction.reply('playing ' + youtubeUrl);
	} else if (commandName === 'leave') {
		voiceConnection.destroy();
		await interaction.reply('left the voice channel');
	} else if (commandName === 'pause') {
		player.pause();
		await interaction.reply('paused the song');
	} else if (commandName === 'unpause') {
		player.unpause();
		await interaction.reply('unpaused the song');
	} else if (commandName === "skip") {
		onPlayerIdle();
		await interaction.reply('skipped the song');
	} else if (commandName === "queue") {
		reply = "";
		for (let url of queue) {
			reply += '<' + url + '>\n';
		}
		await interaction.reply(reply);
	}
});

function playNow(youtubeLink) {
	const stream = ytdl(youtubeLink, { filter: 'audioonly' });
	const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

	player.play(resource);
	voiceConnection.subscribe(player);
}

function createPlayer() {
	player = createAudioPlayer();
	player.on(AudioPlayerStatus.Idle, onPlayerIdle);
}

function onPlayerIdle() {
	if (queue.length > 0) {
		playNow(queue[0]);
		queue.splice(0, 1);
	} else {
		voiceConnection.destroy();
	}
}

// Login to Discord with your client's token
client.login(process.env.DISCORDJS_BOT_TOKEN);
