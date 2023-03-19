const commands = require('../data/commands.json');

function SetBotCommands(client) {
    const lcCommands = commands.map((command) => ({
        name: command.name.toLowerCase(),
        description: command.description,
        options: command.options
    }));

    client.guilds.cache.forEach(async (guild) => {
        await guild.commands.set(lcCommands);
    });
}
exports.SetBotCommands = SetBotCommands;
