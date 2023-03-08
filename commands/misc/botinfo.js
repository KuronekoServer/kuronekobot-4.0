const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { sql } = require("../../helpers/utils");

const ticket_log = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_log')
            .setLabel("チケットLogチャンネルを削除")
            .setStyle(ButtonStyle.Success)
    );
module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('BOTの情報を表示します'),
    async execute(interaction) {
        const getdata = await sql(`select * from ticket_channel where guildid="${interaction.guild.id}";`);
        const latency = new EmbedBuilder()
            .setTitle(`BOTの情報`)
            .setDescription("レイテンシー計測しています...")
        const msg = await interaction.reply({ embeds: [latency], fetchReply: true, ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle(`BOTの情報`)
            .addFields(
                { name: 'Ping', value: `📡BOT応答時間:${msg.createdTimestamp - interaction.createdTimestamp}ws\n📡API応答時間:${interaction.client.ws.ping}ws` },
                { name: 'Ticketlogチャンネル', value: getdata[0]?.guildid ? "設定済み" : "未設定" },
                { name: 'サポートサーバー', value: `https://discord.gg/Y6w5Jv3EAR` }
            );
        const send = { embeds: [embed], ephemeral: true };
        const buttons = getdata[0]?.guildid ? ticket_log : null
        if (buttons) send.components = [buttons];
        await interaction.editReply(send);
    }
};