const {  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const modal = new ModalBuilder()
    .setCustomId('report')
    .setTitle('レポート');
const title = new TextInputBuilder()
    .setCustomId('title')
    .setLabel("タイトル")
    .setRequired(true)
    .setStyle(TextInputStyle.Short);
const description = new TextInputBuilder()
    .setCustomId('description')
    .setLabel("詳細")
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph);
const ar1 = new ActionRowBuilder().addComponents(title);
const ar2 = new ActionRowBuilder().addComponents(description);
modal.addComponents(ar1, ar2);
module.exports = async (interaction) => {
    await interaction.showModal(modal);
};