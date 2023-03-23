const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(react, user) {
        const react_channel = await react.message.guild.channels.fetch(react.message.channel.id);
        const react_message = await react_channel.messages.fetch(react.message.id);
        if (react_message.author.id !== process.env.clientId) return;
        if (!react_message.embeds) return;
        if (user.id === process.env.clientId) return;
        const reaction = react_message.reactions.cache.get(react._emoji.name);
        if (react_message.embeds[0]?.data?.footer?.text === "©️ 2023 KURONEKOSERVER | poll") {
            if (!reaction) return await react.remove();
            if (!reaction.me) return await react.remove();
        };
        if (react_message.embeds[0]?.data?.footer?.text === "©️ 2023 KURONEKOSERVER | expoll") {
            if (!reaction) return await react.remove();
            if (!reaction.me) return await react.remove();
            const reactions = react_message.reactions.cache.filter(r => r.users.cache.has(user.id));
            if (reactions.size > 1) return await react.users.remove(user.id);
        };
    }
}