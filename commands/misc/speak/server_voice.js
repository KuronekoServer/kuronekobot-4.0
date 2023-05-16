const { EmbedBuilder, Colors, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const undefined_choice = new EmbedBuilder()
    .setTitle(`⚠エラー`)
    .setDescription("何も選択されていません。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Red);
const voicevox_array = require("../../../helpers/voicelist/allvoicevoxlist.json");
const coeiroink_array = require("../../../helpers/voicelist/allcoeiroinklist.json");
const sharevox_array = require("../../../helpers/voicelist/allsharevoxlist.json");
module.exports = async (interaction) => {
    if (interaction.options.getString("voicevox話者名")) {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${interaction.options.getString("voicevox話者名")}のスタイルを選択してください！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('voicevox')
                    .setPlaceholder('選択されていません')
                    .addOptions(...voicevox_array
                        .filter(name => name.name === interaction.options.getString("voicevox話者名"))[0]
                        .styles
                        .map(option => ({ label: option.name, description: `${option.name}を選択します`, value: `${process.env.voicevox},${option.id},${interaction.options.getString("voicevox話者名")},${interaction.guild.id}` }))
                    ),
            );
        return ({ embeds: [success], components: [select], ephemeral: true  });
    } else if (interaction.options.getString("coeiroink話者名")) {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${interaction.options.getString("coeiroink話者名")}のスタイルを選択してください！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('coeiroink')
                    .setPlaceholder('選択されていません')
                    .addOptions(...coeiroink_array
                        .filter(name => name.name === interaction.options.getString("coeiroink話者名"))[0]
                        .styles
                        .map(option => ({ label: option.name, description: `${option.name}を選択します`, value: `${process.env.COEIROINK},${option.id},${interaction.options.getString("coeiroink話者名")},${interaction.guild.id}` }))
                    ),
            );
        return ({ embeds: [success], components: [select], ephemeral: true  });
    } else if (interaction.options.getString("sharevox話者名")) {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${interaction.options.getString("sharevox話者名")}のスタイルを選択してください！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('sharevox')
                    .setPlaceholder('選択されていません')
                    .addOptions(...sharevox_array
                        .filter(name => name.name === interaction.options.getString("sharevox話者名"))[0]
                        .styles
                        .map(option => ({ label: option.name, description: `${option.name}を選択します`, value: `${process.env.SHAREVOX},${option.id},${interaction.options.getString("sharevox話者名")},${interaction.guild.id}` }))
                    ),
            );
        return ({ embeds: [success], components: [select], ephemeral: true  });
    } else {
        return ({ embeds: [undefined_choice] });
    };
};