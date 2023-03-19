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
const dictionary_list = require("./speak/dictionary_list");
const dictionary_remove = require("./speak/dictionary_remove");
const dictionary_reset = require("./speak/dictionary_reset");
const user_voice = require("./speak/setvoice");
const user_intonation = require("./speak/user_intonation");
const user_pitch = require("./speak/user_pitch");
const user_speed = require("./speak/user_speed");
const server_auto_join = require("./speak/server_auto-join");
const server_force_guild_args = require("./speak/server_force-guild-args");
const server_force_guild_voice = require("./speak/server_force-guild-voice");
const server_intonation = require("./speak/server_intonation");
const server_pitch = require("./speak/server_pitch");
const server_read_bot = require("./speak/server_read-bot");
const server_read = require("./speak/server_read");
const server_read_user = require("./speak/server_read-user");
const server_read_user_list = require("./speak/server_read-user-list");
const reset = require("./speak/reset");
const server_speed = require("./speak/server_speed");
const server_voice = require("./speak/server_voice");
const server_exvoice = require("./speak/server_exvoice");
const server_exvoice_word = require("./speak/server_exvoice-word");
let response;
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
                .setName('user_pitch')
                .setDescription('ピッチを設定します。')
                .addNumberOption(option => option.setName("pitch").setDescription("-0.15~0.15の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_intonation')
                .setDescription('イントネーションを設定します。')
                .addNumberOption(option => option.setName("intonation").setDescription("0.0～2.0の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_speed')
                .setDescription('スピードを設定します。')
                .addNumberOption(option => option.setName("speed").setDescription("0.5～4.0の間の数字を入力"))
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
                .setName('dictionary_list')
                .setDescription('辞書の一覧を表示します。')
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
                .setName('server_read-user-list')
                .setDescription("読み上げないユーザーを表示します")
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
                .setName('server_pitch')
                .setDescription('サーバーピッチを設定します。')
                .addNumberOption(option => option.setName("pitch").setDescription("-0.15~0.15の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_intonation')
                .setDescription('サーバーイントネーションを設定します。')
                .addNumberOption(option => option.setName("intonation").setDescription("0.0～2.0の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_speed')
                .setDescription('サーバースピードを設定します。')
                .addNumberOption(option => option.setName("speed").setDescription("0.5～4.0の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_force-guild-args')
                .setDescription('サーバー設定を強制するかどうか。')
                .addStringOption(option => option.setName("toggle").setDescription("選択してください").addChoices({ name: "強制する", value: "true" }, { name: "強制しない", value: "false" }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_force-guild-voice')
                .setDescription('サーバーの読み上げボイスを強制するかどうか。')
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
                .setName('reset')
                .addStringOption(option => option.setName("操作").setDescription("対象を選択してください").addChoices({ name: "serverを初期化", value: "server" }, { name: "userを初期化", value: "user" }).setRequired(true))
                .setDescription('初期化')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_exvoice-word')
                .addStringOption(option => option.setName("select").setDescription("単語の操作").addChoices({ name: "追加", value: "add" }, { name: "削除", value: "remove" },{name:"リスト",value:"list"}).setRequired(true))
                .addStringOption(option => option.setName("話者").setDescription("話者の選択").addChoices(...fs.readdirSync(`${process.env.exvoice}`).map(name => ({ name: name, value: name }))).setRequired(true))
                .setDescription('ユーザー設定の初期化。')
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
        //dictionary_list
        if (sub === "dictionary_list") {
            response = await dictionary_list(interaction);
        };
        //dictionary_reset
        if (sub === "dictionary_reset") {
            response = await dictionary_reset(interaction);
        };
        //user_speed 
        if (sub === "user_speed") {
            response = await user_speed(interaction);
        };
        //user_pitch  
        if (sub === "user_pitch") {
            response = await user_pitch(interaction);
        };
        //user_intonation
        if (sub === "user_intonation") {
            response = await user_intonation(interaction);
        };
        //user_voice
        if (sub === "user_voice") {
            response = await user_voice(interaction);
        };
        //server_read-user
        if (sub === "server_read-user") {
            response = await server_read_user(interaction);
        };
        //server_read-user-list
        if (sub === "server_read-user-list") {
            response = await server_read_user_list(interaction);
        };
        //server_read-bot
        if (sub === "server_read-bot") {
            response = await server_read_bot(interaction);
        };
        //server_voice
        if (sub === "server_voice") {
            response = await server_voice(interaction);
        };
        //server_pitch
        if (sub === "server_pitch") {
            response = await server_pitch(interaction);
        };
        //server_intonation
        if (sub === "server_intonation") {
            response = await server_intonation(interaction);
        };
        //server_speed
        if (sub === "server_speed") {
            response = await server_speed(interaction);
        };
        //server_force-guild-args
        if (sub === "server_force-guild-args") {
            response = await server_force_guild_args(interaction);
        };
        //server_force-guild-voice
        if (sub === "server_force-guild-voice") {
            response = await server_force_guild_voice(interaction);
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
        //reset
        if (sub === "reset") {
            response = await reset(interaction);
        };
        //server_exvoice-word
        if (sub === "server_exvoice-word") {
            response = await server_exvoice_word(interaction);
        };
        if (response === "exception") return;
        if (response) return await interaction.followUp(response);
        await interaction.deleteReply();
    },
};
