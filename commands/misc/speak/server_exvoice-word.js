const { EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { PagesManager } = require('discord.js-pages');
const pagesManager = new PagesManager();
const fs = require("node:fs");
const exvoice_list = {};
fs.readdirSync(`${process.env.exvoice}`).map(data => {
    exvoice_list[data] = fs.readdirSync(`${process.env.exvoice}/${data}`).map(name => name.replace(".wav", ""));
});
const undefined_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データが見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const name = interaction.options.getString("話者");
    const select = interaction.options.getString("select");
    if (select === "add") {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${name}のexvoiceを選択してください！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('exvoice_add')
                    .setPlaceholder('選択されていません')
                    .setMinValues(1)
                    .setMaxValues(exvoice_list[name].length)
                    .addOptions(exvoice_list[name].map(text => ({ label: text, description: `${text}を選択します`, value: `${name},${text}` }))),
            );
        return ({ embeds: [success], components: [select] });
    };
    if (select === "remove") {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${name}のexvoiceを選択してください！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('exvoice_remove')
                    .setPlaceholder('選択されていません')
                    .setMinValues(1)
                    .setMaxValues(exvoice_list[name].length)
                    .addOptions(exvoice_list[name].map(text => ({ label: text, description: `${text}を選択します`, value: `${name},${text}` }))),
            );
        return ({ embeds: [success], components: [select] });
    };
    if (select === "list") {
        const getdata = await sql(`select * from exvoiceword where guildid="${interaction.guild.id}" and speakname="${name}";`);
        if (getdata[0]?.guildid) {
            const list = getdata.map(data => "```" + `${data.word}(${data.speakname})` + "```");
            const maxcontent = 10;
            const pages = Math.ceil(list.length / maxcontent);
            const content = [...Array(pages)].map((_, index) => new EmbedBuilder().setDescription(list.slice(maxcontent * ((index + 1) - 1), maxcontent * (index + 1)).join("\n")));
            pagesManager.middleware(interaction);
            await interaction.pagesBuilder()
                .setTitle('読み上げないテキスト一覧')
                .setPages(content)
                .setColor('Green')
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
                .setPaginationFormat()
                .build();
            return "exception";
        } else return ({ embeds: [undefined_error] });
    };
};