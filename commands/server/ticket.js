const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors, ChannelType } = require("discord.js");
const { CustomEmbed, ColorsChoice, sql } = require("../../libs");

const ticketCreate = {
    builder: (builder) => builder
        .setName("create")
        .setDescription("チケット作成画面を作成します。")
        .addStringOption(option => option
            .setName("title")
            .setDescription("チケット作成画面のタイトル")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("description")
            .setDescription("チケット作成画面の説明文")
        )
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("チケット作成画面の画像")
        )
        .addStringOption(option => option
            .setName("color")
            .setDescription("チケット作成画面の色")
            .setChoices(...ColorsChoice)
        )
        .addStringOption(option => option
            .setName("label")
            .setDescription("チケットを作成するボタンのラベル")
        )
        .addChannelOption(option => option
            .setName("log")
            .addChannelTypes(ChannelType.GuildText)
            .setDescription("ログを送信するチャンネル")
        )
    ,
    async execute(command, data) {
        const { options, guild } = command;
        const title = options.getString("title");
        const description = options.getString("description");
        const image = options.getAttachment("image");
        const color = options.getString("color") || "Green";
        const label = options.getString("label") || "🎫チケット発行";
        const log = options.getChannel("log");

        const embed = new CustomEmbed("ticket")

        if (log) {
            let promise;
            if (data?.guildid) {
                promise = sql.update('ticket_channel', { channelid: log.id }, `guildid = ${guild.id}`)
            } else {
                promise = sql.insert('ticket_channel', [guild.id, log.id]);
            };
            if (!await promise) {
                embed.typeError()
                    .setDescription("データの保存に失敗しました。");
                return command.reply({ embeds: [embed], ephemeral: true })
            }
        };

        const component = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_button")
                    .setLabel(label)
                    .setStyle(ButtonStyle.Success)
            );
        const ticketEmbed = new CustomEmbed()
            .setTitle(title)
            .setColor(Colors[color])
        if (description) ticketEmbed.setDescription(description);
        if (image) ticketEmbed.setImage(image.attachment);
        await command.channel.send({ embeds: [ticketEmbed], components: [component] });

        embed.typeSuccess()
            .setDescription("チケット作成画面を作成しました。");
        command.reply({ embeds: [embed], ephemeral: true });
    }
};

const ticketDelete = {
    builder: (builder) => builder
        .setName("logdelete")
        .setDescription("チケットのログチャンネルを削除します(チャンネルそのものを削除するわけではありません)。")
    ,
    async execute(command, data) {
        const embed = new CustomEmbed("ticket");
        if (!(data?.guildid)) {
            embed.typeError()
                .setDescription("データが見つかりませんでした。");
        } else {
            const sqlDelete = await sql.delete('ticket_channel', `guildid = ${command.guild.id}`);
            if (!sqlDelete) {
                embed.typeError()
                    .setDescription("データの削除に失敗しました。");
            } else {
                embed.typeSuccess()
                    .setDescription("データの削除に成功しました。");
            }
        }
        command.reply({ embeds: [embed], ephemeral: true });
    }
};

module.exports = {
    subcommands: [ticketCreate, ticketDelete],
    builder: (builder) => builder
        .setName("ticket")
        .setDescription("チケットを作成します。")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(command) {
        const data = await sql.select('ticket_channel', `guildid = ${command.guild.id}`);
        return [command, data[0][0]]
    }
};