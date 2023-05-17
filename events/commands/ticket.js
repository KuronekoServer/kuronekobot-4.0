const { Events, Colors, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Utils, CustomEmbed } = require("../../libs");
const { sql } = Utils;
const { escape } = require("mysql2");

module.exports = {
    name: Events.InteractionCreate,
    filter: (interaction) => interaction.isButton() && interaction.customId.startsWith("ticket_"),
    async execute(interaction) {
        const embed = new CustomEmbed("ticket");
        try {
            if (interaction.customId === "ticket_button") {
                const ticketChannel = await interaction.guild.channels.create({
                    name: `￤🎫-${interaction.user.username}￤`,
                    permissionOverwrites:[
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: process.env.clientId,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        }
                    ]
                });
                const ticketEmbed = new CustomEmbed("ticket")
                    .setTitle("お問い合わせ")
                    .setDescription("スタッフが来るまでお待ちください。")
                    .setColor(Colors.Green);
                const ticketComponent = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket_close")
                            .setLabel("🔒チケットを閉じる")
                            .setStyle(ButtonStyle.Danger)
                    );
                await ticketChannel.send({ content: `${interaction.member}`, embeds: [ticketEmbed], components: [ticketComponent] });
                embed
                    .setTitle("Ticket")
                    .setDescription(`チケットを作成しました。\nチャンネルを開いて質問などをご記入ください。\n${ticketChannel}`)
                    .setColor(Colors.Green);
                interaction.reply({ embeds: [success_embed], ephemeral: true });
                const getdata = await sql(`select * from ticket_channel where guildid=${escape(interaction.guild.id)};`);
                if (getdata[0][0]?.guildid) {
                    const logEmbed = new CustomEmbed("ticket")
                        .setTitle("チケットが作成されました。")
                        .addFields(
                            {
                                name: "チャンネル",
                                value: `${ticketChannel} (${ticketChannel.name})`,
                                inline: true
                            },
                            {
                                name: "ユーザー",
                                value: `${interaction.user}`,
                                inline: true
                            },
                            {
                                name: "日時",
                                value: `${new Date()}`,
                                inline: true
                            }
                        )
                        .setColor(Colors.Green);
                    const logChannel = await interaction.guild.channels.cache.get(getdata[0][0].channelid);
                    await logChannel.send({ embeds: [logEmbed] }); 
                }
            }
            if (interaction.customId === "ticket_close") {
                embed
                    .setTitle("⚠確認 (30秒後に自動キャンセルされます)")
                    .setDescription("チケットを閉じますか？\n閉じると元に戻せません。")
                    .setColor(Colors.Red);
                const component = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticketcloseclose")
                            .setLabel("閉じる")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("ticketclosecancel")
                            .setLabel("キャンセル")
                            .setStyle(ButtonStyle.Secondary)
                    );
                const message = await interaction.reply({ embeds: [embed], components: [component], ephemeral: true });
                message.awaitMessageComponent({ time: 30 * 1000 })
                    .then(async (i) => {
                        if (i.customId === "ticketcloseclose") {
                            const logEmbed = new CustomEmbed("ticket")
                                .setTitle("チケットが閉じられました。")
                                .addFields(
                                    {
                                        name: "チャンネル",
                                        value: interaction.channel.name,
                                        inline: true
                                    },
                                    {
                                        name: "ユーザー",
                                        value: interaction.user,
                                        inline: true
                                    },
                                    {
                                        name: "日時",
                                        value: new Date(),
                                        inline: true
                                    }
                                )
                                .setColor(Colors.Red);
                            await interaction.channel.delete();
                            const getdata = await sql(`select * from ticket_channel where guildid=${escape(interaction.guild.id)};`);
                            if (getdata[0][0]?.guildid) {
                                const logChannel = await interaction.guild.channels.cache.get(getdata[0][0].channelid);
                                await logChannel.send({ embeds: [logEmbed] });
                            }
                        } else {
                            message.delete();
                        }
                    });
            }
        } catch (error) {
            embed.typeError();
            if (error.message === "Missing Permissions") embed.setDescription("botの権限が不足しています。")
            else embed.setDescription(`不明なエラーが発生しました。\n${error.message}`);
            interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
        };
    }
};