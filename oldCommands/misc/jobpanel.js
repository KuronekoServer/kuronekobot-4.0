const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const choice = (
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
);
const add_panel = require("./jobpanel/add");
const copy_panel = require("./jobpanel/copy");
const create_panel = require("./jobpanel/create");
const delete_panel = require("./jobpanel/delete");
const edit_panel = require("./jobpanel/edit");
const refresh_panel = require("./jobpanel/refresh");
const remove_panel = require("./jobpanel/remove");
const selected_panel = require("./jobpanel/selected");
const autoremove_panel = require("./jobpanel/autoremove");

let response;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('jobpanel')
        .setDescription('役職パネル関係コマンド')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('新しいパネルを作成し、そのパネルを選択します。')
                .addRoleOption(option => option.setName("role").setDescription("最初に追加する役職").setRequired(true))
                .addStringOption(option => option.setName("emoji").setDescription("役職と対応させる絵文字"))
                .addStringOption(option => option.setName("color").setDescription("パネルの色").setChoices(choice))
                .addStringOption(option => option.setName("title").setDescription("パネルのタイトルを決められます"))
                .addAttachmentOption(option => option.setName("image").setDescription("パネルに添付する画像を決められます"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('copy')
                .setDescription('選択しているパネルをコピーします。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('選択したパネルを削除します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('パネルに役職を追加します。')
                .addRoleOption(option => option.setName("role1").setDescription("付与役職").setRequired(true))
                .addStringOption(option => option.setName("emoji1").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role2").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji2").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role3").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji3").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role4").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji4").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role5").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji5").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role6").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji6").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role7").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji7").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role8").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji8").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role9").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji9").setDescription("役職と対応させる絵文字"))
                .addRoleOption(option => option.setName("role10").setDescription("付与役職"))
                .addStringOption(option => option.setName("emoji10").setDescription("役職と対応させる絵文字"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('選択したパネルのタイトルやカラーを変更します。')
                .addStringOption(option => option.setName("title").setDescription("embedのタイトルを決められます"))
                .addStringOption(option => option.setName("color").setDescription("embedの色を決められます").setChoices(choice))
                .addStringOption(option => option.setName("attachmentoption").setDescription("添付画像ファイルを削除しますか？").addChoices({ name: "添付画像ファイルを削除する。", value: "true" }, { name: "添付画像ファイルを保持する", value: "false" }))
                .addAttachmentOption(option => option.setName("image").setDescription("embedに添付する画像を決められます"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .addRoleOption(option => option.setName("role1").setDescription("ロールを決めてください").setRequired(true))
                .addRoleOption(option => option.setName("role2").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role3").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role4").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role5").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role6").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role7").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role8").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role9").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role10").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role11").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role12").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role13").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role14").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role15").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role16").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role17").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role18").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role19").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role21").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role22").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role23").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role24").setDescription("ロールを決めてください"))
                .addRoleOption(option => option.setName("role25").setDescription("ロールを決めてください"))
                .setDescription('パネルから役職を削除します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('selected')
                .setDescription('現在選択しているパネルのリンクを返します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('refresh')
                .setDescription('選択したパネルのリアクションをつけ直します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('autoremove')
                .setDescription('選択しているパネルに含まれる削除されたロールを取り除きます。')
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });
        //create
        if (sub === "create") {
            response = await create_panel(interaction);
        };
        //copy
        if (sub === "copy") {
            response = await copy_panel(interaction);
        };
        //delete
        if (sub === "delete") {
            response = await delete_panel(interaction);
        };
        //add
        if (sub === "add") {
            response = await add_panel(interaction);
        };
        //edit
        if (sub === "edit") {
            response = await edit_panel(interaction);
        };
        //remove
        if (sub === "remove") {
            response = await remove_panel(interaction);
        };
        //selected
        if (sub === "selected") {
            response = await selected_panel(interaction);
        };
        //refresh
        if (sub === "refresh") {
            response = await refresh_panel(interaction);
        };
        //autoremove
        if (sub === "autoremove"){
            response = await autoremove_panel(interaction);
        };
            await interaction.followUp(response);
    },
};
