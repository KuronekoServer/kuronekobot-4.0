const {
    GuildChannel,
    SlashCommandBuilder,
    ApplicationCommandOptionType,
    ChannelType,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
  } = require("discord.js");
  
  const { SendMessages } = require('../../helpers/permissions');
  const { getJson } = require("../../helpers/HttpUtils");
  
  GuildChannel.prototype.canSendEmbeds = function () {
    return this.permissionsFor(this.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"]);
  };
  
  module.exports = {
      data: new SlashCommandBuilder()
          .setName('wikipedia')
          .setDescription('Wikipediaで何かを調べる')
          .addStringOption(option =>
              option.setName ("query")
                .setDescription('検索項目')
                      .setRequired(true)),
  
      async execute(interaction) {
        const query = interaction.options.getString("query");
        const response = await getJson(`https://ja.wikipedia.org/api/rest_v1/page/summary/${query}`);
        if (!response.success) return interaction.reply(`検索しても何も見つからなかったよ～ :pleading_face:`);
    
        const json = response.data;
    
        if (!json.originalimage) {
        const embed = new EmbedBuilder()
        .setThumbnail(`https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png`)
        .setAuthor({
          name: `Wikipediaで ${json.titles.normalized} を検索してみたよ～`,
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
        .setColor(RANDOM)
        .setFooter({ text: `${interaction.user.tag}` });
    
        interaction.reply({ embeds: [embed] });
    
        } else {
    
    
        const embed2 = new EmbedBuilder()
        .setThumbnail(`https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png`)
        .setAuthor({
          name: `Wikipediaで ${json.titles.normalized} を検索してみたよ～`,
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
        .setColor(RANDOM)
        .setImage(json.originalimage.source)
        .setFooter({ text: `${interaction.user.tag}` });
    
    
    
        interaction.reply({ embeds: [embed2] });
    
    
    
    
    
            }
          }}