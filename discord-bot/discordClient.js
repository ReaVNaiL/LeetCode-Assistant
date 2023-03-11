const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions
        ],
    }
);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity('Being a menace to society...', { type: 'WATCHING' });

    const commands = [
        {
            name: 'get-my-daily',
            description: 'Get your daily LC problem!',
        },
    ];

    client.guilds.cache.forEach(async (guild) => {
        await guild.commands.set(commands);
    });
});

exports.client = client;