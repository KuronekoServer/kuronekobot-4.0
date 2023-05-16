const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("clear")
        .setDescription("複数のメッセージを削除します。")
        .addIntegerOption(option => option
            .setName("count")
            .setDescription("削除するメッセージの数 (指定しない場合はすべてのメッセージを削除します)")
            .setMaxValue(300)
            .setMinValue(0)
        )
    ,
    execute(interaction) {
        const deleteCount = interaction.options.getInteger("count");
        const component = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("clear")
                    .setLabel("削除")
                    .setStyle(ButtonStyle.Danger),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`clearcancel`)
                    .setLabel("キャンセル")
                    .setStyle(ButtonStyle.Secondary),
            );
        const embed = new CustomEmbed("clear")
            .setTitle("⚠確認 (30秒後に自動キャンセルされます)")
            .setDescription(`${(deleteCount === 0) ? "すべてのメッセージ" : `${deleteCount}件のメッセージ`}を削除しますか?`)
            .setColor(Colors.Red);
        interaction.reply({ embeds: [embed], components: [component] })
            .awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 30 * 1000})
            .then(async (i) => {
                const embed = new CustomEmbed("clear").typeSuccess();
                let message;
                if (i.customId === "clear") {
                    if (deleteCount === 0) {
                        const cloned = await interaction.channel.clone();
                        await cloned.setPosition(interaction.channel.position);
                        await interaction.channel.delete();
                        embed.setDescription("すべてのメッセージを削除しました。");
                        message = cloned.send({ embeds: [embed] });
                    } else {
                        await interaction.delete();
                        await interaction.channel.bulkDelete(deleteCount);
                        embed.setDescription(`${deleteCount}件のメッセージを削除しました。`);
                        message = interaction.channel.send({ embeds: [embed] })
                    }
                } else {
                    embed.setDescription("キャンセルしました。");
                    message = interaction.update({ embeds: [embed], components: [] });
                }
                await message;
                setTimeout(message.delete, 3 * 1000); 
            });
    },
};