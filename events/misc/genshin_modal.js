const { EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder,Events } = require('discord.js');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

const { EnkaClient } = require("enka-network-api");
const types = ["攻撃力換算", "HP換算", "防御力換算", "元素チャージ効率換算", "元素熟知換算"];
const enka = new EnkaClient();
const delete_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('genshindelete')
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger),
    );
const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | genshin" });
const wait = new EmbedBuilder()
    .setTitle(`処理中...`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | genshin" })
    .setColor(Colors.Green);
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "genshinuid") return;
        await interaction.reply({ embeds: [wait] });
        const id = interaction.fields.getTextInputValue('uid');
        const user = await enka.fetchUser(id).catch((ex) => { });
        if (!user) return await interaction.editReply({ embeds: [db_error] });
        const set = await sql(`INSERT INTO genshin(userid,uid) VALUES (${escape(interaction.user.id)},${escape(id)});`);
        if (!set) return await interaction.editReply({ embeds: [db_error] });
        const characters = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`chara,${id}`)
                    .setPlaceholder((user.characters.length === 0) ? "取得できませんでした" : "未選択")
                    .setDisabled((user.characters.length === 0) ? true : false)
                    .addOptions(...(user.characters.length !== 0) ? user.characters.map(r => ({
                        label: r.characterData.name.get('jp'),
                        description: `${r.characterData.name.get('jp')}を選択します`,
                        value: r.characterData.name.get('jp')
                    })) : [{ label: "取得できませんでした", description: "取得できませんでした", value: "取得できませんでした" }])
            );
        const type = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`type,${id}`)
                    .addOptions(...types.map(r => ({
                        label: r,
                        description: `${r}を選択します`,
                        value: r
                    })).filter(data => data.label !== "攻撃力換算").concat({ label: "攻撃力換算", description: "攻撃力換算を選択します", value: "攻撃力換算", default: true })),
            );
        const success = new EmbedBuilder()
            .setTitle(`✅成功`)
            .setDescription(`${user.enkaProfile?.bio || "自己紹介なし"}\n**螺旋**\n${user?.abyssFloor || "取得失敗"}層 ${user?.abyssChamber || "取得失敗"}間\n**アチーブメント数**\n${user.achievements || "取得失敗"}`)
            .setThumbnail(`https://artifacter.krnk-infra.com/avatar/${user.profilePictureCharacter.cardIcon.name}/image.png`)
            .setImage(`https://enka.network/ui/${user.profileCard.pictures[1].name}.png`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | genshin" })
            .setColor(Colors.Green);
        await interaction.editReply({ embeds: [success], components: [type, characters, delete_button] });
    }
}