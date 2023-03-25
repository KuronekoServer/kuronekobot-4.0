const { EmbedBuilder, Colors } = require('discord.js');
const { sql } = require("../../../helpers/utils");
module.exports = async (interaction) => {
    const ticketdata = await sql(`select * from ticket_channel where guildid="${interaction.guild.id}";`);
    const logdata = await sql(`select * from log_channel where guildid="${interaction.guild.id}";`);
    const jobpanel = await sql(`select * from job_message where guildid="${interaction.guild.id}";`);
    const dictionary = await sql(`select * from dictionary where guildid="${interaction.guild.id}";`);
    const server_speak = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    const read_user = await sql(`select * from read_user where guildid="${interaction.guild.id}";`);
    const exvoiceword = await sql(`select * from exvoiceword where guildid="${interaction.guild.id}";`);
    const embed = new EmbedBuilder()
        .setTitle(`✅サーバーの情報`)
        .addFields(
            { name: 'Ticketlogチャンネル', value: `${ticketdata[0]?.guildid ? interaction.guild.channels.cache.get(ticketdata[0]?.channelid) || ticketdata[0]?.channelid : "未設定"}` },
            { name: 'logチャンネル', value: `${logdata[0]?.guildid ? interaction.guild.channels.cache.get(logdata[0]?.channelid) || logdata[0]?.channelid : "未設定"}` },
            { name: '役職パネル', value: `${jobpanel[0]?.guildid ? `対象チャンネル:${interaction.guild.channels.cache.get(jobpanel[0]?.channelid) || logdata[0]?.channelid}\n対象メッセージ:[messagelink](https://discord.com/channels/${logdata[0]?.guildid}/${logdata[0]?.channelid}/${logdata[0]?.messageid})` : "未設定"}` },
            { name: '**スピーク関係**', value: "スピーク関係のデータ一覧" },
            { name: '辞書機能', value: `${dictionary[0]?.guildid ? "設定済み" : "未設定"}` },
            { name: '自動入室チャンネル(voice)', value: `${server_speak[0]?.auto_voice_channel ? interaction.guild.channels.cache.get(server_speak[0]?.auto_voice_channel) || server_speak[0]?.auto_voice_channel : "未設定"}` },
            { name: '自動入室チャンネル(text)', value: `${server_speak[0]?.auto_text_channel ? interaction.guild.channels.cache.get(server_speak[0]?.auto_text_channel) || server_speak[0]?.auto_text_channel : "未設定"}` },
            { name: '話者名', value: `${server_speak[0]?.speakname ? server_speak[0]?.speakname : "未設定(ずんだもん)"}` },
            { name: '話者ID', value: `${server_speak[0]?.speakid ? server_speak[0]?.speakid : "未設定(3)"}` },
            { name: 'ピッチ', value: `${server_speak[0]?.pitch ? server_speak[0]?.pitch : "未設定(0)"}` },
            { name: 'イントネーション', value: `${server_speak[0]?.intonation ? server_speak[0]?.intonation : "未設定(1)"}` },
            { name: 'イントネーション', value: `${server_speak[0]?.speed ? server_speak[0]?.speed : "未設定(1)"}` },
            { name: 'BOTの読み上げ', value: `${server_speak[0]?.bot_read ? "読み上げる" : "読み上げない"}` },
            { name: 'ユーザー名の読み上げ', value: `${server_speak[0]?.read_username ? "読み上げる" : "読み上げない"}` },
            { name: '入退室の読み上げ', value: `${server_speak[0]?.read_joinremove ? "読み上げる" : "読み上げない"}` },
            { name: 'ボイス設定の強制', value: `${server_speak[0]?.force_args ? "強制する" : "強制しない"}` },
            { name: '話者の強制', value: `${server_speak[0]?.force_voice ? "強制する" : "強制しない"}` },
            { name: 'exvoiceの有効化', value: `${server_speak[0]?.exvoice ? "無効" : "未設定(有効)"}` },
            { name: 'ユーザー名の辞書適応', value: `${server_speak[0]?.dictionary_username ? "適応する" : "適応しない"}` },
            { name: 'チャンネルにいないユーザーも読み上げるか', value: `${server_speak[0]?.only_tts ? "読み上げる" : "読み上げない"}` },
            { name: 'Discordのメッセージを読み上げるか', value: `${server_speak[0]?.read_through ? "読み上ない" : "読み上げる"}` },
            { name: '優先的に読み上げるユーザー(BOT)', value: `${read_user[0]?.guildid ? "設定済み" : "未設定"}` },
            { name: 'exvoiceの部分無効', value: `${exvoiceword[0]?.guildid ? "設定済み" : "未設定"}` },
            { name: 'サポートサーバー', value: `https://discord.gg/Y6w5Jv3EAR` }
        )
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | botinfo" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [embed], ephemeral: true });
};