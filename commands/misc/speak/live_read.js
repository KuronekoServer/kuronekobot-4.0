const { EmbedBuilder, Colors } = require("discord.js");
const { read } = require("../../../helpers/read");
const tw = require('twitch-webchat');
const { LiveChat } = require("youtube-chat")
const nojoin_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("BOTがボイスチャンネルに参加していません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const undefined_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("ボイスチャンネルのデータが取得できません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("貴方と参加しているボイスチャンネルが違います。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const already_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("すでに再生済みです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const noalready_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("何も再生していません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const nourl_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("URLが指定されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`接続されました。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const stop_success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`切断されました。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const vi_undefined_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("動画が見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    if (!interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [nojoin_error] });
    if (!globalThis.voice_channel[interaction.guild.id]) return ({ embeds: [undefined_error] });
    if (interaction.member?.voice?.channel?.id !== interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [error] });
    const ope = interaction.options.getString("操作");
    const select = interaction.options.getString("select");
    const id = interaction.options.getString("url")?.replace("https://www.twitch.tv/", "")?.replace("https://youtu.be/", "")?.replace("https://www.youtube.com/watch?v=", "");
    if (select === "youtube") {
        if (ope === "start") {
            if (!id) return ({ embeds: [nourl_error] });
            if (globalThis.ylivechat[interaction.guild.id]) return ({ embeds: [already_error] });
            globalThis.ylivechat[interaction.guild.id] = new LiveChat({ liveId: id });
            const check = await globalThis.ylivechat[interaction.guild.id]?.start().catch(ex => { });
            if (!check) {
                await read(interaction, "system", "youtubeのデータ取得中にエラーが発生しました　取得を停止します");
                await globalThis.ylivechat[interaction.guild.id]?.stop();
                delete globalThis.ylivechat[interaction.guild.id];
                return ({ embeds: [vi_undefined_error] });
            } else {
                globalThis.ylivechat[interaction.guild.id]?.on("chat", async (chatItem) => {
                    if (!chatItem.message?.join("")?.text) return;
                    await read(interaction, chatItem.author.name || "取得できませんでした", chatItem.message?.join("")?.text || "取得できませんでした");
                });
                return ({ embeds: [success] });
            };
        };
        if (ope === "stop") {
            if (!globalThis.ylivechat[interaction.guild.id]) return ({ embeds: [noalready_error] });
            await globalThis.ylivechat[interaction.guild.id]?.stop();
            delete globalThis.ylivechat[interaction.guild.id];
            return ({ embeds: [stop_success] });
        };
    };
    if (select === "twitch") {
        if (ope === "start") {
            if (!id) return ({ embeds: [nourl_error] });
            if (globalThis.tlivechat[interaction.guild.id]) return ({ embeds: [already_error] });
            globalThis.tlivechat[interaction.guild.id] = tw.start(id, async (err, message) => {
                if (err) {
                    await read(interaction, "system", "ツイッチのデータ取得中にエラーが発生しました　取得を停止します");
                    delete globalThis.tlivechat[interaction.guild.id];
                    return;
                };
                if (message.type === "chat") await read(interaction, message.from || "取得できませんでした", message.text || "取得できませんでした");
            });
            return ({ embeds: [success] });
        };
        if (ope === "stop") {
            if (!globalThis.tlivechat[interaction.guild.id]) return ({ embeds: [noalready_error] });
            await globalThis.tlivechat[interaction.guild.id].kill();
            delete globalThis.tlivechat[interaction.guild.id];
            return ({ embeds: [stop_success] });
        };
    };
};