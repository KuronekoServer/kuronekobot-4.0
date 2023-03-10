const { Events, EmbedBuilder, Colors } = require('discord.js');
const chalk = require('chalk');
const { translate } = require("../../helpers/HttpUtils");
const lang = {
    "🇺🇸": "🇺🇸",
    "🇺🇲": "us",
    "🇯🇵": "ja",
    "🇨🇳": "zh",
    "🇪🇦": "es",
    "🇪🇸": "es",
    "🇸🇦": "ar",
    "🇲🇫": "fr",
    "🇮🇳": "hi",
    "🇩🇪": "de",
};
module.exports = {
    name: Events.MessageReactionAdd,
    async execute(interaction,tets) {
        console.log(tets)
        if (!lang[interaction.emoji.name]) return;
        const content = await translate(interaction.message.content, lang[interaction.emoji.name]);
        const embed = new EmbedBuilder()
            .setTitle("✅翻訳")
            .setDescription(`${content.output}`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | Translate" })
            .setColor(Colors.Green);
        await interaction.message.channel.send({ embeds: [embed], ephemeral: true }).catch(() => { });
    }
};