const { EmbedBuilder, Colors } = require("discord.js");
const { getJson } = require("../../../helpers/HttpUtils");
const error = new EmbedBuilder()
  .setTitle(`⚠️注意`)
  .setDescription("ユーザーが見つかりませんでした。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | minecraft" })
  .setColor(Colors.Red);
module.exports = async (query) => {
  const response = await getJson(`https://api.mcstatus.io/v2/status/bedrock/${query}`);
  if (!response?.success) return ({ embeds: [error], ephemeral: true });
  const json = response.data;
  const embed = new EmbedBuilder()
    .setThumbnail(`https://cdn.mikn.dev/mclogo.png`)
    .setAuthor({
      name: `✅Minecraftサーバー (BedRock)`,
    })
    .addFields(
      {
        name: `ステータス`,
        value: json.online ? "オンライン" : "オフライン"
      },
      {
        name: `アドレス`,
        value: json.host
      },
      {
        name: `ポート`,
        value: String(json.port)
      },
    )
    .setColor(Colors.Green)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | minecraft" })
    .setColor(Colors.Green);
  return ({ embeds: [embed], ephemeral: true });
};