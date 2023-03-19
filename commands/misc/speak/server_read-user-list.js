const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { PagesManager } = require('discord.js-pages');
const pagesManager = new PagesManager();
const undefiend_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データが見つかりませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from read_user where guildid="${interaction.guild.id}";`);
    if (getdata[0]?.guildid) {
        const list = getdata.map(data => `${interaction.guild.members.cache.get(data.userid) || userid}:${(data.readmsg === 1) ? "読み上げる" : "読み上げない"}`);
        const maxcontent = 10;
        const pages = Math.ceil(list.length / maxcontent);
        const content = [...Array(pages)].map((_, index) => new EmbedBuilder().setDescription(list.slice(maxcontent * ((index + 1) - 1), maxcontent * (index + 1)).join("\n")));
        pagesManager.middleware(interaction);
        await interaction.pagesBuilder()
            .setTitle('読み上げを行わないユーザー一覧')
            .setPages(content)
            .setColor('Green')
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
            .setPaginationFormat()
            .build();
        return "exception";
    } else return ({ embeds: [undefiend_error] });
};