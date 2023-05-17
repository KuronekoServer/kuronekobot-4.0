const { Events, EmbedBuilder, Colors, ChannelType } = require('discord.js');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (oldMessage.channel.type === ChannelType.DM) return;
        const getdata = await sql(`select * from log_channel where guildid=${escape(oldMessage.guild.id)};`);
        if (!getdata[0][0]?.guildid) return;//もっときれいな書き方あったら書き直しといて(これだとレスポンス悪そう)
        try {
            const channel = await oldMessage.guild.channels.fetch(getdata[0][0]?.channelid);
            const Embed = new EmbedBuilder()
                .setTitle("✅メッセージの編集")
                .setDescription(`メッセージユーザー:${oldMessage.author || oldMessage.author.tag}\n**対象チャンネル**:${newMessage.channel}\n**編集前のメッセージ**\n${oldMessage.content}\n**編集後のメッセージ**\n${newMessage.content}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | messageUpdate" });
            await channel.send({ embeds: [Embed] });
        } catch (error) {
            await sql(`DELETE FROM log_channel WHERE guildid = ${escape(oldMessage.guild.id)};`);
        };
    }
}