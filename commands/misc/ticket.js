const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, Colors, ChannelType } = require('discord.js');
const { sql } = require("../../helpers/utils");
const success_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("チケットの作成に成功しました!")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Green);
const delete_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("データの削除に成功しました!")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Green);
const ERROREmbed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データの保存に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" });
const undefined_embed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データが見つかりませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" });
const delete_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データの削除に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" });
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("チケットを作成します")
                .addStringOption(option => option.setName("title").setDescription("タイトルを設定"))
                .addStringOption(option => option.setName("description").setDescription("説明を設定"))
                .addStringOption(option => option.setName("label").setDescription("ボタンの名前"))
                .addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("log").setDescription("logを残したいチャンネルを選択"))
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
                    { name: "青紫色", value: "Blurple" }
                )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('チケットログチャンネルを削除します')
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('チケットを作成します'),
    async execute(interaction) {
        const getdata = await sql(`select * from ticket_channel where guildid="${interaction.guild.id}";`);
        const sub = interaction.options.getSubcommand();
        if (sub === "create") {
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
                .setColor(Colors[options.getString("color") || "Green"])
                .setImage(options.getAttachment("image")?.attachment)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" });
            if (interaction.options.getChannel("log")?.id) {
                if (getdata[0]?.guildid) {
                    const update = await sql(`update ticket_channel set channelid="${interaction.options.getChannel("log").id}" where guildid="${interaction.guild.id}";`);
                    if (!update) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
                } else {
                    const add = await sql(`insert into ticket_channel values ("${interaction.guild.id}","${interaction.options.getChannel("log").id}");`);
                    if (!add) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
                };
            };
            await interaction.channel.send({ embeds: [ticket_embed], components: [ticket_button] });
            await interaction.reply({ embeds: [success_embed], ephemeral: true });
        };
        if (sub === "delete") {
            if (!getdata[0]?.guildid) return await interaction.reply({ embeds: [undefined_embed], ephemeral: true });
            const sql_delete = await sql(`DELETE FROM log_channel WHERE guildid = "${interaction.guild.id}";`);
            if (!sql_delete) return await interaction.reply({ embeds: [delete_error], ephemeral: true });
            await interaction.reply({ embeds: [delete_embed], ephemeral: true });
        }
    },
};