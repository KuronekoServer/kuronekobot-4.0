const { Events } = require("discord.js");
const { getEmbedName } = require("../../libs");

module.exports = {
    name: Events.MessageReactionAdd,
    filter(react, user) {
        const { client, message } = react;
        return (
            message.author.id === client.user.id &&
            user.id !== client.user.id &&
            message.embeds?.length
        );
    },
    async execute(react, user, Log) {
        const { message, emoji, users } = react;
        const name = getEmbedName(message.embeds[0]) ?? "";
        if (!name.startsWith("poll")) return;
        const reactions = message.reactions.cache;
        const maxCount = name.slice(0, 4);
        if (!reactions.has(emoji.name)) return react.remove();
        if (maxCount === "") return;
        const reacted = reactions.filter(reaction => reaction.users.cache.has(user.id));
        if (reacted.size > maxCount) return await users.remove();
    }
}