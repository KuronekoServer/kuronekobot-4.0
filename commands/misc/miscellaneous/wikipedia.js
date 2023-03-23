const {
  GuildChannel,
  EmbedBuilder,
  Colors,
} = require("discord.js");

const { getJson } = require("../../../helpers/HttpUtils");

GuildChannel.prototype.canSendEmbeds = function () {
  return this.permissionsFor(this.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"]);
};

module.exports = async (interaction) => {
  const query = interaction.options.getString("query");
  const response = await getJson(`https://ja.wikipedia.org/api/rest_v1/page/summary/${query}`);
  if (!response.success) return await interaction.reply(`検索しても何も見つからなかったよ～ :pleading_face:`);
  const json = response.data;
  if (!json.originalimage) {
    const embed = new EmbedBuilder()
      .setThumbnail(`https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png`)
      .setAuthor({
        name: `Wikipediaで ${json.titles.normalized} を検索しました`,
        url: json.content_urls.desktop.page,
      })
      .addFields(
        {
          name: `説明`,
          value: json.extract
        },
        {
          name: `詳細`,
          value: `[Wikipedia](${json.content_urls.desktop.page})で続きを読む`
        },
      )
      .setColor(Colors.Green)
      .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | Wikipedia" })
      .setFooter({ text: `${interaction.user.tag}` });
    await interaction.reply({ embeds: [embed] });
  } else {
    const embed2 = new EmbedBuilder()
      .setThumbnail(`https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png`)
      .setAuthor({
        name: `Wikipediaで ${json.titles.normalized} を検索しました`,
        url: json.content_urls.desktop.page,
      })
      .addFields(
        {
          name: `説明`,
          value: json.extract
        },
        {
          name: `詳細`,
          value: `[Wikipedia](${json.content_urls.desktop.page})で続きを読む`
        }
      )
      .setColor(Colors.Green)
      .setImage(json.originalimage.source)
      .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | Wikipedia" });
    await interaction.reply({ embeds: [embed2] });
  };
}