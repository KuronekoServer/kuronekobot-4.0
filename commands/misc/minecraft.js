const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mcjava = require("./sub/mcjava");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Minecraft関係コマンド')
        .addSubcommand(subcommand =>
            subcommand
                .setName('server-java')
                .setDescription('Java版Minecraftサーバー情報')
                .addStringOption(option => option.setName('address').setDescription('サーバーのアドレス')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server-bedrock')
                .setDescription('統合版Minecraftサーバー情報')
                .addStringOption(option => option.setName('address').setDescription('サーバーのアドレス')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Minecraftユーザー情報')
                .addStringOption(option => option.setName('username').setDescription('検索したいユーザーの名前'))),        
        async execute(interaction) {
                const sub = interaction.options.getSubcommand();
                let response;
            
                // Javaサーバー
                if (sub === "server-java") {
                  const query = interaction.options.getString("address");
                  response = await mcjava(query, interaction);
                }
                
                await interaction.reply(response);
              },
            };
            