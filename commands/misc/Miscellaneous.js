const { SlashCommandBuilder } = require('discord.js');
const reserve = require("./miscellaneous/reserve");
const screenshot = require("./miscellaneous/screenshot");
const serverinfo = require("./miscellaneous/serverinfo");
const userinfo = require("./miscellaneous/userinfo");
const wikipedia = require("./miscellaneous/wikipedia");
const role = require("./miscellaneous/role");
const channel = require("./miscellaneous/channel");
const translate = require("./miscellaneous/translate");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('miscellaneous')
        .setDescription('その他のコマンド')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('reserve')
                .addIntegerOption(option => option.setName("secound").setDescription("送りたい秒数").setRequired(true).setMinValue(1).setMaxValue(1000))
                .addStringOption(option => option.setName("content").setDescription("送りたいメッセージ").setRequired(true))
                .setDescription('指定した時間後にメッセージを送信します'))
        .addSubcommand(subcommand =>
            subcommand
                .setName("screenshot")
                .setDescription("Webサイトをスクリーンショットする")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("スクリーンショット撮りたいWebサイトのURL")
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server-info')
                .setDescription('サーバー情報を取得します'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user-info')
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription('調べたいユーザー'))
                .setDescription('ユーザー情報を表示します'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('wikipedia')
                .setDescription('Wikipediaで何かを調べる')
                .addStringOption(option =>
                    option.setName("query")
                        .setDescription('検索項目')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription('ロールの指定'))
                .setDescription('ロールの情報を表示'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription('チャンネルの指定'))
                .setDescription('チャンネルの情報を表示'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('translate')
                .setDescription('コンテンツの言語を翻訳')
                .addStringOption(option => option.setName("content").setDescription("コンテンツを入力").setRequired(true))
                .addStringOption(option => option.setName("to").setDescription('言語の指定')
                    .setAutocomplete(true))),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = Object.keys(require("../../data.json").GOOGLE_TRANSLATE).filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(filtered.map((value, index) => ({ name: Object.values(require("../../data.json").GOOGLE_TRANSLATE)[index], value: value }))).catch(() => { });
    },
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //reserve
        if (sub === "reserve") {
            await reserve(interaction);
        };
        //screenshot
        if (sub === "screenshot") {
            await screenshot(interaction);
        };
        //server-info
        if (sub === "server-info") {
            await serverinfo(interaction);
        };
        //user-info
        if (sub === "user-info") {
            await userinfo(interaction);
        };
        //wikipedia
        if (sub === "wikipedia") {
            await wikipedia(interaction);
        };
        //role
        if (sub === "role") {
            await role(interaction);
        };
        //channel
        if (sub === "channel") {
            await channel(interaction);
        };
        //translate
        if (sub === "translate") {
            await translate(interaction);
        };
    },
};
