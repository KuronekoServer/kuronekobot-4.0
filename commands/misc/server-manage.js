const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ban = require("./server-manage/ban");
const kick = require("./server-manage/kick");
const unban = require("./server-manage/unban");
const clear = require("./server-manage/clear");
const mute = require("./server-manage/mute");
const unmute = require("./server-manage/unmute");
const show = require("./server-manage/show");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-manage")
        .setDescription("サーバー管理系")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName("ban")
                .setDescription("ユーザーをBANします")
                .addUserOption(option => option.setName("member").setDescription("指定したユーザーをBANします").setRequired(true))
                .addIntegerOption(option => option.setName("day").setDescription("特定の期間BANします(日)").setMinValue(1))
                .addStringOption(option => option.setName("理由").setDescription("BAN理由を書いてください"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("kick")
                .setDescription("ユーザーをkickします")
                .addUserOption(option => option.setName("member").setDescription("指定したユーザーをkickします").setRequired(true))
                .addStringOption(option => option.setName("理由").setDescription("kick理由を書いてください"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("unban")
                .setDescription("ユーザーのBANを解除します")
                .addStringOption(option => option.setName("memberid").setDescription("指定したユーザーのBANを解除します").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("clear")
                .setDescription("指定の数のメッセージを削除します")
                .addIntegerOption(option => option.setName("message").setDescription("1～300まで　0はすべて削除").setRequired(true).setMaxValue(300).setMinValue(0))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("mute")
                .setDescription("指定したユーザーをミュートにします")
                .addUserOption(option => option.setName("member").setDescription("ユーザーを指定してください").setRequired(true))
                .addIntegerOption(option => option.setName("time").setDescription("秒").setRequired(true).setMinValue(1))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("unmute")
                .addUserOption(option => option.setName("member").setDescription("ユーザーを指定してください").setRequired(true))
                .setDescription("指定したユーザーのミュートを解除")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("show")
                .setDescription("設定の表示")
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //ban
        if (sub === "ban") {
            await ban(interaction);
        };
        //kick
        if (sub === "kick") {
            await kick(interaction);
        };
        //unban
        if (sub === "unban") {
            await unban(interaction);
        };
        //clear
        if (sub === "clear") {
            await clear(interaction);
        };
        //mute
        if (sub === "mute") {
            await mute(interaction);
        };
        //unmute
        if (sub === "ummute") {
            await unmute(interaction);
        };
        //show
        if (sub === "show") {
            await show(interaction);
        };
    }
}