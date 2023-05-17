const { CustomEmbed } = require("../../../libs");
const { read } = require("../../../helpers/read");

module.exports = {
    builder: (builder) => builder
        .setName("skip")
        .setDescription("読み上げをスキップします。")
    ,
    execute: async (interaction) => {
        const { guild } = interaction;
        const vcChannel = interaction.member.voice.channel;
        const embed = new CustomEmbed("speak");
        if (!vcChannel) {
            embed.typeError().setDescription("botがボイスチャンネルに参加していません。");
        } else if (!globalThis.voice_channel[guild.id]) {
            embed.typeError().setDescription("ボイスチャンネルのデータが取得できません。");
        } else if (globalThis.voice_channel[guild.id] !== interaction.member.voice.channel.id) {
            embed.typeError().setDescription("あなたと参加しているボイスチャンネルが違います。");
        } else {
            await read(interaction, "システム", "スキップしました", true);
        }
        interaction.reply({ embeds: [embed] });
    }
};