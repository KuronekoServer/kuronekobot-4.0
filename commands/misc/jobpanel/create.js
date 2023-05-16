const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("正常にパネルが作成されました。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("この絵文字はつかえません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" });
const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("パネルの選択更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" });
module.exports = async (interaction) => {
    const role = await interaction.options.getRole("role");
    const emoji = await interaction.options.getString("emoji");
    const color = await interaction.options.getString("color");
    const title = await interaction.options.getString("title");
    const image = await interaction.options.getAttachment("image")?.attachment;
    const panel = new EmbedBuilder()
        .setTitle(title || "役職パネル")
        .setDescription(`${emoji || '🇦'}:${role}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
        .setColor(Colors[color] || Colors.Green)
        .setImage(image);
    const msg = await interaction.channel.send({ embeds: [panel] });
    const react = await msg.react(emoji || '🇦').catch(ex => { });
    if (!react) {
        await msg.delete()
        return ({ embeds: [error], ephemeral: true });
    } else {
        const getdata = await sql(`select * from job_message where guildid=${escape(interaction.guild.id)};`);
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update job_message set messageid=${escape(msg.id)},channelid=${escape(msg.channel.id)} where guildid=${escape(interaction.guild.id)};`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`insert into job_message values (${escape(interaction.guild.id)},${escape(msg.channel.id)},${escape(msg.id)});`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
        return ({ embeds: [success], ephemeral: true });
    };
};