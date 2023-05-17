const { Colors, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { CustomEmbed, Utils } = require("../../../libs");
const { escape } = require("mysql2");

const voicevoxList = require("../../../helpers/voicelist/voicevoxlist.json");
const coeiroinkList = require("../../../helpers/voicelist/coeiroinklist.json");
const sharevoxList = require("../../../helpers/voicelist/sharevoxlist.json");

const allList = {
    voicevox: require("../../../helpers/voicelist/allvoicevoxlist.json"),
    coeiroink: require("../../../helpers/voicelist/allcoeiroinklist.json"),
    sharevox: require("../../../helpers/voicelist/allsharevoxlist.json")
};

module.exports = {
    builder: (builder) => builder
        .setName("setvoice")
        .setDescription("サーバーの話者を変更します。")
        .addStringOption(option => option
            .setName("voicevox")
            .setDescription("voicevoxの話者")
            .addChoices(...voicevoxList)
        )
        .addStringOption(option => option
            .setName("coeiroink")
            .setDescription("coeiroinkの話者")
            .addChoices(...coeiroinkList)
        )
        .addStringOption(option => option
            .setName("sharevox")
            .setDescription("sharevoxの話者")
            .addChoices(...sharevoxList)
        )
    ,
    execute: async (interaction) => {
        const voicevox = interaction.options.getString("voicevox");
        const coeiroink = interaction.options.getString("coeiroink");
        const sharevox = interaction.options.getString("sharevox");
        
        const embed = new CustomEmbed("speak");
        if (!voicevox && !coeiroink && !sharevox) {
            embed.typeError().setDescription("話者が選択されていません。");
        } else if (voicevox && coeiroink && sharevox) {
            embed.typeError().setDescription("話者は一つしか選択できません。");
        }
        if (embed.title) return interaction.reply({ embeds: [embed], ephemeral: true });

        const serviceName = voicevox ? "voicevox" : coeiroink ? "COEIROINK" : "SHAREVOX";
        const speakname = voicevox || coeiroink || sharevox;
        embed.typeSuccess().setDescription(`話者を変更しました。\n${speakname}のスタイルを選択してください。\n※3分後に自動キャンセルされます。`);
        const component = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("setvoice")
                    .setPlaceholder("選択されていません")
                    .addOptions(...allList[serviceName.toLowerCase()]
                        .filter(name => name.name === speakname)[0]
                         .styles.map(option => ({
                            label: option.name,
                            value: `${option.id}`
                        }))
                    )
            );
        interaction.reply({ embeds: [embed], components: [component], ephemeral: true })
            .awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 3 * 60 * 1000 })
            .then(async (i) => {
                const speakid = i.values[0];
                const speakhost = process.env[serviceName];
                const getdata = await Utils.sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
                let sqlStatus;
                if (getdata[0][0].guildid) {
                    sqlStatus = Utils.sql(`update server_speak set speakid=${escape(speakid)},speakhost=${escape(speakhost)},speakname=${speakname} where guildid="${interaction.guild.id}";`);
                } else {
                    sqlStatus = Utils.sql(`INSERT INTO server_speak(userid,speakid,speakhost,speakname) VALUES (${escape(interaction.user.id)},${escape(speakid)},${escape(speakhost)},${escape(speakname)});`)
                }
                const embed = new CustomEmbed("speak");
                if (!sqlStatus) embed.typeError().setDescription("データの更新でエラーが発生しました。");
                else embed.typeSuccess().setDescription("ボイスがセットされました。");
                interaction.editReply({ embeds: [embed], components: [] });
            });
    }
};