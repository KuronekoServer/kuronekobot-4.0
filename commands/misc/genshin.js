const { SlashCommandBuilder, EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { escape } = require("mysql2")
const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient();
const types = ["攻撃力換算", "HP換算", "防御力換算", "元素チャージ効率換算", "元素熟知換算"];
const delete_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('genshindelete')
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger),
    );
const modal = new ModalBuilder()
    .setCustomId('genshinuid')
    .setTitle('原神管理画面');
const genshin_uid = new TextInputBuilder()
    .setCustomId('uid')
    .setMaxLength(9)
    .setMinLength(9)
    .setLabel("貴方の原神のUID")
    .setStyle(TextInputStyle.Short);
const row = new ActionRowBuilder().addComponents(genshin_uid);
modal.addComponents(row);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('genshin')
        .addSubcommand(subcommand =>
            subcommand
                .setName("build")
                .setDescription("原神のビルドカードを作成します")
                .addStringOption(option => option.setName("uid").setDescription("スコア換算方法を選択してください"))
                .addStringOption(option => option.setName("スコア換算").setDescription("スコア換算方法を選択してください").addChoices({ name: "攻撃力換算", value: "ATTACK" }, { name: "HP換算", value: "HP" }, { name: "防御力換算", value: "DEFENCE" }, { name: "元素チャージ効率換算", value: "CHARGE" }, { name: "元素熟知換算", value: "ELEMENT" }))
                .addUserOption(option => option.setName("ユーザー").setDescription("ユーザーを選択してください"))
        )
        .setDMPermission(false)
        .setDescription('原神のビルドカードを作成します'),
    async execute(interaction) {
        const option = interaction.options;
        const id = option.getString("uid") || (await sql(`select * from genshin where userid=${escape(option.getString("ユーザー") || interaction.user.id)};`))[0][0]?.uid;
        if (!id) return await interaction.showModal(modal);
        await interaction.deferReply();
        const sub = interaction.options.getSubcommand();
        if (sub === "build") {
            const user = await enka.fetchUser(id);
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
                .setTitle(`${user.nickname} - レベル${user.level}`)
                .setDescription(`${user.enkaProfile?.bio || "自己紹介なし"}\n**螺旋**\n${user.abyssFloor || "取得失敗"}層 ${user.abyssChamber || "取得失敗"}間\n**アチーブメント数**\n${user.achievements || "取得失敗"}`)
                .setThumbnail(`https://artifacter.krnk-infra.com/avatar/${user.profilePictureCharacter.cardIcon.name}/image.png`)
                .setImage(`https://enka.network/ui/${user.profileCard.pictures[1].name}.png`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | genshin" })
                .setColor(Colors.Green);
            await interaction.followUp({ embeds: [success], components: [type, characters, delete_button] });
        };
    }
};