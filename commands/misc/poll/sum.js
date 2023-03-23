const { EmbedBuilder, Colors } = require("discord.js");
const bar = "▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉";
const c_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("メッセージが見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" });
const msg_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("メッセージがBOTの物ではありません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" });
module.exports = async (interaction) => {
    const id = interaction.options.getString("messageid");
    const channel = interaction.options.getString("channelid");
    try {
        const message = (channel) ? await (await interaction.guild.channels?.fetch(channel))?.messages?.fetch(id) : await interaction.channel.messages?.fetch(id);
        const check = message.embeds[0]?.data;
        if (!(check?.footer?.text !== "©️ 2023 KURONEKOSERVER | poll" || check?.footer?.text !== "©️ 2023 KURONEKOSERVER | expoll")) return await interaction.reply({ embeds: [msg_error], ephemeral: true });;
        const reactions = message.reactions.cache;
        let i = 0;
        const text = reactions.map(reaction => `**${check.description.split("\n")[i++]}(${reaction.count}票)**\n\`${((reaction.count / reactions.size) * 100).toFixed(1)}%\`　${bar.substr(0, ((reaction.count / reactions.size) * 100) / 4)}`)
        const success_embed = new EmbedBuilder()
            .setTitle(check.title)
            .setDescription(`${text.join("\n")}\n\n[アンケートへ戻る](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | poll" })
            .setColor(Colors.Green);
        await interaction.reply({ embeds: [success_embed], ephemeral: true });
    } catch (ex) {
        return await interaction.reply({ embeds: [c_error], ephemeral: true });
    };
};