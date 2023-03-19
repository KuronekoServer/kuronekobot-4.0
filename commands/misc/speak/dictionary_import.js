const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { getJson } = require("../../../helpers/HttpUtils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`インポートが完了しました!`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("ファイルフォーマットが無効です。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const quotation = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("単語削除にダブルクォーテーションがは使えません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const size_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("合わせて20文字以内になるようにしてください。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const { data } = await getJson(interaction.options.getAttachment("file").attachment);
    try {
        const json = JSON.parse(JSON.stringify(data));
        if (!json[0]?.before_text) return ({ embeds: [error] });
        if (!json[0]?.after_text) return ({ embeds: [error] });
        await Promise.all(json.map(async value => {
            if (!value?.before_text) return ({ embeds: [error] });
            if (!value?.after_text) return ({ embeds: [error] });
            if (value.after_text.includes('"')) return ({ embeds: [quotation], ephemeral: true });
            if (value.before_text.includes('"')) return ({ embeds: [quotation], ephemeral: true });
            if (value.before_text.length + value.after_text.length > 20) return ({ embeds: [size_error], ephemeral: true });
            const getdata = await sql(`select * from dictionary where guildid="${interaction.guild.id}" and before_text="${value.before_text}";`);
            if (getdata[0]?.guildid) {
                const set = await sql(`update dictionary set after_text="${value.after_text}" where guildid="${interaction.guild.id}" and before_text="${value.before_text}";`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            } else {
                const set = await sql(`INSERT INTO dictionary(guildid,before_text,after_text) VALUES ("${interaction.guild.id}","${value.before_text}","${value.after_text}");`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            };
        }));
        return ({ embeds: [success] });
    } catch (error) {
        return ({ embeds: [error] });
    };
};