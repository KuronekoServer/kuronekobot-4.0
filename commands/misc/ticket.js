const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, Colors } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .addStringOption(option => option.setName("title").setDescription("タイトルを設定"))
        .addStringOption(option => option.setName("description").setDescription("説明を設定"))
        .addStringOption(option => option.setName("label").setDescription("ボタンの名前"))
        .addAttachmentOption(option => option.setName("image").setDescription("表示したい画像"))
        .addStringOption(option => option.setName("color").setDescription("色を決められます").setChoices(
            { name: "赤色", value: "Red" },
            { name: "白色", value: "White" },
            { name: "水色", value: "Aqua" },
            { name: "緑色", value: "Green" },
            { name: "青色", value: "Blue" },
            { name: "黄色", value: "Yellow" },
            { name: "蛍光ピンク色", value: "LuminousVividPink" },
            { name: "紫色", value: "Purple" },
            { name: "赤紫色", value: "Fuchsia" },
            { name: "金色", value: "Gold" },
            { name: "オレンジ色", value: "Orange" },
            { name: "灰色", value: "Grey" },
            { name: "濃紺色", value: "Navy" },
            { name: "濃い水色", value: "DarkAqua" },
            { name: "濃い緑色", value: "DarkGreen" },
            { name: "濃い青色", value: "DarkBlue" },
            { name: "濃い紫色", value: "DarkPurple" },
            { name: "濃い蛍光ピンク色", value: "DarkVividPink" },
            { name: "濃い金色", value: "DarkGold" },
            { name: "濃いオレンジ色", value: "DarkOrange" },
            { name: "濃い赤色", value: "DarkRed" },
            { name: "濃い灰色", value: "DarkGrey" },
            { name: "明るい灰色", value: "LightGrey" },
            { name: "濃い紺色", value: "DarkNavy" },
            { name: "青紫色", value: "Blurple" },
        ))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('チケットを作成します'),
    async execute(interaction) {
        const options = interaction.options;
        const ticket_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_button')
                    .setLabel(options.getString("label") || '🎫チケット発行')
                    .setStyle(ButtonStyle.Success)
            );
        const ticket_embed = new EmbedBuilder()
            .setTitle(options.getString("title") || "お問い合わせ")
            .setDescription(options.getString("description") || "サポートとのチケットを発行します。\n発行後、メンションしたチャンネルにて質問などをご記入ください。")
            .setColor(Colors[options.getString("color")])
            .setImage(options.getAttachment("image")?.attachment);
        const success_embed = new EmbedBuilder()
            .setTitle("✅成功")
            .setDescription("チケットの作成に成功しました!")
        await interaction.channel.send({ embeds: [ticket_embed], components: [ticket_button] });
        await interaction.reply({ embeds: [success_embed], ephemeral: true })
    },
};