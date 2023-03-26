const { Colors, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const ERROREmbed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("URL先のページが見つかりませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | screenshot" });
module.exports = async (interaction) => {
    const { options } = interaction;
    const wait = new EmbedBuilder()
        .setTitle(`✅撮影中...`)
        .setDescription(`${options.getString("url")}\nのページを撮影しています。`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | screenshot" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [wait], ephemeral: true });
    const url = options.getString("url");
    const VirtualBrowser = await puppeteer.launch({});
    const page = await VirtualBrowser.newPage();
    await page.goto(url)
        .then(async () => {
            const base64 = await page.screenshot({ encoding: "base64", fullPage: true });
            const imageStream = new Buffer.from(base64, 'base64');
            const attachment = new AttachmentBuilder(imageStream, { name: "screen.png" });
            await VirtualBrowser.close();
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription(`${options.getString("url")}\nのページを撮影しました。`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | screenshot" })
                .setImage("attachment://screen.png")
                .setColor(Colors.Green);
            await interaction.editReply({ embeds: [success], files: [attachment], ephemeral: true })
        })
        .catch(async (ex) => await interaction.editReply({ embeds: [ERROREmbed], ephemeral: true }));
}