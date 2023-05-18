const { Events, Colors, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { PythonShell } = require('python-shell');
const { EnkaClient } = require("enka-network-api");
const moment = require("moment");
const enka = new EnkaClient();
const makeJson = require('genshindatajsoncreator');
const delete_button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('genshindelete')
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger),
    );
const wait = new EmbedBuilder()
    .setTitle(`処理中...`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | genshin" })
    .setColor(Colors.Green);
const math = {
    "ATTACK": "[攻撃%] + [会心率*2] + [会心ダメージ]",
    "HP": "[HP%] + [会心率*2] + [会心ダメージ]",
    "CHARGE": "[元素チャージ%] + [会心率*2] + [会心ダメージ]",
    "ELEMENT": "[元素熟知*0.25] + [会心率*2] + [会心ダメージ]",
    "DEFENCE": "[防御%] + [会心率*2] + [会心ダメージ]",
}
const types = {
    "攻撃力換算": "ATTACK",
    "HP換算": "HP",
    "元素チャージ効率換算": "CHARGE",
    "元素熟知換算": "ELEMENT",
    "防御力換算": "DEFENCE"
};
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId?.startsWith("chara")) {
            await interaction.update({ embeds: [wait], files: [] })
            const id = interaction.customId.split(",")[1]
            const name = interaction.values[0];
            const user = await enka.fetchUser(id);
            const type = interaction.message.components[0].components[0].data.options.filter(data => data.default)[0].value;
            const data = await makeJson(id, name, types[type]);
            const image = await PythonShell.run(__dirname + "/../../helpers/genshin/create.py", { args: [JSON.stringify(data)], encoding: "utf-8" });
            const decoded = Buffer.from(image[0], 'base64');
            const attachment = new AttachmentBuilder(decoded, { name: "genshin.png" });
            const characters = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`chara,${id}`)
                        .setPlaceholder('選択されていません')
                        .addOptions(...user.characters.map(r => ({
                            label: r.characterData.name.get('jp'),
                            description: `${r.characterData.name.get('jp')}を選択します`,
                            value: r.characterData.name.get('jp')
                        })).filter(data => data.label !== name).concat({ label: name, description: `${name}を選択します`, value: name, default: true })),
                );
            const success = new EmbedBuilder()
                .setTitle(`${name} - レベル${user.characters.filter(r => name === r.characterData.name.get('jp'))[0].level}`)
                .setDescription(`<t:${moment().unix()}>時点\n**スコア計算式**\n\`${math[types[type]]}\``)
                .setThumbnail(`https://cdn.mikandev.tech/public-assets/genshin-cards/${user.profilePictureCharacter.cardIcon.name}.png`)
                .setImage("attachment://genshin.png")
                .setFooter({
                    iconURL: `https://cdn.mikandev.tech/public-assets/genshin-cards/${user.profilePictureCharacter.cardIcon.name}.png`,
                    text: `${user.nickname} - レベル${user.level}`
                })
                .setColor(Colors.Green);
            await interaction.editReply({ embeds: [success], files: [attachment], components: [interaction.message.components[0], characters, delete_button] });
        };
        if (interaction.customId?.startsWith("type")) {
            const id = interaction.customId.split(",")[1]
            const name = interaction.message.components[1].components[0].data.options.filter(data => data.default)[0]?.value;
            const type = interaction.values[0];
            if (!name) {
                const select_type = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`type,${id}`)
                            .addOptions(...["攻撃力換算", "HP換算", "防御力換算", "元素チャージ効率換算", "元素熟知換算"].map(r => ({
                                label: r,
                                description: `${r}を選択します`,
                                value: r
                            })).filter(data => data.label !== type).concat({ label: type, description: `${type}を選択します`, value: type, default: true })),
                    );
                await interaction.update({ components: [select_type, interaction.message.components[1], delete_button] });
            } else {
                await interaction.update({ embeds: [wait], files: [] });
                const user = await enka.fetchUser(id);
                const data = await makeJson(id, name, types[type]);
                const image = await PythonShell.run(__dirname + "/../../helpers/genshin/create.py", { args: [JSON.stringify(data)], encoding: "utf-8" });
                const decoded = Buffer.from(image[0], 'base64');
                const attachment = new AttachmentBuilder(decoded, { name: "genshin.png" });
                const select_type = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`type,${id}`)
                            .setPlaceholder('選択されていません')
                            .addOptions(...user.characters.map(r => ({
                                label: r.characterData.name.get('jp'),
                                description: `${r.characterData.name.get('jp')}を選択します`,
                                value: r.characterData.name.get('jp')
                            })).filter(data => data.label !== type).concat({ label: type, description: `${type}を選択します`, value: type, default: true })),
                    );
                const success = new EmbedBuilder()
                    .setTitle(`${name} - レベル${user.characters.filter(r => name === r.characterData.name.get('jp'))[0].level}`)
                    .setDescription(`<t:${moment().unix()}>時点\n**スコア計算式**\n\`${math[types[type]]}\``)
                    .setThumbnail(`https://cdn.mikandev.tech/public-assets/genshin-cards/${user.profilePictureCharacter.cardIcon.name}.png`)
                    .setImage("attachment://genshin.png")
                    .setFooter({
                        iconURL: `https://cdn.mikandev.tech/public-assets/genshin-cards/${user.profilePictureCharacter.cardIcon.name}.png`,
                        text: `${user.nickname} - レベル${user.level}`
                    })
                    .setColor(Colors.Green);
                await interaction.editReply({ embeds: [success], files: [attachment], components: [select_type, interaction.message.components[1], delete_button] });
            };
        };
    }
};