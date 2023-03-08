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
  ChannelType,
  PermissionFlagsBits,
  Colors
} = require("discord.js");

const error = new EmbedBuilder()
  .setTitle(`⚠️注意`)
  .setDescription("このチャンネルでは埋め込みメッセージを送れません。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Red);

const button_msg = new EmbedBuilder()
  .setTitle(`✅埋め込み`)
  .setDescription("下のボタンを押して埋め込みメッセージを作成してください。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Green);

const break_msg = new EmbedBuilder()
  .setTitle(`⚠️注意`)
  .setDescription("応答がなかったため中断しました。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Red);

const add_msg = new EmbedBuilder()
  .setTitle(`✅埋め込み`)
  .setDescription("フィールドを追加しました。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Green);

const end_msg = new EmbedBuilder()
  .setTitle(`✅埋め込み`)
  .setDescription("埋め込みを送信しました。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Green);

const delete_msg = new EmbedBuilder()
  .setTitle(`✅埋め込み`)
  .setDescription("フィールドを削除しました。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Green);

const fieldnot_msg = new EmbedBuilder()
  .setTitle(`⚠️注意`)
  .setDescription("削除できるフィールド存在しません。")
  .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
  .setColor(Colors.Red);
const { isValidColor, isHex } = require("../../helpers/utils");

GuildChannel.prototype.canSendEmbeds = function () {
  return this.permissionsFor(this.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"]);
};

async function embedSetup(channel, member) {
  const sentMsg = await channel.send({
    embeds: [button_msg],
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
    });

  if (!btnInteraction) return await sentMsg.edit({ embeds: [break_msg], components: [], ephemeral: true });

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
    });

  if (!modal) return await sentMsg.edit({ embeds: [break_msg], components: [], ephemeral: true });

  await modal.reply({ embeds: [end_msg], ephemeral: true });

  const title = modal.fields.getTextInputValue("title");
  const author = modal.fields.getTextInputValue("author");
  const description = modal.fields.getTextInputValue("description");
  const footer = modal.fields.getTextInputValue("footer");
  const color = modal.fields.getTextInputValue("color");

  if (!title && !author && !description && !footer)
    return await sentMsg.edit({ content: "空の埋め込みは送信できません。", components: [] });

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
    content: "フィールドを追加する場合は下のボタンを使用し追加してください。\n終了後「完成」を押してください。",
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
        });

      if (!modal) return sentMsg.edit({ components: [] });

      await modal.reply({ embeds: [add_msg], ephemeral: true });

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
        await interaction.reply({ embeds: [delete_msg], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [fieldnot_msg], ephemeral: true });
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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription('埋め込みを送信したいチャンネル')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (!channel.canSendEmbeds) return await interaction.reply({ embeds: [error], ephemeral: true });
    const success = new EmbedBuilder()
      .setTitle(`✅埋め込み送信`)
      .setDescription(`${channel} に埋め込みメッセージを送ります。`)
      .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | embed" })
      .setColor(Colors.Green);
    await interaction.reply({ embeds: [success], ephemeral: true });
    await embedSetup(channel, interaction.member);
  },
};