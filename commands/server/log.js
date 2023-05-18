const { ChannelType, Colors, PermissionFlagsBits } = require("discord.js");
const { CustomEmbed, Utils } = require("../../libs");
const { escape } = require("mysql2");

const logCreate = {
    builder: (builder) => builder
        .setName("create")
        .setDescription("logチャンネルを指定します")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("logを残したいチャンネルを選択")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ,
    async execute(interaction, getdata, Log) {
        const channel = interaction.options.getChannel("channel");
        let sqlStatus;
        if (getdata?.guildid) {
            sqlStatus = Utils.sql(`update log_channel set channelid=${escape(channel.id)} where guildid=${escape(interaction.guild.id)};`);
        } else {
            sqlStatus = Utils.sql(`insert into log_channel values (${escape(interaction.guild.id)}, ${escape(interaction.options.getChannel("channel").id)});`);
        };
        await sqlStatus;
        const embed = new CustomEmbed("log");
        if (!sqlStatus) embed.typeError().setDescription("データの保存に失敗しました。");
        else embed.typeSuccess().setDescription(`logチャンネルを${channel}に設定しました。`);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

const logDelete = {
    builder: (builder) => builder
        .setName("delete")
        .setDescription("logチャンネルを削除します")
    ,
    async execute(interaction, getdata, Log) {
        const embed = new CustomEmbed("log");
        if (!getdata?.guildid) embed.typeError().setDescription("データが見つかりませんでした。");
        else {
            const sqlStatus = await Utils.sql(`DELETE FROM log_channel WHERE guildid = ${escape(interaction.guild.id)};`);
            if (!sqlStatus) embed.typeError().setDescription("データの削除に失敗しました。");
            else embed.typeSuccess().setDescription("データの削除に成功しました!");
        };
        interaction.reply({ embeds: [embed], ephemeral: true });
    }

};

module.exports = {
    subcommands: [logCreate, logDelete],
    builder: (builder) => builder
        .setName("log")
        .setDescription("logチャンネルの設定")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {
        const getdata = await Utils.sql(`select * from log_channel where guildid=${escape(interaction.guild.id)};`);
        return [getdata[0][0]];
    }
};