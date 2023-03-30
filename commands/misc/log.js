const { SlashCommandBuilder, ChannelType, EmbedBuilder, Colors, PermissionFlagsBits } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { escape } = require("mysql2")

const ERROREmbed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データの保存に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" });
const delete_embed = new EmbedBuilder()
    .setTitle("✅成功")
    .setDescription("データの削除に成功しました!")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" })
    .setColor(Colors.Green);
const undefined_embed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データが見つかりませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" });
const delete_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データの削除に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" });
module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .addSubcommand(subcommand =>
            subcommand.setName("create").setDescription("logチャンネルを指定します").addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("channel").setDescription("logを残したいチャンネルを選択").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName("delete").setDescription("logチャンネルを削除します")
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('logを残します'),
    async execute(interaction) {
        const getdata = await sql(`select * from log_channel where guildid=${escape(interaction.guild.id)};`);
        const sub = interaction.options.getSubcommand();
        if (sub === "create") {
            if (getdata[0][0]?.guildid) {
                const update = await sql(`update log_channel set channelid=${escape(interaction.options.getChannel("channel").id)} where guildid=${escape(interaction.guild.id)};`);
                const update_embed = new EmbedBuilder()
                    .setTitle(`✅logチャンネル`)
                    .setDescription(`logチャンネルを${interaction.options.getChannel("channel")}に変更しました。`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" })
                    .setColor(Colors.Green);
                if (!update) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
                await interaction.reply({ embeds: [update_embed], ephemeral: true });
            } else {
                const add = await sql(`insert into log_channel values (${escape(interaction.guild.id)}, ${escape(interaction.options.getChannel("channel").id)});`);
                const add_embed = new EmbedBuilder()
                    .setTitle(`✅logチャンネル`)
                    .setDescription(`logチャンネルを${interaction.options.getChannel("channel")}に設定しました。`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" })
                    .setColor(Colors.Green);
                if (!add) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
                await interaction.reply({ embeds: [add_embed], ephemeral: true });
            };
        };
        if (sub === "delete") {
            if (!getdata[0][0]?.guildid) return await interaction.reply({ embeds: [undefined_embed], ephemeral: true });
            const sql_delete = await sql(`DELETE FROM log_channel WHERE guildid = ${escape(interaction.guild.id)};`);
            if (!sql_delete) return await interaction.reply({ embeds: [delete_error], ephemeral: true });
            await interaction.reply({ embeds: [delete_embed], ephemeral: true });
        };
    }
};