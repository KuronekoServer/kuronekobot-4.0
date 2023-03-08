const { SlashCommandBuilder } = require('discord.js');
const mcjava = require("./sub/mcjava");
const mcbedrock = require("./sub/mcbedrock");
const mcuser = require("./sub/mcuser");
let response;
module.exports = {
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Minecraft関係コマンド')
    .addSubcommand(subcommand =>
      subcommand
        .setName('server-java')
        .setDescription('Java版Minecraftサーバー情報')
        .addStringOption(option => option.setName('address').setDescription('サーバーのアドレス').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server-bedrock')
        .setDescription('統合版Minecraftサーバー情報')
        .addStringOption(option => option.setName('address').setDescription('サーバーのアドレス').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Minecraftユーザー情報')
        .addStringOption(option => option.setName('username').setDescription('検索したいユーザーの名前').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    // Javaサーバー
    if (sub === "server-java") {
      const query = interaction.options.getString("address");
      response = await mcjava(query);
    };
    // BedRockサーバー
    if (sub === "server-bedrock") {
      const query = interaction.options.getString("address");
      response = await mcbedrock(query);
    };
    //user
    if (sub === "user") {
      const query = interaction.options.getString("username");
      response = await mcuser(query);
    };
    //user https://mojang-api-docs.gapple.pw/no-auth/uuid-to-profile
    await interaction.reply(response);
  },
};
