const { SlashCommandBuilder } = require('discord.js');
const create = require("./poll/create");
const excreate = require("./poll/excreate");
const sum = require("./poll/sum");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("アンケートを実施する")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("アンケートを作成します")
                .addStringOption(
                    option => option
                        .setName("title")
                        .setDescription("タイトル").setRequired(true))
                .addStringOption(
                    option => option
                        .setName("choice1")
                        .setDescription("選択肢1").setRequired(true))
                .addStringOption(
                    option => option
                        .setName("emoji1")
                        .setDescription("絵文字1"))
                .addStringOption(
                    option => option
                        .setName("choice2")
                        .setDescription("選択肢2"))
                .addStringOption(
                    option => option
                        .setName("emoji2")
                        .setDescription("絵文字2"))
                .addStringOption(
                    option => option
                        .setName("choice3")
                        .setDescription("選択肢3"))
                .addStringOption(
                    option => option
                        .setName("emoji3")
                        .setDescription("絵文字3"))
                .addStringOption(
                    option => option
                        .setName("choice4")
                        .setDescription("選択肢4"))
                .addStringOption(
                    option => option
                        .setName("emoji4")
                        .setDescription("絵文字4"))
                .addStringOption(
                    option => option
                        .setName("choice5")
                        .setDescription("選択肢5"))
                .addStringOption(
                    option => option
                        .setName("emoji5")
                        .setDescription("絵文字5"))
                .addStringOption(
                    option => option
                        .setName("choice6")
                        .setDescription("選択肢6"))
                .addStringOption(
                    option => option
                        .setName("emoji6")
                        .setDescription("絵文字6"))
                .addStringOption(
                    option => option
                        .setName("choice7")
                        .setDescription("選択肢7"))
                .addStringOption(
                    option => option
                        .setName("emoji7")
                        .setDescription("絵文字7"))
                .addStringOption(
                    option => option
                        .setName("choice8")
                        .setDescription("選択肢8"))
                .addStringOption(
                    option => option
                        .setName("emoji8")
                        .setDescription("絵文字8"))
                .addStringOption(
                    option => option
                        .setName("choice9")
                        .setDescription("選択肢9"))
                .addStringOption(
                    option => option
                        .setName("emoji9")
                        .setDescription("絵文字9"))
                .addStringOption(
                    option => option
                        .setName("choice10")
                        .setDescription("選択肢10"))
                .addStringOption(
                    option => option
                        .setName("emoji10")
                        .setDescription("絵文字10"))
                .addAttachmentOption(option => option.setName("image").setDescription("表示したい画像"))
                .addStringOption(option => option.setName("color").setDescription("色を決められます").setChoices(
                    { name: "赤色", value: "Red" },
                    { name: "白色", value: "White" },
                    { name: "水色", value: "Aqua" },
                    { name: "緑色", value: "Green" },
                    { name: "青色", value: "Blue" },
                    { name: "黄色", value: "Yellow" },
                    { name: "蛍光ピンク色", value: "LuminousVividPink" },
                    { name: "紫色", value: "Purple" },
                    { name: "赤紫色", value: "Fuchsia" },
                    { name: "金色", value: "Gold" },
                    { name: "オレンジ色", value: "Orange" },
                    { name: "灰色", value: "Grey" },
                    { name: "濃紺色", value: "Navy" },
                    { name: "濃い水色", value: "DarkAqua" },
                    { name: "濃い緑色", value: "DarkGreen" },
                    { name: "濃い青色", value: "DarkBlue" },
                    { name: "濃い紫色", value: "DarkPurple" },
                    { name: "濃い蛍光ピンク色", value: "DarkVividPink" },
                    { name: "濃い金色", value: "DarkGold" },
                    { name: "濃いオレンジ色", value: "DarkOrange" },
                    { name: "濃い赤色", value: "DarkRed" },
                    { name: "濃い灰色", value: "DarkGrey" },
                    { name: "明るい灰色", value: "LightGrey" },
                    { name: "濃い紺色", value: "DarkNavy" },
                    { name: "青紫色", value: "Blurple" }
                )))
        .addSubcommand(subcommand =>
            subcommand
                .setName("excreate")
                .setDescription("一人一つの投票にします")
                .addStringOption(
                    option => option
                        .setName("title")
                        .setDescription("タイトル").setRequired(true))
                .addStringOption(
                    option => option
                        .setName("choice1")
                        .setDescription("選択肢1").setRequired(true))
                .addStringOption(
                    option => option
                        .setName("emoji1")
                        .setDescription("絵文字1"))
                .addStringOption(
                    option => option
                        .setName("choice2")
                        .setDescription("選択肢2"))
                .addStringOption(
                    option => option
                        .setName("emoji2")
                        .setDescription("絵文字2"))
                .addStringOption(
                    option => option
                        .setName("choice3")
                        .setDescription("選択肢3"))
                .addStringOption(
                    option => option
                        .setName("emoji3")
                        .setDescription("絵文字3"))
                .addStringOption(
                    option => option
                        .setName("choice4")
                        .setDescription("選択肢4"))
                .addStringOption(
                    option => option
                        .setName("emoji4")
                        .setDescription("絵文字4"))
                .addStringOption(
                    option => option
                        .setName("choice5")
                        .setDescription("選択肢5"))
                .addStringOption(
                    option => option
                        .setName("emoji5")
                        .setDescription("絵文字5"))
                .addStringOption(
                    option => option
                        .setName("choice6")
                        .setDescription("選択肢6"))
                .addStringOption(
                    option => option
                        .setName("emoji6")
                        .setDescription("絵文字6"))
                .addStringOption(
                    option => option
                        .setName("choice7")
                        .setDescription("選択肢7"))
                .addStringOption(
                    option => option
                        .setName("emoji7")
                        .setDescription("絵文字7"))
                .addStringOption(
                    option => option
                        .setName("choice8")
                        .setDescription("選択肢8"))
                .addStringOption(
                    option => option
                        .setName("emoji8")
                        .setDescription("絵文字8"))
                .addStringOption(
                    option => option
                        .setName("choice9")
                        .setDescription("選択肢9"))
                .addStringOption(
                    option => option
                        .setName("emoji9")
                        .setDescription("絵文字9"))
                .addStringOption(
                    option => option
                        .setName("choice10")
                        .setDescription("選択肢10"))
                .addStringOption(
                    option => option
                        .setName("emoji10")
                        .setDescription("絵文字10"))
                .addAttachmentOption(option => option.setName("image").setDescription("表示したい画像"))
                .addStringOption(option => option.setName("color").setDescription("色を決められます").setChoices(
                    { name: "赤色", value: "Red" },
                    { name: "白色", value: "White" },
                    { name: "水色", value: "Aqua" },
                    { name: "緑色", value: "Green" },
                    { name: "青色", value: "Blue" },
                    { name: "黄色", value: "Yellow" },
                    { name: "蛍光ピンク色", value: "LuminousVividPink" },
                    { name: "紫色", value: "Purple" },
                    { name: "赤紫色", value: "Fuchsia" },
                    { name: "金色", value: "Gold" },
                    { name: "オレンジ色", value: "Orange" },
                    { name: "灰色", value: "Grey" },
                    { name: "濃紺色", value: "Navy" },
                    { name: "濃い水色", value: "DarkAqua" },
                    { name: "濃い緑色", value: "DarkGreen" },
                    { name: "濃い青色", value: "DarkBlue" },
                    { name: "濃い紫色", value: "DarkPurple" },
                    { name: "濃い蛍光ピンク色", value: "DarkVividPink" },
                    { name: "濃い金色", value: "DarkGold" },
                    { name: "濃いオレンジ色", value: "DarkOrange" },
                    { name: "濃い赤色", value: "DarkRed" },
                    { name: "濃い灰色", value: "DarkGrey" },
                    { name: "明るい灰色", value: "LightGrey" },
                    { name: "濃い紺色", value: "DarkNavy" },
                    { name: "青紫色", value: "Blurple" }
                ))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("sum")
                .addStringOption(option => option.setName("messageid").setDescription("対象のメッセージID").setRequired(true))
                .addStringOption(option => option.setName("channelid").setDescription("対象のチャンネルID"))
                .setDescription("集計します")
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //create
        if (sub === "create") {
            await create(interaction);
        };
        //excreate
        if (sub === "excreate") {
            await excreate(interaction);
        };
        //sum
        if (sub === "sum") {
            await sum(interaction);
        };
    }
}