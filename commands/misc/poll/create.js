const { EmbedBuilder, Colors } = require("discord.js");
const basic_emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹'];
const success_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("チケットの作成に成功しました!")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
    .setColor(Colors.Green);
const react_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("選択されたリアクションはつけることができません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const load_embed = new EmbedBuilder()
    .setTitle("✅処理中")
    .setDescription("しばらくお待ちください")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const color = interaction.options.getString("color");
    const image = interaction.options.getAttachment("image")?.attachment;
    const data = interaction.options._hoistedOptions.map(choice => {
        if (choice.name.startsWith("choice")) return choice.value;
    }).filter((c) => c);
    const emoji_list = interaction.options._hoistedOptions.map(choice => {
        if (choice.name.startsWith("emoji")) return choice.value;
    }).filter((c) => c);
    const emojis = [...new Set(emoji_list.slice(0, basic_emojis.length).concat(basic_emojis))]
    const msg = await interaction.channel.send({ embeds: [load_embed] });
    for (const emoji of emojis.slice(0, data.length)) {
        const check = await msg.react(emoji).catch(ex => { });
        if (!check) {
            await msg.delete();
            return await interaction.reply({ embeds: [react_error], ephemeral: true });
        };
    };
    const poll_embed = new EmbedBuilder()
        .setTitle(interaction.options.getString("title"))
        .setDescription(data.filter(x => x).map((c, i) => `${emojis[i]} ${c}`).join('\n') + `\n\n 📊 \`/poll sum messageid:${msg.id} channelid:${msg.channel.id}\``)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
        .setColor(Colors[color || "Green"])
        .setImage(image);
    await msg.edit({ embeds: [poll_embed] })
    await interaction.reply({ embeds: [success_embed], ephemeral: true });
};