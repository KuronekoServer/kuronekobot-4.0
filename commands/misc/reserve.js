const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const warning = new EmbedBuilder()
    .setTitle(`⚠️予約送信`)
    .setDescription(`1秒以下には指定できません。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | reserve" })
    .setColor(Colors.Red);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reserve')
        .addIntegerOption(option => option.setName("secound").setDescription("送りたい秒数").setRequired(true))
        .addStringOption(option => option.setName("content").setDescription("送りたいメッセージ").setRequired(true))
        .setDMPermission(false)
        .setDescription('指定した時間後にメッセージを送信します'),
    async execute(interaction) {
        if (interaction.options.getInteger("secound") < 1) return await interaction.reply({ embeds: [warning], ephemeral: true });
        const latency = new EmbedBuilder()
            .setTitle(`✅予約送信`)
            .setDescription(`${interaction.options.getString("content")}\nを${interaction.options.getInteger("secound")}秒後に送信します。`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | reserve" })
            .setColor(Colors.Green);
        await interaction.reply({ embeds: [latency], ephemeral: true });
        setTimeout(async () => {
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.tag}の予約送信`)
                .setDescription(`${interaction.options.getString("content")}`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | reserve" })
                .setColor(Colors.Green);
            await interaction.channel.send({ embeds: [embed], ephemeral: true }).catch(ex => { });
        }, interaction.options.getInteger("secound") * 1000);
    }
};