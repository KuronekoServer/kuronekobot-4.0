const { Events, Colors, hyperlink } = require("discord.js");
const { CustomEmbed, getEmbedName } = require("../../libs");

const regex = /(https?:\/\/)?((ptb|canary)\.)?discord\.com\/channels(\/\d{17,19}){3}/g;

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const { client, content } = message;
        const urls = content.match(regex);
        if (!urls) return;
        const ids = urls
            .map((url) => {
                const paths = url.split("/");
                const index = paths.indexOf("channels");
                const [guild, channel, message] = paths.slice(index + 1);
                return { guild, channel, message };
            })
            .filter((id, index, ids) => ids.findIndex((i) => i.guild === id.guild && i.channel === id.channel && i.message === id.message) === index);
        
        for (const id of ids) {
            const guild = await client.guilds.fetch(id.guild);
            if (!guild) return;
            const channel = await guild.channels.fetch(id.channel);
            if (!channel) return;
            const msg = await channel.messages.fetch(id.message);
            if (!msg) return;
            const embeds = msg.embeds.filter((embed) => getEmbedName(embed) !== "fetchMessage");
            const attachments = msg.attachments.map((attachment) => attachment);
            let description = hyperlink("メッセージにジャンプ", msg.url);
            if (embeds.length) description += `\n${embeds.length}個の埋め込みメッセージがあります。`;
            if (attachments.length) description += `\n${attachments.length}個の添付ファイルがあります。`;
            const embed = new CustomEmbed("fetchMessage")
                .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                .setDescription(description)
                .setTimestamp(msg.createdAt)
                .setColor(Colors.Aqua);
            if (msg.content) embed.addFields({ name: "\u200b", value: msg.content || "\u200b" });
            message.reply({ embeds: [embed] });
            if (embeds.length) {
                embeds.forEach((embed, index) => {
                    message.channel.send({ embeds: [embed], files: (embeds.length - 1 === index ? attachments : null) });
                });
            } else if (attachments.length) {
                message.channel.send({ files: attachments })
            }
        }
    }
};