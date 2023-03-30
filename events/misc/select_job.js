const { Events, Colors, EmbedBuilder } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルの選択更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const undefined_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルを検知できませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const success = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("パネルを選択しました!")
    .setColor(Colors.Green)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.commandName === "パネルを選択") {
            const msg = await interaction.channel.messages.fetch(interaction.targetId);
            if (msg.author.id === interaction.client.user.id) {
                if (msg.embeds[0]?.data.footer.text === "©️ 2023 KURONEKOSERVER | jobpanel") {
                    const getdata = await sql(`select * from job_message where guildid=${escape(interaction.guild.id)};`);
                    if (getdata[0][0]?.guildid) {
                        const set = await sql(`update job_message set messageid=${escape(msg.id)},channelid=${escape(msg.channel.id)} where guildid=${escape(interaction.guild.id)};`);
                        if (!set) return ({ embeds: [db_error], ephemeral: true });
                    } else {
                        const set = await sql(`insert into job_message values (${escape(interaction.guild.id)},${escape(msg.channel.id)},${escape(msg.id)});`);
                        if (!set) return ({ embeds: [db_error], ephemeral: true });
                    };
                    await interaction.reply({ embeds: [success], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [undefined_error], ephemeral: true });
                };
            } else {
                await interaction.reply({ embeds: [undefined_error], ephemeral: true });
            };
        }
    }
};