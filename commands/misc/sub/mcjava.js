const { EmbedBuilder, Colors } = require("discord.js");
const { getJson } = require("../../../helpers/HttpUtils");
module.exports = async (query) => {
  const response = await getJson(`https://api.mcstatus.io/v2/status/java/${query}`);
  if (!response?.success) return (`Couldn't find anything for that term...`);
  const json = response.data;
  const embed = new EmbedBuilder()
    .setThumbnail(`https://cdn.mikn.dev/mclogo.png`)
    .setAuthor({
      name: `Minecraftサーバー (Java)`,
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
    .setColor(Colors.Green);

  return ({ embeds: [embed] });

};