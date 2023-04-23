const { Events, Colors, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { ticket_timer, sql } = require("../../helpers/utils");
const { escape } = require("mysql2")

/*  
   embed
*/
const wait_embed = new EmbedBuilder()
    .setTitle("お問い合わせ")
    .setDescription("スタッフが来るまでお待ちください。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Green);
const cancel_embed = new EmbedBuilder()
    .setTitle("Ticket")
    .setDescription("チケットの削除がキャンセルされました。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Green);
const confirmation_embed = new EmbedBuilder()
    .setTitle("Ticket")
    .setDescription("5秒後にチケットが削除されます。\nキャンセルするには下記のキャンセルボタンを押してください。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Red);
const permissions_embed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("権限が足りません。\nBOTに権限を与えてください。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Red);
const sql_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("データベースからTicket情報を削除しました。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
    .setColor(Colors.Green);
/*
button
*/
const close_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('🔒チケットを閉じる')
            .setStyle(ButtonStyle.Danger)
    );
const close_button1 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('🔒チケットを閉じる')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)//ボタンを押せるように
    );
const cancel_button = new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
        .setCustomId('ticket_cancel')
        .setLabel('✖キャンセル')
        .setStyle(ButtonStyle.Danger)
    );

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            try {
                if (interaction.customId === "ticket_button") {
                    const new_channel = await interaction.guild.channels.create({
                        name: `￤🎫-${interaction.user.username}￤`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone, deny: [PermissionsBitField.FLAGS.VIEW_CHANNEL]
                            },
                            {
                                id: interaction.user.id, allow: [PermissionsBitField.FLAGS.VIEW_CHANNEL, PermissionsBitField.FLAGS.SEND_MESSAGES]
                            },
                            {
                                id: process.env.clientId, allow: [PermissionsBitField.FLAGS.VIEW_CHANNEL, PermissionsBitField.FLAGS.SEND_MESSAGES]
                            }
                        ]
                    });
                    const success_embed = new EmbedBuilder()
                        .setTitle("Ticket")
                        .setDescription(`チケットを作成しました。\nチャンネルを開いて質問などをご記入ください。\n${new_channel}`)
                        .setColor(Colors.Green);
                    await new_channel.send({ embeds: [wait_embed], components: [close_button] });
                    await new_channel.send({ content: `${interaction.member}` });
                    await interaction.reply({ embeds: [success_embed], ephemeral: true });
                    const create_embed = new EmbedBuilder()
                        .setTitle("チケットが作成されました")
                        .setDescription(`チャンネル:${new_channel.name}\nユーザー:${interaction.user}\n日時:${new Date()}`)
                        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
                        .setColor(Colors.Green);
                    const getdata = await sql(`select * from ticket_channel where guildid=${escape(interaction.guild.id)};`);
                    if (getdata[0][0]?.guildid) await (await interaction.guild.channels.fetch(getdata[0][0].channelid)).send({ embeds: [create_embed] });
                };
                if (interaction.customId === "ticket_close") {
                    const channel = await interaction.channel.messages.fetch({ after: '0', limit: 1 });
                    const message = await interaction.channel.messages.fetch(channel.map(x => x.id)[0]);
                    await message.edit({ embeds: [wait_embed], components: [close_button1] });
                    await interaction.reply({ embeds: [confirmation_embed], components: [cancel_button], ephemeral: true });
                    ticket_timer({ action: interaction, type: "delete" });
                };
                if (interaction.customId === "ticket_cancel") {
                    ticket_timer({ action: interaction, type: "cancel" });
                    const channel = await interaction.channel.messages.fetch({ after: '0', limit: 1 });
                    const message = await interaction.channel.messages.fetch(channel.map(x => x.id)[0]);
                    await message.edit({ embeds: [wait_embed], components: [close_button] });
                    await interaction.reply({ embeds: [cancel_embed], ephemeral: true });
                };
                if (interaction.customId === "ticket_log") {
                    await sql(`DELETE FROM ticket_channel where guildid=${escape(interaction.guild.id)};`);
                    await interaction.reply({ embeds: [sql_embed], ephemeral: true });
                };
            } catch (error) {
                const other_error = new EmbedBuilder()
                    .setTitle("⚠️エラー")
                    .setDescription(`不明なエラー:${error}`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ticket" })
                    .setColor(Colors.Red);
                if (error.message === "Missing Permissions") return await interaction.reply({ embeds: [permissions_embed], ephemeral: true }).catch(() => { });
                await interaction.reply({ embeds: [other_error], ephemeral: true }).catch(() => { });
            };
        };
    }
};