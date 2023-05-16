const { EmbedBuilder, Colors } = require("discord.js");
const { getJson } = require("../../../helpers/HttpUtils");
const error = new EmbedBuilder()
    .setTitle(`⚠注意`)
    .setDescription("ユーザーが見つかりませんでした。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | minecraft" })
    .setColor(Colors.Red);
module.exports = async (query) => {
    const response = await getJson(`https://api.mojang.com/user/profile/agent/minecraft/name/${query}`);
    if (!response?.success) return ({ embeds: [error], ephemeral: true });
    const response_uuid = await getJson(`https://sessionserver.mojang.com/session/minecraft/profile/${response.data?.id}`);
    if (!response_uuid?.success) return ({ embeds: [error], ephemeral: true });
    const embed = new EmbedBuilder()
        .setThumbnail(JSON.parse(atob(response_uuid.data?.properties[0]?.value)).textures.SKIN.url)
        .setAuthor({
            name: `✅Minecraftユーザー`,
        })
        .addFields(
            {
                name: `ユーザーID`,
                value: response_uuid?.data?.id
            },
            {
                name: `ユーザーネーム`,
                value: response_uuid?.data?.name
            }
        )
        .setColor(Colors.Green)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | minecraft" })
        .setColor(Colors.Green);
    return ({ embeds: [embed], ephemeral: true });
};
