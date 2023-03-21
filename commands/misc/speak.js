//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const { SlashCommandBuilder, ChannelType } = require('discord.js');
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
const server_auto_join = require("./speak/server_auto-join");
const server_force_guild = require("./speak/server_force-guild");
const server_read_bot = require("./speak/server_read-bot");
const server_read = require("./speak/server_read");
const server_read_user = require("./speak/server_read-user");
const server_user_dictionary_list = require("./speak/server_user-dictionary-list");
const server_reset = require("./speak/server_reset");
const user_reset = require("./speak/user_reset");
const server_voice_setting = require("./speak/server_voice-setting");
const server_voice = require("./speak/server_voice");
const server_exvoice = require("./speak/server_exvoice");
const server_exvoice_word = require("./speak/server_exvoice-word");
const server_vc_only_tts = require("./speak/server_vc-only-tts");
const setting_show = require("./speak/setting-show");
const dictionary_username = require("./speak/dictionary_username");
const live_read = require("./speak/live_read");
const skip = require("./speak/skip");
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
                .setName('server_read-user')
                .setDescription("読み上げを行うユーザーの設定をします(ほかの物より優先されます)")
                .addUserOption(option => option.setName("user").setDescription("読み上げるユーザーの設定").setRequired(true))
                .addStringOption(option => option.setName("toggle").setDescription("操作を選んでください").addChoices({ name: "読み上げる", value: "true" }, { name: "読み上げない", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_read-bot')
                .setDescription("BOTの読み上げを許可するか決めます")
                .addStringOption(option => option.setName("toggle").setDescription("BOTの読み上げを許可するか").addChoices({ name: "許可", value: "true" }, { name: "禁止", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_voice')
                .addStringOption(option => option.setName("voicevox話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/voicevoxlist.json")))
                .addStringOption(option => option.setName("coeiroink話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/coeiroinklist.json")))
                .addStringOption(option => option.setName("sharevox話者名").setDescription("話者を選択してください").addChoices(...require("../../helpers/voicelist/sharevoxlist.json")))
                .setDescription('サーバー話者を変更します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_voice-setting')
                .setDescription('サーバー各種voice設定をします。')
                .addStringOption(option => option.setName("args").setDescription("変更する項目を選択してください。").addChoices({ name: "pitch", value: "pitch" }, { name: "intonation", value: "intonation" }, { name: "speed", value: "speed" }).setRequired(true))
                .addNumberOption(option => option.setName("number").setDescription("数値を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_force-guild')
                .setDescription('サーバー設定を強制するかどうか。')
                .addStringOption(option => option.setName("choice").setDescription("どちらかを選択してください").addChoices({ name: "voice", value: "voice" }, { name: "その他の設定", value: "args" }).setRequired(true))
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "強制する", value: "true" }, { name: "強制しない", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_read')
                .setDescription('入退室時にユーザーを読み上げるか。')
                .addStringOption(option => option.setName("操作").setDescription("入退出時かメッセージユーザー名を読み上げるか").addChoices({ name: "メッセージユーザー名を読み上げる", value: "message" }, { name: "入退出時にユーザーを読み上げる", value: "join" }).setRequired(true))
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "読み上げる", value: "true" }, { name: "読み上げない", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_auto-join')
                .setDescription('自動で読み上げを行う。')
                .addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("textchannel").setDescription("読み上げを行うチャンネル").setRequired(true))
                .addChannelOption(option => option.addChannelTypes(ChannelType.GuildVoice).setName("voicechannel").setDescription("読み上げを行うチャンネル").setRequired(true))
                .addStringOption(option => option.setName("toggle").setDescription("削除したい場合は選択してください").addChoices({ name: "削除", value: "削除" }))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_exvoice')
                .setDescription('exvoiceの操作。')
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "読み上げる", value: "true" }, { name: "読み上げない", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_reset')
                .setDescription('初期化')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_reset')
                .setDescription('初期化')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_exvoice-word')
                .addStringOption(option => option.setName("select").setDescription("単語の操作").addChoices({ name: "追加", value: "add" }, { name: "削除", value: "remove" }, { name: "除外リスト", value: "removelist" }, { name: "一覧", value: "list" }).setRequired(true))
                .addStringOption(option => option.setName("話者").setDescription("話者の選択").addChoices(...exvoice_list).setRequired(true))
                .setDescription('ユーザー設定の初期化。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setting_show')
                .addStringOption(option => option.setName("select").setDescription("対象の選択").addChoices({ name: "server", value: "server" }, { name: "user", value: "user" }).setRequired(true))
                .setDescription('設定の表示。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_vc-only-tts')
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "ボイスチャンネル外のユーザーを読み上げない", value: "false" }, { name: "ボイスチャンネル外のユーザーを読み上げる", value: "true" }).setRequired(true))
                .setDescription('ボイスチャンネル外のユーザー設定。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dictionary_username')
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "ユーザー名に辞書を有効にする", value: "true" }, { name: "ユーザー名に辞書を無効にする", value: "false" }).setRequired(true))
                .setDescription('ユーザー名に辞書を適応するか。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('live_read')
                .addStringOption(option => option.setName("select").setDescription("選択してください").addChoices({ name: "youtube", value: "youtube" }, { name: "twitch", value: "twitch" }).setRequired(true))
                .addStringOption(option => option.setName("操作").setDescription("選択してください").addChoices({ name: "スタート", value: "start" }, { name: "ストップ", value: "stop" }).setRequired(true))
                .addStringOption(option => option.setName("url").setDescription("LIVEのURLを入力"))
                .setDescription('ライブの読み上げ。')
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });
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
        //user_voice
        if (sub === "user_voice") {
            response = await user_voice(interaction);
        };
        //server_read-user
        if (sub === "server_read-user") {
            response = await server_read_user(interaction);
        };
        //server_user-dictionary-list
        if (sub === "server_user-dictionary-list") {
            response = await server_user_dictionary_list(interaction);
        };
        //server_read-bot
        if (sub === "server_read-bot") {
            response = await server_read_bot(interaction);
        };
        //server_voice
        if (sub === "server_voice") {
            response = await server_voice(interaction);
        };
        //server_voice-setting
        if (sub === "server_voice-setting") {
            response = await server_voice_setting(interaction);
        };
        //server_force-guild-voice
        if (sub === "server_force-guild") {
            response = await server_force_guild(interaction);
        };
        //server_read
        if (sub === "server_read") {
            response = await server_read(interaction);
        };
        //server_auto-join
        if (sub === "server_auto-join") {
            response = await server_auto_join(interaction);
        };
        //server_exvoice
        if (sub === "server_exvoice") {
            response = await server_exvoice(interaction);
        };
        //server_reset
        if (sub === "server_reset") {
            response = await server_reset(interaction);
        };
        //user_reset
        if (sub === "user_reset") {
            response = await user_reset(interaction);
        };
        //server_exvoice-word
        if (sub === "server_exvoice-word") {
            response = await server_exvoice_word(interaction);
        };
        //setting_show
        if (sub === "setting_show") {
            response = await setting_show(interaction);
        };
        //server_vc-only-tts
        if (sub === "server_vc-only-tts") {
            response = await server_vc_only_tts(interaction);
        };
        //dictionary_username
        if (sub === "dictionary_username") {
            response = await dictionary_username(interaction);
        };
        //live_read
        if (sub === "live_read") {
            response = await live_read(interaction);
        };
        //skip
        if (sub === "skip") {
            response = await skip(interaction);
        };
        if (response === "exception") return;
        if (response) return await interaction.followUp(response);
        await interaction.deleteReply();
    },
};
