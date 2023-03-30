const { Events, EmbedBuilder, Colors, ChannelType } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { escape } = require("mysql2")

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.channel.type === ChannelType.DM) return;
        const getdata = await sql(`select * from log_channel where guildid=${escape(message.guild.id)};`);
        if (!getdata[0][0]?.guildid) return;//もっときれいな書き方あったら書き直しといて(これだとレスポンス悪そう)
        try {
            const channel = await message.guild.channels.fetch(getdata[0][0]?.channelid);
            const Embed = new EmbedBuilder()
                .setTitle("✅メッセージの削除")
                .setDescription(`メッセージユーザー:${message.author || message.author.tag}\n**対象チャンネル**${message.channel}**\n削除したメッセージ**\n${message.content}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | messagedelete" });
            await channel.send({ embeds: [Embed] });
        } catch (error) {
            await sql(`DELETE FROM log_channel WHERE guildid = ${escape(message.guild.id)};`);
        };
    }
}