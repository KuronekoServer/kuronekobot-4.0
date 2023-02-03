const { EmbedBuilder } = require("discord.js");
const { getJson } = require("../../../helpers/HttpUtils");

module.exports = async (query, interaction) => {
    const response = await getJson(`https://api.mcstatus.io/v2/status/java/${query}`);
    if (!response.success) return(`Couldn't find anything for that term...`);

    const json = response.data;
    if (json.online) {
        stat = "オンライン";
      } else {
        stat = "オフライン";
      }
    const embed = new EmbedBuilder()
    .setThumbnail(`https://cdn.mikn.dev/mclogo.png`)
    .setAuthor({
      name: `Minecraftサーバー (Java)`,
    })
    .addFields(
      {
        name: `ステータス`,
        value: stat
      },
      {
        name: `アドレス`,
        value: json.host
      },
      {
        name: `ポート`,
        value: json.port
      },
    )
    .setColor(RANDOM);

    return({ embeds: [embed] });

};