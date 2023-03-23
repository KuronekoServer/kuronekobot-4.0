const { SlashCommandBuilder } = require('discord.js');
const reserve = require("./miscellaneous/reserve");
const screenshot = require("./miscellaneous/screenshot");
const serverinfo = require("./miscellaneous/serverinfo");
const userinfo = require("./miscellaneous/userinfo");
const wikipedia = require("./miscellaneous/wikipedia");
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
                        .setRequired(true))),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //reserve
        if (sub === "reserve") {
            response = await reserve(interaction);
        };
        //screenshot
        if (sub === "screenshot") {
            response = await screenshot(interaction);
        };
        //server-info
        if (sub === "server-info") {
            response = await serverinfo(interaction);
        };
        //user-info
        if (sub === "user-info") {
            response = await userinfo(interaction);
        };
        //wikipedia
        if (sub === "wikipedia") {
            response = await wikipedia(interaction);
        };
    },
};
