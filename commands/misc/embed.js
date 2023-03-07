const {
  GuildChannel,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");

const { isValidColor, isHex } = require("../../helpers/utils");

GuildChannel.prototype.canSendEmbeds = function () {
  return this.permissionsFor(this.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"]);
};

async function embedSetup(channel, member) {
  const sentMsg = await channel.send({
    content: "下のボタンを押して埋め込みメッセージを作成してください",
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("EMBED_ADD").setLabel("埋め込みを作成").setStyle(ButtonStyle.Primary)
      ),
    ],
  });

  const btnInteraction = await channel
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === "EMBED_ADD" && i.member.id === member.id && i.message.id === sentMsg.id,
      time: 20000,
    })
    .catch((ex) => { });

  if (!btnInteraction) return await sentMsg.edit({ content: "応答がなかったため埋め込み作成を停止したよ～", components: [] });

  await btnInteraction.showModal(
    new ModalBuilder({
      customId: "EMBED_MODAL",
      title: "埋め込みを作る",
      components: [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("title")
            .setLabel("埋め込みのタイトル")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("author")
            .setLabel("埋め込みの作成者名")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("description")
            .setLabel("埋め込みの説明欄")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("color")
            .setLabel("埋め込みの色")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("footer")
            .setLabel("埋め込みのフッター")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
      ],
    })
  );

  // receive modal input
  const modal = await btnInteraction
    .awaitModalSubmit({
      time: 1 * 60 * 1000,
      filter: (m) => m.customId === "EMBED_MODAL" && m.member.id === member.id && m.message.id === sentMsg.id
    })
    .catch((ex) => { });

  if (!modal) return await sentMsg.edit({ content: "応答がなかったため埋め込み作成を停止したよ～", components: [] });

  await modal.reply({ content: "埋め込みを送信したよ～", ephemeral: true }).catch((ex) => { });

  const title = modal.fields.getTextInputValue("title");
  const author = modal.fields.getTextInputValue("author");
  const description = modal.fields.getTextInputValue("description");
  const footer = modal.fields.getTextInputValue("footer");
  const color = modal.fields.getTextInputValue("color");

  if (!title && !author && !description && !footer)
    return await sentMsg.edit({ content: "おい！空の埋め込みは送信できないぞ！ :rage:", components: [] });

  const embed = new EmbedBuilder();
  if (title) embed.setTitle(title);
  if (author) embed.setAuthor({ name: author });
  if (description) embed.setDescription(description);
  if (footer) embed.setFooter({ text: footer });
  if ((color && isValidColor(color)) || (color && isHex(color))) embed.setColor(color);

  // add/remove field button
  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("EMBED_FIELD_ADD").setLabel("フィールドを追加").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("EMBED_FIELD_REM").setLabel("フィールドを削除").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("EMBED_FIELD_DONE").setLabel("完成").setStyle(ButtonStyle.Primary)
  );

  await sentMsg.edit({
    content: "フィールドを追加したいなら下のボタンを使ってて追加してね～\n終わったら「完成」を押してね！",
    embeds: [embed],
    components: [buttonRow]
  });

  const collector = channel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (i) => i.member.id === member.id,
    message: sentMsg,
    idle: 5 * 60 * 1000
  });

  collector.on("collect", async (interaction) => {
    if (interaction.customId === "EMBED_FIELD_ADD") {
      await interaction.showModal(
        new ModalBuilder({
          customId: "EMBED_ADD_FIELD_MODAL",
          title: "フィールドを追加する",
          components: [
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("name")
                .setLabel("フィールド名")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("value")
                .setLabel("フィールド内容")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("inline")
                .setLabel("インラインフィールドにするか (true/false)")
                .setStyle(TextInputStyle.Short)
                .setValue("true")
                .setRequired(true)
            ),
          ],
        })
      );

      // receive modal input
      const modal = await interaction
        .awaitModalSubmit({
          time: 5 * 60 * 1000,
          filter: (m) => m.customId === "EMBED_ADD_FIELD_MODAL" && m.member.id === member.id
        })
        .catch((ex) => { });

      if (!modal) return sentMsg.edit({ components: [] });

      await modal.reply({ content: "フィールドを追加したぞ！", ephemeral: true }).catch((ex) => { });

      const name = modal.fields.getTextInputValue("name");
      const value = modal.fields.getTextInputValue("value");
      let inline = modal.fields.getTextInputValue("inline").toLowerCase();

      if (inline === "true") inline = true;
      else if (inline === "false") inline = false;
      else inline = true; // default to true

      const fields = embed.data.fields || [];
      fields.push({ name, value, inline });
      embed.setFields(fields);
    }

    // remove field
    else if (interaction.customId === "EMBED_FIELD_REM") {
      const fields = embed.data.fields;
      if (fields) {
        fields.pop();
        embed.setFields(fields);
        await interaction.reply({ content: "フィールドを削除したぞ！", ephemeral: true });
      } else {
        await interaction.reply({ content: "削除できるフィールドがないぞ！", ephemeral: true });
      };
    }

    // done
    else if (interaction.customId === "EMBED_FIELD_DONE") {
      return collector.stop();
    };
    await sentMsg.edit({ embeds: [embed] });
  });

  collector.on("end", async (_collected, _reason) => {
    await sentMsg.edit({ content: "", components: [] });
  });
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('埋め込みメッセージを作る')
    .setDMPermission(false)
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription('埋め込みを送信したいチャンネル')
        //.addChannelTypes(GuildText)
        .setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (!channel.canSendEmbeds) {
      return interaction.reply("このチャンネルでは私埋め込みメッセージ送れないよ :pleading_face:");
    }
    await interaction.reply({ content: `${channel} で埋め込みメッセージを送ります`, ephemeral: true });
    await embedSetup(channel, interaction.member);
  },
};