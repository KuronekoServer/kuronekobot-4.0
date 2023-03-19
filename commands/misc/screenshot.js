const { SlashCommandBuilder, ChatInputCommandInteraction, Colors, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');
const ERROREmbed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("URL先のページが見つかりませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | screenshot" });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("screenshot")
        .setDescription("Webサイトをスクリーンショットする")
        .addStringOption(
            option =>
                option.setName("url")
                    .setDescription("スクリーンショット撮りたいWebサイトのURL")
                    .setRequired(true)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction) {
        const { options } = interaction;
        const url = options.getString("url");
        const VirtualBrowser = await puppeteer.launch();
        //スクリーンショットを撮る部分
        const page = await VirtualBrowser.newPage();
        const go = await page.goto(url);
        if (!go) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true });//エラーハンドリング
        //スクリーンショット
        //ファイルで保存すると容量食うのでbase64にして渡すようにする
        const base64 = await page.screenshot({ encoding: "base64" });
        const imageStream = new Buffer.from(base64, 'base64');

        //ページ撮ったら閉じないとリソース食っちゃう
        await VirtualBrowser.close();
        await interaction.reply({ content: "✅スクリーンショット", files: [{ attachment: imageStream }], ephemeral: true });
    }
}