const { SlashCommandBuilder, Colors, EmbedBuilder } = require('discord.js');
const emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
const success_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("チケットの作成に成功しました!")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
    .setColor(Colors.Green);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("アンケートを実施する")
        .addStringOption(
            option => option
                .setName("title")
                .setDescription("タイトル").setRequired(true))
        .addStringOption(
            option => option
                .setName("choice1")
                .setDescription("選択肢1").setRequired(true))
        .addStringOption(
            option => option
                .setName("choice2")
                .setDescription("選択肢2"))
        .addStringOption(
            option => option
                .setName("choice3")
                .setDescription("選択肢3"))
        .addStringOption(
            option => option
                .setName("choice4")
                .setDescription("選択肢4"))
        .addStringOption(
            option => option
                .setName("choice5")
                .setDescription("選択肢5"))
        .addStringOption(
            option => option
                .setName("choice6")
                .setDescription("選択肢6"))
        .addStringOption(
            option => option
                .setName("choice7")
                .setDescription("選択肢7"))
        .addStringOption(
            option => option
                .setName("choice8")
                .setDescription("選択肢8"))
        .addStringOption(
            option => option
                .setName("choice9")
                .setDescription("選択肢9"))
        .addStringOption(
            option => option
                .setName("choice10")
                .setDescription("選択肢10"))
        .addStringOption(
            option => option
                .setName("choice11")
                .setDescription("選択肢11"))
        .addStringOption(
            option => option
                .setName("choice12")
                .setDescription("選択肢12"))
        .addStringOption(
            option => option
                .setName("choice13")
                .setDescription("選択肢13"))
        .addStringOption(
            option => option
                .setName("choice14")
                .setDescription("選択肢14"))
        .addStringOption(
            option => option
                .setName("choice15")
                .setDescription("選択肢15"))
        .addStringOption(
            option => option
                .setName("choice16")
                .setDescription("選択肢16"))
        .addStringOption(
            option => option
                .setName("choice17")
                .setDescription("選択肢17"))
        .addStringOption(
            option => option
                .setName("choice18")
                .setDescription("選択肢18"))
        .addStringOption(
            option => option
                .setName("choice19")
                .setDescription("選択19"))
        .addStringOption(
            option => option
                .setName("choice20")
                .setDescription("選択肢20")),

    async execute(interaction) {
        const data = interaction.options._hoistedOptions.map(choice => {
            if (choice.name === "title") return;
            return choice.value;
        });
        const poll_embed = new EmbedBuilder()
            .setTitle(interaction.options.getString("title"))
            .setDescription(data.filter(x => x).map((c, i) => `${emojis[i]} ${c}`).join('\n'))
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
            .setColor(Colors.Green);
        const poll = await interaction.channel.send({ embeds: [poll_embed] });
        emojis.slice(0, data.filter(x => x).length).forEach(emoji => poll.react(emoji));
        await interaction.reply({ embeds: [success_embed], ephemeral: true });
    }
}