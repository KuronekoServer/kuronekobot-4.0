const { Events } = require('discord.js');
const response = require("../../helpers/messages.json")
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!response[message.content]) return;
        await message.channel.send({ content: response[message.content] });
    }
}