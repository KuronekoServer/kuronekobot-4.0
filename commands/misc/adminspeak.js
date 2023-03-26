//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require("node:fs");
const server_auto_join = require("./speak/server_auto-join");
const server_auto_join_delete = require("./speak/server_auto-join-delete");
const server_force_guild = require("./speak/server_force-guild");
const server_read_bot = require("./speak/server_read-bot");
const server_read = require("./speak/server_read");
const server_reset = require("./speak/server_reset");
const server_voice_setting = require("./speak/server_voice-setting");
const server_voice = require("./speak/server_voice");
const server_exvoice = require("./speak/server_exvoice");
const server_exvoice_word = require("./speak/server_exvoice-word");
const server_vc_only_tts = require("./speak/server_vc-only-tts");
const dictionary_username = require("./speak/dictionary_username");
const server_read_user = require("./speak/server_read-user");
const read_through = require("./speak/read_through");
let response;
let exvoice_list = [];
fs.readdirSync(`${process.env.exvoice}`).map(data => {
    exvoice_list.push(...fs.readdirSync(`${process.env.exvoice}/${data}`).map(name => ({ name: `${name.replace(".wav", "")}(${data})`, value: `${name.replace(".wav", "")},${data}` })));
});
module.exports = {
    data: new SlashCommandBuilder()
        .setName('adminspeak')
        .setDescription('読み上げ関係のコマンド')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_read-user')
                .setDescription("読み上げを行うユーザーの設定をします")
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
                .setDescription('自動で読み上げチャンネルに入室する。')
                .addChannelOption(option => option.addChannelTypes(ChannelType.GuildText).setName("textchannel").setDescription("読み上げを行うチャンネル").setRequired(true))
                .addChannelOption(option => option.addChannelTypes(ChannelType.GuildVoice).setName("voicechannel").setDescription("読み上げを行うチャンネル").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_auto-join-delete')
                .setDescription('自動で読み上げチャンネルに入室しない。')
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
                .setDescription('サーバー設定初期化')

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server_exvoice-word')
                .addStringOption(option => option.setName("select").setDescription("単語の操作").addChoices({ name: "追加", value: "add" }, { name: "削除", value: "remove" }, { name: "除外リスト", value: "removelist" }, { name: "一覧", value: "list" }).setRequired(true))
                .addStringOption(option => option.setName("話者").setDescription("話者の選択").setAutocomplete(true).setRequired(true))
                .setDescription('読み上げないexvoiceの追加。')

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
                .setName('read_through')
                .addStringOption(option => option.setName("toggle").setDescription("読み上げるかどうか").addChoices({ name: "読み上げる", value: "false" }, { name: "読み上げない", value: "true" }).setRequired(true))
                .setDescription('Discordのメッセージを読み上げるかどうか。')
        ),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        await interaction.respond(exvoice_list.filter(data => data.name.startsWith(focusedValue))).catch(() => { });
    },
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //server_voice
        if (sub === "server_voice") {
            response = await server_voice(interaction);
            return await interaction.reply(response);
        };
        await interaction.deferReply();
        //server_read-user
        if (sub === "server_read-user") {
            response = await server_read_user(interaction);
        };
        //server_read-bot
        if (sub === "server_read-bot") {
            response = await server_read_bot(interaction);
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
        //server_exvoice-word
        if (sub === "server_exvoice-word") {
            response = await server_exvoice_word(interaction);
        };
        //server_vc-only-tts
        if (sub === "server_vc-only-tts") {
            response = await server_vc_only_tts(interaction);
        };
        //dictionary_username
        if (sub === "dictionary_username") {
            response = await dictionary_username(interaction);
        };
        //read_through
        if (sub === "read_through") {
            response = await read_through(interaction);
        };
        //server_auto-join-delete
        if (sub === "server_auto-join-delete") {
            response = await server_auto_join_delete(interaction);
        };
        if (response === "exception") return;
        if (response) return await interaction.followUp(response);
        await interaction.deleteReply();
    },
};
