const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from user_speak where userid=${escape(interaction.user.id)};`);
    const select = interaction.options.getString("args");
    if (select === "intonation") {
        const intonation = interaction.options.getNumber("number");
        if (intonation) {
            const sizemax_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最高は2.0までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            const sizemin_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最低は0.0までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            if (intonation > 2) return ({ embeds: [sizemax_error] });
            if (intonation < 0) return ({ embeds: [sizemin_error] });
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set intonation=${escape(intonation)} where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,intonation) VALUES (${escape(interaction.user.id)},${escape(intonation)});`);
                if (!set) return ({ embeds: [db_error] });
            };
        } else {
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set intonation=null where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,intonation) VALUES (${escape(interaction.user.id)},null);`);
                if (!set) return ({ embeds: [db_error] });
            };
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("イントネーションを変更しました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
    if (select === "speed") {
        const speed = interaction.options.getNumber("number");
        if (speed) {
            const sizemax_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最高は4.0までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            const sizemin_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最低は0.5までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            if (speed > 4.0) return ({ embeds: [sizemax_error] });
            if (speed < 0.5) return ({ embeds: [sizemin_error] });
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set speed=${escape(speed)} where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,speed) VALUES (${escape(interaction.user.id)},${escape(speed)});`);
                if (!set) return ({ embeds: [db_error] });
            };
        } else {
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set speed=null where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,speed) VALUES (${escape(interaction.user.id)},null);`);
                if (!set) return ({ embeds: [db_error] });
            };
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("スピードを変更しました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
    if (select === "pitch") {
        const pitch = interaction.options.getNumber("number");
        if (pitch) {
            const sizemax_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最高は0.15までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            const sizemin_error = new EmbedBuilder()
                .setTitle("⚠エラー")
                .setDescription("最低は-0.15までです。")
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
            if (pitch > 0.15) return ({ embeds: [sizemax_error] });
            if (pitch < -0.15) return ({ embeds: [sizemin_error] });
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set pitch=${escape(pitch)} where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,pitch) VALUES (${escape(interaction.user.id)},${escape(pitch)});`);
                if (!set) return ({ embeds: [db_error] });
            };
        } else {
            if (getdata[0][0]?.userid) {
                const set = await sql(`update user_speak set pitch=null where userid=${escape(interaction.user.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO user_speak(userid,pitch) VALUES (${escape(interaction.user.id)},null);`);
                if (!set) return ({ embeds: [db_error] });
            };
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("ピッチを変更しました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
};