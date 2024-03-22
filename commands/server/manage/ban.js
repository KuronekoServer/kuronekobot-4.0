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
    async execute(command, logger) {
        const user = command.options.getUser("user");
        const day = command.options.getInteger("day");
        const reason = command.options.getString("reason");

        const embed = new CustomEmbed("ban")
            .addFields(
                {
                    name: "実行者",
                    value: `${command.user}`,
                    inline: true
                },
                {
                    name: "対象ユーザー",
                    value: `${member} (${member.id})`,
                    inline: true
                }
            );

        const member = await command.guild.members.fetch(user.id);
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
                command.reply({ embeds: [embed], ephemeral: true });
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
                command.reply({ embeds: [embed], ephemeral: true });
            });
    }
};