const { SlashCommandBuilder, ChannelType, EmbedBuilder, Colors, PermissionFlagsBits } = require('discord.js');
const { sql } = require("../../helpers/utils");
const ERROREmbed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データの保存に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("channel").setDescription("logを残したいチャンネルを選択").setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('logを残します'),
    async execute(interaction) {
        const getdata = await sql(`select * from log_channel where guildid="${interaction.guild.id}";`);
        if (getdata[0]?.guildid) {
            const update = await sql(`update log_channel set channelid="${interaction.options.getChannel("channel").id}" where guildid="${interaction.guild.id}";`);
            const update_embed = new EmbedBuilder()
                .setTitle(`✅logチャンネル`)
                .setDescription(`logチャンネルを${interaction.options.getChannel("channel")}に変更しました。`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" })
                .setColor(Colors.Green);
            if (!update) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
            await interaction.reply({ embeds: [update_embed], ephemeral: true });
        } else {
            const add = await sql(`insert into log_channel values ("${interaction.guild.id}", "${interaction.options.getChannel("channel").id}");`);
            const add_embed = new EmbedBuilder()
                .setTitle(`✅logチャンネル`)
                .setDescription(`logチャンネルを${interaction.options.getChannel("channel")}に設定しました。`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | log" })
                .setColor(Colors.Green);
            if (!add) return await interaction.reply({ embeds: [ERROREmbed], ephemeral: true })
            await interaction.reply({ embeds: [add_embed], ephemeral: true });
        };
    }
};