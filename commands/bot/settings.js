const { Colors } = require("discord.js");
const { CustomEmbed, sql } = require("../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("settings")
        .setDescription("サーバーの設定を表示します。")
    ,
    async execute(interaction) {
        const dataNames = ["ticket_channel", "log_channel", "job_message"];
        const data = {};
        const promises = dataNames.map((name) => {
            return sql.select(name, `guildid = ${interaction.guild.id}`)
                .then((res) => {
                    if (!res) data[name] = {};
                    else data[name] = res[0]
                });
        });
        await Promise.all(promises);

        const normalFieldData = [
            ["Ticketlogチャンネル", `${data.ticket_channel?.guildid ? interaction.guild.channels.cache.get(data.ticket_channel?.channelid) || data.ticket_channel?.channelid : "未設定"}`],
            ["logチャンネル", `${data.log_channel?.guildid ? interaction.guild.channels.cache.get(data.log_channel?.channelid) || data.log_channel?.channelid : "未設定"}`],
            ["役職パネル", `${data.job_message?.guildid ? `対象チャンネル:${interaction.guild.channels.cache.get(data.job_message?.channelid) || data.log_channel?.channelid}\n対象メッセージ:[messagelink](https://discord.com/channels/${data.log_channel?.guildid}/${data.log_channel?.channelid}/${data.log_channel?.messageid})` : "未設定"}`],
        ];
        
        const fieldData = [];
        normalFieldData.forEach((data) => fieldData.push({ name: data[0], value: data[1], inline: true }));
        
        const embed = new CustomEmbed("show")
            .setTitle("サーバーの設定")
            .setDescription(`[サポートサーバー](https://discord.gg/Y6w5Jv3EAR)`)
            .addFields(fieldData)
            .setColor(Colors.Green);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};