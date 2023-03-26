const { EmbedBuilder, Colors } = require('discord.js');
const { translate } = require("../../../helpers/HttpUtils");

module.exports = async (interaction) => {
    const to = interaction.options.getString("to");
    const content = interaction.options.getString("content");
    if (to) {
        //言語指定
        const result = await translate(content, to);
        const embed = new EmbedBuilder()
            .setTitle(`翻訳(${to})`)
            .setDescription(`${result?.output}`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | translate" })
            .setColor(Colors.Green);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        //言語指定なし
        if ((content.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) ? true : false) {
            //日本語
            const result = await translate(content, "en");
            const embed = new EmbedBuilder()
                .setTitle(`翻訳(自動英語)`)
                .setDescription(`${result?.output || "見つかりません"}`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | translate" })
                .setColor(Colors.Green);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            //日本語以外
            const result = await translate(content, "ja");
            const embed = new EmbedBuilder()
                .setTitle(`翻訳(自動日本語)`)
                .setDescription(`${result?.output || "見つかりません"}`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | translate" })
                .setColor(Colors.Green);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        };
    };
}