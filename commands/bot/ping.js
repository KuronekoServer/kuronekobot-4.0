module.exports = {
    builder: (builder) => builder
        .setName("ping")
        .setDescription("ボットの応答速度を測定します。")
    ,
    async execute(command) {
        command.reply(
            `:ping_pong:Pong!\n` +
            `Websocket: ${command.client.ws.ping}ms\n` +
            `API Endpoint: ${Date.now() - command.createdAt}ms`
        );
    }
};