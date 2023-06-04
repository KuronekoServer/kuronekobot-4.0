module.exports = {
    builder: (builder) => builder
        .setName("ping")
        .setDescription("ボットの応答速度を測定します。")
    ,
    async execute(command) {
        const base = ":ping_pong:Pong!\n";
        const message = await command.reply({ content: base + "取得中..." });
        message.edit(
            base +
            `Websocket: ${command.client.ws.ping}ms\n` +
            `API Endpoint: ${Date.now() - message.createdTimestamp}ms`
        );
    }
};