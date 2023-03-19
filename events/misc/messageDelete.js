const { Events, EmbedBuilder, Colors } = require('discord.js');
const { sql } = require("../../helpers/utils");
module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        const getdata = await sql(`select * from log_channel where guildid="${message.guild.id}";`);
        if (!getdata[0]?.guildid) return;//もっときれいな書き方あったら書き直しといて(これだとレスポンス悪そう)
        try {
            const channel = await message.guild.channels.fetch(getdata[0]?.channelid);
            const Embed = new EmbedBuilder()
                .setTitle("✅メッセージの削除")
                .setDescription(`メッセージユーザー:${message.author || message.author.tag}\n**削除したメッセージ**\n${message.content}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | messagedelete" });
            await channel.send({ embeds: [Embed] });
        } catch (error) {
            console.log(error)
            await sql(`DELETE FROM log_channel WHERE guildid = "${message.guild.id}";`);
        };
    }
}