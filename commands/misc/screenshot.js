const { Client, SlashCommandBooleanOption, SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

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
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        const url = options.getString("url")
        const color = client.hexMainColor

        const ScreenShotEmbed = new EmbedBuilder()
        
        const path = member.id + ".jpg";
        //スクリーンショットを撮る部分
        const VirtualBrowser = await puppeteer.launch();
        const page = await VirtualBrowser.newPage();
        await page.goto(url);
        //スクリーンショット
        await page.screenshot({ path: path});
        //embedにデータを追加
        ScreenShotEmbed.addFields({ name: "サイトアドレス", value: url})
        .setColor(color)
        .setTitle("スクリーンショット")
        .setImage("attachment://" + path)
        .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL()});
        
        await interaction.reply({ embeds: [ScreenShotEmbed]});
        
    }
}