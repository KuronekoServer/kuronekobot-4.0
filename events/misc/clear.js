const { Events, EmbedBuilder, Colors } = require('discord.js');
const cancel = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`キャンセルしました`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | clear" })
    .setColor(Colors.Green);
async function deleteMessages(channel, amount) {
    let deleted = 0;
    while (deleted < amount) {
        const limit = Math.min(amount - deleted, 100);
        const messages = await channel.messages.fetch({ limit: limit });
        if (messages.size === 0) {
            break;
        };
        await channel.bulkDelete(messages, true);
        deleted += messages.size;
    };
    return deleted;
};
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId.startsWith("clear")) {
            if (interaction.customId === "clearcancel") {
                await interaction.update({ embeds: [cancel], components: [] });
            } else {
                const message = Number(interaction.customId.split("clear")[1]);
                if (message === 0) {
                    const cloned = await interaction.channel.clone();
                    await cloned.setPosition(interaction.channel.position);
                    await interaction.channel.delete();
                    const success = new EmbedBuilder()
                        .setTitle(`✅完了`)
                        .setDescription(`すべてのメッセージを削除しました`)
                        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | clear" })
                        .setColor(Colors.Green);
                    await cloned.send({ embeds: [success] }).then(msg => setTimeout(() => msg.delete(), 3 * 1000));
                } else {
                    const size = await deleteMessages(interaction.channel, message);
                    const success = new EmbedBuilder()
                        .setTitle(`✅完了`)
                        .setDescription(`${size}件のメッセージを削除しました`)
                        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | clear" })
                        .setColor(Colors.Green);
                    await interaction.channel.send({ embeds: [success] }).then(i => setTimeout(async () => await i.delete(), 3000))
                };
            };
        };
    }
}