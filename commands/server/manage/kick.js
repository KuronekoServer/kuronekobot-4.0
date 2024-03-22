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
    async execute(command) {
        const user = command.options.getUser("user");
        const reason = command.options.getString("reason");
        const member = await command.guild.members.fetch(user.id);

        const embed = new CustomEmbed("kick")
            .addFields(
                {
                    name: "実行者",
                    value: `${command.user}`
                },
                {
                    name: "対象ユーザー",
                    value: `${member} (${member.id})`
                }
            )

        member.kick({ reason: reason })
            .then(() => {
                embed.typeSuccess()
                    .setDescription(`${member}をkickしました。`)
                    .addFields({
                        name: "理由",
                        value: reason || "なし"
                    });
                command.reply({ embeds: [embed], ephemeral: true });
            })
            .catch((error) => {
                embed.typeError()
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
                command.reply({ embeds: [embed], ephemeral: true });
            });
    }
};