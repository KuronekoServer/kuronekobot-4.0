//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const { SlashCommandBuilder } = require('discord.js');
const join = require("./speak/join");
const disconnect = require("./speak/disconnect");
const dictionary_add = require("./speak/dictionary_add");
const dictionary_export = require("./speak/dictionary_export");
const dictionary_import = require("./speak/dictionary_import");
const dictionary_list = require("./speak/dictionary_list");
const dictionary_remove = require("./speak/dictionary_remove");
const dictionary_reset = require("./speak/dictionary_reset");
const setvoice = require("./speak/setvoice");
const user_intonation = require("./speak/user_intonation");
const user_pitch = require("./speak/user_pitch");
const user_speed = require("./speak/user_speed");
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
                .setName('setvoice')
                .addStringOption(option => option.setName("voicevox話者名").setDescription("話者を選択してください").addChoices(... require("../../helpers/voicelist/voicevoxlist.json")))
                .addStringOption(option => option.setName("coeiroink話者名").setDescription("話者を選択してください").addChoices(... require("../../helpers/voicelist/coeiroinklist.json")))
                .addStringOption(option => option.setName("sharevox話者名").setDescription("話者を選択してください").addChoices(... require("../../helpers/voicelist/sharevoxlist.json")))
                .setDescription('話者を変更します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_pitch')
                .setDescription('ピッチを設定します。')
                .addNumberOption(option=>option.setName("pitch").setDescription("-0.15~0.15の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_intonation')
                .setDescription('イントネーションを設定します。')
                .addNumberOption(option=>option.setName("intonation").setDescription("0.0～2.0の間の数字を入力"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user_speed')
                .setDescription('スピードを設定します。')
                .addNumberOption(option=>option.setName("speed").setDescription("0.5～4.0の間の数字を入力"))
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
        //setvoice
        if (sub === "setvoice") {
            response = await setvoice(interaction);
        };
        await interaction.followUp(response);
    },
};
