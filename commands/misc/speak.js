const { SlashCommandBuilder } = require('discord.js');
const fs = require("node:fs");
const join = require("./speak/join");
const disconnect = require("./speak/disconnect");
const dictionary_add = require("./speak/dictionary_add");
const dictionary_export = require("./speak/dictionary_export");
const dictionary_import = require("./speak/dictionary_import");
const dictionary_remove = require("./speak/dictionary_remove");
const dictionary_reset = require("./speak/dictionary_reset");
const user_voice = require("./speak/setvoice");
const user_voice_setting = require("./speak/user_voice-setting");
const server_user_dictionary_list = require("./speak/server_user-dictionary-list");
const user_reset = require("./speak/user_reset");
const live_read = require("./speak/live_read");
const skip = require("./speak/skip");
const setting_show = require("./speak/setting-show");
const live_read_stop = require("./speak/live_read_stop");
let response;
let exvoice_list = [];
fs.readdirSync(`${process.env.exvoice}`).map(data => {
    exvoice_list.push(...fs.readdirSync(`${process.env.exvoice}/${data}`).map(name => ({ name: `${name.replace(".wav", "")}(${data})`, value: `${name.replace(".wav", "")},${data}` })));
});
module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('読み上げ関係のコマンド')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('ボイスチャンネルに参加します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('読み上げをスキップします。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('disconnect')
                .setDescription('ボイスチャンネルから退出します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_voice')
                .addStringOption(option => option.setName("voicevox話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/voicevoxlist.json")))
                .addStringOption(option => option.setName("coeiroink話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/coeiroinklist.json")))
                .addStringOption(option => option.setName("sharevox話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/sharevoxlist.json")))
                .setDescription('話者を変更します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_voice-setting')
                .setDescription('ユーザーの各種voice設定をします。')
                .addStringOption(option => option.setName("args").setDescription("設定する項目を選択").addChoices({ name: "pitch", value: "pitch" }, { name: "speed", value: "speed" }, { name: "intonation", value: "intonation" }).setRequired(true))
                .addNumberOption(option => option.setName("number").setDescription("数値を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dictionary_add')
                .setDescription('辞書を設定します。')
                .addStringOption(option => option.setName("before").setDescription("変換前").setRequired(true))
                .addStringOption(option => option.setName("after").setDescription("変換後").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dictionary_remove')
                .setDescription('辞書を削除します。')
                .addStringOption(option => option.setName("delete").setDescription("言葉").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dictionary_export')
                .setDescription('辞書の内容をエクスポートします。')
                .addStringOption(option => option.setName("format").setDescription("形式を選択").addChoices({ name: "JSON", value: "json" }, { name: "colon", value: "colon" }, { name: "csv", value: "csv" }))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dictionary_import')
                .setDescription('辞書をインポートします。')
                .addAttachmentOption(option => option.setName("file").setDescription("json形式にしてください").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_user-dictionary-list')
                .addStringOption(option => option.setName("select").setDescription("選択してください").addChoices({ name: "user-read", value: "user" }, { name: "dictionary", value: "dictionary" }).setRequired(true))
                .setDescription("辞書の一覧又は読み上げないユーザーを表示します")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_reset')
                .setDescription('初期化')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setting_show')
                .addStringOption(option => option.setName("select").setDescription("対象の選択").addChoices({ name: "server", value: "server" }, { name: "user", value: "user" }).setRequired(true))
                .setDescription('設定の表示。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('live_read')
                .addStringOption(option => option.setName("select").setDescription("選択してください").addChoices({ name: "youtube", value: "youtube" }, { name: "twitch", value: "twitch" }).setRequired(true))
                .addStringOption(option => option.setName("url").setDescription("LIVEのURLを入力").setRequired(true))
                .setDescription('ライブの読み上げ。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('live_read-stop')
                .addStringOption(option => option.setName("select").setDescription("選択してください").addChoices({ name: "youtube", value: "youtube" }, { name: "twitch", value: "twitch" }).setRequired(true))
                .setDescription('ライブの読み上げを停止します。')
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //user_voice
        if (sub === "user_voice") {
            response = await user_voice(interaction);
            return await interaction.reply(response);
        };
        await interaction.deferReply();
        //join
        if (sub === "join") {
            response = await join(interaction);
        };
        //disconnect
        if (sub === "disconnect") {
            response = await disconnect(interaction);
        };
        //dictionary_add
        if (sub === "dictionary_add") {
            response = await dictionary_add(interaction);
        };
        //dictionary_remove
        if (sub === "dictionary_remove") {
            response = await dictionary_remove(interaction);
        };
        //dictionary_import
        if (sub === "dictionary_import") {
            response = await dictionary_import(interaction);
        };
        //dictionary_export
        if (sub === "dictionary_export") {
            response = await dictionary_export(interaction);
        };
        //dictionary_reset
        if (sub === "dictionary_reset") {
            response = await dictionary_reset(interaction);
        };
        //user_voice-setting
        if (sub === "user_voice-setting") {
            response = await user_voice_setting(interaction);
        };
        //server_user-dictionary-list
        if (sub === "server_user-dictionary-list") {
            response = await server_user_dictionary_list(interaction);
        };
        //user_reset
        if (sub === "user_reset") {
            response = await user_reset(interaction);
        };
        //live_read
        if (sub === "live_read") {
            response = await live_read(interaction);
        };
        //skip
        if (sub === "skip") {
            response = await skip(interaction);
        };
        //setting_show
        if (sub === "setting_show") {
            response = await setting_show(interaction);
        };
        //live_read-stop
        if (sub === "live_read-stop") {
            response = await live_read_stop(interaction);
        };
        if (response === "exception") return;
        if (response) return await interaction.followUp(response);
        await interaction.deleteReply();
    },
};
