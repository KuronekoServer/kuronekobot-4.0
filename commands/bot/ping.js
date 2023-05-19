module.exports = {
    builder: (builder) => builder
        .setName("ping")
        .setDescription("ボットの応答速度を測定します。")
    ,
    async execute(interaction) {
        const base = ":ping_pong:Pong!\n";
        const message = await interaction.reply({ content: base + "取得中...", fetchReply: true });
        interaction.editReply(
            base +
            `Websocket: ${interaction.client.ws.ping}ms\n` +
            `API Endpoint: ${Date.now() - message.createdTimestamp}ms`
        );
    }
};