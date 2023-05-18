const { Colors } = require("discord.js");
const { CustomEmbed, Utils } = require("../../../libs");
const { escape } = require("mysql2");

module.exports = {
    builder: (builder) => builder
        .setName("show")
        .setDescription("サーバーの設定を表示します。")
    ,
    async execute(interaction) {
        const dataNames = ["ticket_channel", "log_channel", "job_message", "dictionary", "server_speak", "read_user", "exvoiceword"];
        const data = {};
        const promises = dataNames.map((name) => {
            return Utils.sql(`select * from ${name} where guildid=${escape(interaction.guild.id)};`)
                .then((res) => data[name] = res[0][0]);
        });
        await Promise.all(promises);

        const normalFieldData = [
            ["Ticketlogチャンネル", `${data.ticket_channel?.guildid ? interaction.guild.channels.cache.get(data.ticket_channel?.channelid) || data.ticket_channel?.channelid : "未設定"}`],
            ["logチャンネル", `${data.log_channel?.guildid ? interaction.guild.channels.cache.get(data.log_channel?.channelid) || data.log_channel?.channelid : "未設定"}`],
            ["役職パネル", `${data.job_message?.guildid ? `対象チャンネル:${interaction.guild.channels.cache.get(data.job_message?.channelid) || data.log_channel?.channelid}\n対象メッセージ:[messagelink](https://discord.com/channels/${data.log_channel?.guildid}/${data.log_channel?.channelid}/${data.log_channel?.messageid})` : "未設定"}`],
        ];

        const speakFieldData = [
            ["辞書機能", `${data.dictionary?.guildid ? "設定済み" : "未設定"}`],
            ["自動入室チャンネル(voice)", `${data.server_speak?.auto_voice_channel ? interaction.guild.channels.cache.get(data.server_speak?.auto_voice_channel) || data.server_speak?.auto_voice_channel : "未設定"}`],
            ["自動入室チャンネル(text)", `${data.server_speak?.auto_text_channel ? interaction.guild.channels.cache.get(data.server_speak?.auto_text_channel) || data.server_speak?.auto_text_channel : "未設定"}`],
            ["話者名", `${data.server_speak?.speakname ? data.server_speak?.speakname : "未設定(ずんだもん)"}`],
            ["話者ID", `${data.server_speak?.speakid ? data.server_speak?.speakid : "未設定(3)"}`],
            ["ピッチ", `${data.server_speak?.pitch ? data.server_speak?.pitch : "未設定(0)"}`],
            ["イントネーション", `${data.server_speak?.intonation ? data.server_speak?.intonation : "未設定(1)"}`],
            ["スピード", `${data.server_speak?.speed ? data.server_speak?.speed : "未設定(1)"}`],
            ["BOTの読み上げ", `${data.server_speak?.bot_read ? "読み上げる" : "読み上げない"}`],
            ["ユーザー名の読み上げ", `${data.server_speak?.read_username ? "読み上げる" : "読み上げない"}`],
            ["入退室の読み上げ", `${data.server_speak?.read_joinremove ? "読み上げる" : "読み上げない"}`],
            ["ボイス設定の強制", `${data.server_speak?.force_args ? "強制する" : "強制しない"}`],
            ["話者の強制", `${data.server_speak?.force_voice ? "強制する" : "強制しない"}`],
            ["exvoiceの有効化", `${data.server_speak?.exvoice ? "無効" : "未設定(有効)"}`],
            ["ユーザー名の辞書適応", `${data.server_speak?.dictionary_username ? "適応する" : "適応しない"}`],
            ["チャンネルにいないユーザーも読み上げるか", `${data.server_speak?.only_tts ? "読み上げる" : "読み上げない"}`],
            ["Discordのメッセージを読み上げるか", `${data.server_speak?.read_through ? "読み上げない" : "読み上げる"}`],
            ["優先的に読み上げるユーザー(bot)", `${data.read_user?.guildid ? "設定済み" : "未設定"}`],
            ["exvoiceの部分無効", `${data.exvoiceword?.guildid ? "設定済み" : "未設定"}`]
        ];
        
        const fieldData = [];
        normalFieldData.forEach((data) => fieldData.push({ name: data[0], value: data[1], inline: true }));
        fieldData.push({ name: "\u200b", value: ">> **スピークの設定** <<"});
        speakFieldData.forEach((data) => fieldData.push({ name: data[0], value: data[1], inline: true }));
        
        const embed = new CustomEmbed("show")
            .setTitle("サーバーの情報")
            .setDescription(`[サポートサーバー]https://discord.gg/Y6w5Jv3EAR`)
            .addFields(fieldData)
            .setColor(Colors.Green);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};