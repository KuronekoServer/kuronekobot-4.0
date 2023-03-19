const { Events, Colors, EmbedBuilder } = require('discord.js');
const { sql } = require("../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("exvoiceを更新しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === "exvoice_add") {
            const data = interaction.values;
            await Promise.all(data.map(async content => {
                const value = content.split(",");
                const getdata = await sql(`select * from exvoiceword where guildid="${interaction.guild.id}" and speakname="${value[0]}" and word="${value[1]}";`);
                if (!getdata[0]?.word) {
                    const set = await sql(`INSERT INTO exvoiceword(guildid,word,speakname) VALUES ("${interaction.guild.id}","${value[1]}","${value[0]}");`);
                    if (!set) return await interaction.reply({ embeds: [db_error], ephemeral: true });
                };
            }));
            await interaction.reply({ embeds: [success], ephemeral: true });
        };
        if (interaction.customId === "exvoice_remove") {
            const data = interaction.values;
            await Promise.all(data.map(async content => {
                const value = content.split(",");
                const getdata = await sql(`select * from exvoiceword where guildid="${interaction.guild.id}" and speakname="${value[0]}" and word="${value[1]}";`);
                if (getdata[0]?.word) {
                    const set = await sql(`DELETE FROM exvoiceword where guildid="${interaction.guild.id}" and speakname="${value[0]}" and word="${value[1]}";`);
                    if (!set) return ({ embeds: [db_error], ephemeral: true });
                }
            }));
            await interaction.reply({ embeds: [success], ephemeral: true });
        };
    }
};