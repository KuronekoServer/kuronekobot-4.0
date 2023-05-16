const { Events, EmbedBuilder, Colors } = require('discord.js');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

module.exports = {
    name: Events.GuildBanRemove,
    async execute(member) {
        const getdata = await sql(`select * from log_channel where guildid=${escape(member.guild.id)};`);
        if (!getdata[0][0]?.guildid) return;//もっときれいな書き方あったら書き直しといて(これだとレスポンス悪そう)
        try {
            const channel = await member.guild.channels.fetch(getdata[0][0]?.channelid);
            const Embed = new EmbedBuilder()
                .setTitle("✅BAN解除")
                .setDescription(`${member.user || member.user?.tag}がBAN解除されました`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | BANremove" });
            await channel.send({ embeds: [Embed] });
        } catch (error) {
            await sql(`DELETE FROM log_channel WHERE guildid = ${escape(member.guild.id)};`);
        };
    }
}