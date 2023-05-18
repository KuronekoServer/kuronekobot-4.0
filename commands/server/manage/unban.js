const { CustomEmbed } = require("../../../libs");

module.exports =  {
    builder: (builder) => builder
        .setName("unban")
        .setDescription("ユーザーのBANを解除します。")
        .addStringOption(option => option
            .setName("userid")
            .setDescription("BANを解除するユーザーのid")
            .setRequired(true)
        )
    ,
    execute(interaction) {
        const id = interaction.options.getString("userid");
        interaction.guild.members.unban(id)
            .then((user) => {
                const embed = new CustomEmbed("unban").typeSuccess()
                    .setDescription(`${user}(${user.id})のBANを解除しました。`);
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch((error) => {
                let errorReason;
                switch (error.code) {
                    case 50013:
                        errorReason = "権限不足です。";
                        break;
                    case 50035:
                        errorReason = "ユーザーが見つかりませんでした。";
                        break;
                    case 10026:
                        errorReason = "すでにBANが解除されています。";
                        break;
                    default:
                        errorReason = `不明なエラーが発生しました。\n${error.message}`;
                        break;
                }
                const embed = new CustomEmbed("unban").typeError()
                    .setDescription("BANを解除できませんでした。")
                    .addFields({
                        name: "エラー理由",
                        value: errorReason
                    });
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
    }
};