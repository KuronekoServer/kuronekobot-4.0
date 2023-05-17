const axios = require("axios");
const { Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");

const ServerInfo = {
    builder: (builder) => builder
        .setName("serverinfo")
        .setDescription("Minecraftサーバー情報")
        .addStringOption((option) => option
            .setName("type")
            .setDescription("サーバーの種類")
            .setChoices(
                { name: "Java", value: "java" },
                { name: "Bedrock", value: "bedrock" }
            )
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName("address")
            .setDescription("サーバーのアドレス")
            .setRequired(true)
        )
    ,
    execute(interaction) {
        const type = interaction.options.getString("type");
        const address = interaction.options.getString("address");
        const embed = new CustomEmbed("minecraft");
        axios.get(`https://api.mcstatus.io/v2/status/${type}/${address}`)
            .then((response) => {
                const json = response.data;
                embed
                    .setTitle(`Minecraftサーバー (${type})`)
                    .addFields(
                        {
                            name: "ステータス",
                            value: json.online ? "オンライン" : "オフライン",
                            inline: true
                        },
                        {
                            name: "アドレス",
                            value: json.host,
                            inline: true
                        },
                        {
                            name: "ポート",
                            value: String(json.port),
                            inline: true
                        }
                    )
                    .setThumbnail("https://cdn.mikn.dev/mclogo.png")
                    .setColor(json.online ? Colors.Green : Colors.Red);
                interaction.reply({ embeds: [embed] });
            })
            .catch((error) => {
                embed.typeError()
                    .setDescription("サーバーが見つかりませんでした。");
                interaction.reply({ embeds: [embed] });
            });
    }
};

const UserInfo = {
    builder: (builder) => builder
        .setName("userinfo")
        .setDescription("Minecraftユーザー情報")
        .addStringOption((option) => option
            .setName("username")
            .setDescription("検索したいユーザーの名前")
            .setRequired(true)
        )
    ,
    async execute(interaction, logger) {
        const username = interaction.options.getString("username");
        const embed = new CustomEmbed("minecraft");
        function notFound() {
            embed.typeError()
                .setDescription("ユーザーが見つかりませんでした。");
            interaction.reply({ embeds: [embed] });
        }
        // task: uuidからも検索できるようにする

        axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
            .then((response) => {
                const user = response.data; 
                axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${user.id}`)
                    .then((response) => {
                        embed
                            .setTitle("Minecraftユーザー")
                            .addFields(
                                {
                                    name: "ユーザーID",
                                    value: user.id
                                },
                                {
                                    name: "ユーザーネーム",
                                    value: user.name
                                }
                            )
                            .setImage(JSON.parse(Buffer.from(response.data.properties[0].value, "base64").toString()).textures.SKIN.url)
                            .setColor(Colors.Green);
                        interaction.reply({ embeds: [embed] });
                    })
                    .catch((error) => {
                        logger.error(error);
                    });
            })
            .catch(notFound);
    }
};

module.exports = {
    subcommands: [ServerInfo, UserInfo],
    builder: (builder) => builder
        .setName("minecraft")
        .setDescription("Minecraft関係コマンド")
    ,
    execute() { }
};