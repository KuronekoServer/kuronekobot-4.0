const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { CustomEmbed, sql } = require('../../libs');

const logCreate = {
    builder: (builder) => builder
        .setName('create')
        .setDescription('logチャンネルを指定します')
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('logを残したいチャンネルを選択')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ,
    async execute(interaction, data, Log) {
        const channel = interaction.options.getChannel('channel');
        let sqlStatus;
        if (!data) {
            sqlStatus = await sql.insert('log_channel', [interaction.guild.id, channel.id]);
        } else {
            sqlStatus = await sql.update('log_channel', { channelid: channel.id }, `guildid = ${interaction.guild.id}`);
        };
        
        const embed = new CustomEmbed('log');
        if (!sqlStatus) embed.typeError().setDescription('データの保存に失敗しました。');
        else embed.typeSuccess().setDescription(`logチャンネルを${channel}に設定しました。`);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

const logDelete = {
    builder: (builder) => builder
        .setName('delete')
        .setDescription('logチャンネルを削除します')
    ,
    async execute(interaction, data, Log) {
        const embed = new CustomEmbed('log');
        if (!data) embed.typeError().setDescription('データが見つかりませんでした。');
        else {
            const sqlStatus = await sql.delete('log_channel', `guildid = ${interaction.guild.id}`);
            if (!sqlStatus) embed.typeError().setDescription('データの削除に失敗しました。');
            else embed.typeSuccess().setDescription('データの削除に成功しました!');
        };
        interaction.reply({ embeds: [embed], ephemeral: true });
    }

};

module.exports = {
    subcommands: [logCreate, logDelete],
    builder: (builder) => builder
        .setName('log')
        .setDescription('logチャンネルの設定')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {
        const data = await sql.select('log_channel', `guildid = ${interaction.guild.id}`);
        return [data];   
    }
};