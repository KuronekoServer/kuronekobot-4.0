const { Events, ChannelType } = require('discord.js');
const admin = require("../../admin.json");
const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../helpers/utils");
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
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
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.type === ChannelType.DM) return;
        if (admin.includes(message.author.id)) {
            if (message.content.startsWith("k!dictionaryadd")) {
                const before = message.content.split(" ")[1];
                const after = message.content.split(" ")[2];
                if (before?.includes('"')) return message.channel.send({ embeds: [quotation] });
                if (after?.includes('"')) return message.channel.send({ embeds: [quotation] });
                if (before.length + after.length > 20) return ({ embeds: [size_error] });
                const getdata = await sql(`select * from globaldictionary where before_text="${before}";`);
                if (getdata[0]?.before_text) {
                    const set = await sql(`update globaldictionary set after_text="${after}" where before_text="${before}";`);
                    if (!set) return ({ embeds: [db_error] });
                } else {
                    const set = await sql(`INSERT INTO globaldictionary(before_text,after_text) VALUES ("${before}","${after}");`);
                    if (!set) return message.channel.send({ embeds: [db_error] });
                };
                const success = new EmbedBuilder()
                    .setTitle(`✅完了`)
                    .setDescription(`global辞書を更新しました！\n単語:${before}\n読み:${after}`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
                    .setColor(Colors.Green);
                await message.channel.send({ embeds: [success] });
            };
            if (message.content.startsWith("k!dictionaryremove")) {
                console.log(1)
                const delete_text = message.content.split(" ")[1];
                if (delete_text?.includes('"')) return message.channel.send({ embeds: [quotation] });
                const getdata = await sql(`select * from globaldictionary where before_text="${delete_text}";`);
                if (getdata[0]?.before_text) {
                    const set = await sql(`DELETE FROM globaldictionary WHERE before_text="${delete_text}";`);
                    if (!set) return message.channel.send({ embeds: [db_error] });
                } else return message.channel.send({ embeds: [db_error] });
                const success = new EmbedBuilder()
                    .setTitle(`✅完了`)
                    .setDescription(`辞書を削除しました！\n単語:${delete_text}`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
                    .setColor(Colors.Green);
                return message.channel.send({ embeds: [success] });
            }
        };
    }
};