const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

module.exports = async (interaction) => {
    const ope = interaction.options.getString("select");
    if (ope === "server") {
        const data = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
        const embed = new EmbedBuilder()
            .setTitle('✅サーバー情報')
            .setColor(Colors.Green)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'webp', size: 4096 }) || "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png")
            .addFields(
                { name: '標準の話者', value: data[0][0]?.speakname || "ずんだもん", inline: true },
                { name: '標準のピッチ', value: data[0][0]?.pitch || "0", inline: true },
                { name: '標準のスピード', value: data[0][0]?.speed || "1", inline: true },
                { name: '標準のイントネーション', value: data[0][0]?.intonation || "1", inline: true },
                { name: '標準話者の強制', value: data[0][0]?.force_args ? "はい" : "いいえ", inline: true },
                { name: '標準設定の強制', value: data[0][0]?.force_voice ? "はい" : "いいえ", inline: true },
                { name: 'ユーザー名の読み上げ', value: data[0][0]?.read_username ? "はい" : "いいえ", inline: true },
                { name: '入退室の読み上げ', value: data[0][0]?.read_joinremove ? "はい" : "いいえ", inline: true },
                { name: 'ExVoiceの読み上げ', value: data[0][0]?.exvoice ? "いいえ" : "はい", inline: true },
                { name: 'Botの読み上げ', value: data[0][0]?.bot_read ? "はい" : "いいえ", inline: true },
                { name: 'ユーザー名への辞書適応', value: data[0][0]?.dictionary_username ? "はい" : "いいえ", inline: true },
                { name: '未参加のユーザー読み上げ', value: data[0][0]?.only_tts ? "はい" : "いいえ", inline: true },
                { name: 'Discordメッセージの読み上げない', value: data[0][0]?.read_through ? "はい" : "いいえ", inline: true },
                { name: '自動入室チャンネル', value: data[0][0]?.auto_voice_channel ? `${interaction.guild.channels.cache.get(data[0][0]?.auto_voice_channel) || "取得失敗"}=>${interaction.guild.channels.cache.get(data[0][0]?.auto_text_channel) || "取得失敗"}` : "なし", inline: true },
            )
            .setTimestamp(new Date())
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
        return ({ embeds: [embed] });
    };
    if (ope === "user") {
        const data = await sql(`select * from user_speak where userid="${interaction.user.id}";`);
        const embed = new EmbedBuilder()
            .setTitle('✅サーバー情報')
            .setColor(Colors.Green)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, format: "webp", size: 4096 }) || "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png")
            .addFields(
                { name: '標準の話者', value: data[0][0]?.speakname || "ずんだもん", inline: true },
                { name: '標準のピッチ', value: data[0][0]?.pitch || "0", inline: true },
                { name: '標準のスピード', value: data[0][0]?.speed || "1", inline: true },
                { name: '標準のイントネーション', value: data[0][0]?.intonation || "1", inline: true },
            )
            .setTimestamp(new Date())
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
        return ({ embeds: [embed] });
    };
};