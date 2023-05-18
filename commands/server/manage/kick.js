const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("kick")
        .setDescription("ユーザーをkickします。")
        .addUserOption(option => option
            .setName("user")
            .setDescription("kickするユーザー")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("kickする理由")
        )
    ,
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        const member = await interaction.guild.members.fetch(user.id);

        const embed = new CustomEmbed("kick")
            .addFields(
                {
                    name: "実行者",
                    value: `${interaction.user}`
                },
                {
                    name: "対象ユーザー",
                    value: `${member} (${member.id})`
                }
            )

        member.kick({ reason: reason })
            .then(() => {
                const embed = new CustomEmbed("kick").typeSuccess()
                    .setDescription(`${member}をkickしました。`)
                    .addFields({
                        name: "理由",
                        value: reason || "なし"
                    });
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch((error) => {
                const embed = new CustomEmbed("kick").typeError()
                    .setDescription(`${member}をkickできませんでした。`);
                if (error.code === 50013) {
                    embed.addFields({
                        name: "エラー理由",
                        value: "権限不足"
                    });
                } else {
                    embed.addFields({
                        name: "エラー理由",
                        value: `不明なエラー\n${error.message}`
                    });
                }
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
    }
};