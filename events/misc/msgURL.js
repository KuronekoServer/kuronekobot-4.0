const { Events, Colors, hyperlink } = require("discord.js");
const { CustomEmbed } = require("../../libs");

const regex = /(https?:\/\/)?((ptb|canary)\.)?discord\.com\/channels(\/\d{17,19}){3}/;

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const { client, content } = message;
        const urls = content.match(regex);
        if (!urls) return;
        urls.forEach(async (url) => {
            const [guildId, channelId, messageId] = new URL(url).pathname.split("/").slice(2);
            const guild = client.guilds.cache.get(guildId);
            if (!guild) return;
            const channel = await guild.channels.fetch(channelId);
            if (!channel) return;
            const msg = await channel.messages.fetch(messageId);
            if (!msg) return;
            const embedText = msg.embeds.length ? `\n${msg.embeds.length}個の埋め込みメッセージがあります。` : "";
            const attachmentText = msg.attachments.size ? `\n${msg.attachments.size}個の添付ファイルがあります。` : "";
            const embed = new CustomEmbed("fetchMessage")
                .setAuthor({ name: msg.author.tag, icon_url: msg.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${hyperlink("メッセージにジャンプ", msg.url)}${embedText}${attachmentText}`)
                .setTimestamp(msg.createdAt)
                .setColor(Colors.Aqua);
            if (msg.content) embed.addFields({ name: "\u200b", value: msg.content || "\u200b" });
            if (msg.embeds.length) 
        });
        
    }
};

function fetchMessageData(url, client) {
    const [guildId, channelId, messageId] = 
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);
    const msg = channel.messages.fetch(messageId);
    return msg;
}