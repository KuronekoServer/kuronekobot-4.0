const { Colors } = require("discord.js");
const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("ban")
        .setDescription("ユーザーをBANします。")
        .addUserOption(option => option
            .setName("user")
            .setDescription("BANするユーザー")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("day")
            .setDescription("BANを行う日数(永久の場合は入力しない)")
            .setMinValue(1)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("BANする理由")
        )
    ,
    async execute(interaction, logger) {
        const user = interaction.options.getUser("user");
        const day = interaction.options.getInteger("day");
        const reason = interaction.options.getString("reason");

        const embed = new CustomEmbed("ban")
            .addFields(
                {
                    name: "実行者",
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: "対象ユーザー",
                    value: `${member} (${member.id})`,
                    inline: true
                }
            );

        const member = await interaction.guild.members.fetch(user.id);
        member.ban({ days: day, reason: reason })
            .then(() => {
                embed.typeSuccess()
                    .setDescription(`${member}をBANしました。`)
                    .addFields(
                        {
                            name: "期間",
                            value: day ? `${day}日` : "永久",
                            inline: true
                        },
                        {
                            name: "理由",
                            value: reason || "なし",
                            inline: true
                        }
                    );
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch(async error => {
                embed.typeError()
                    .setDescription(`${member}をBANできませんでした。`);
                if (error.code === 50013) {
                    embed.addFields({
                        name: "エラー理由",
                        value: "権限不足",
                    });
                } else {
                    embed.addFields({
                        name: "エラー理由",
                        value: `不明なエラー\n${error.message}`,
                    });
                }
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
    }
};