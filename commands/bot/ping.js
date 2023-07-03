module.exports = {
    builder: (builder) => builder
        .setName("ping")
        .setDescription("ボットの応答速度を測定します。")
    ,
    async execute(command) {
        let text = [
            ':ping_pong:Pong!',
            `Websocket: ${command.client.ws.ping}ms`,
            'API Endpoint: 計測中...'
        ];

        const message = await command.reply({
            content: text.join('\n'),
            fetchReply: true
        });
        
        text[2] = `API Endpoint: ${message.createdTimestamp - command.createdTimestamp - command.client.ws.ping}ms`;

        message.edit({
            content: text.join('\n')
        });
    }
};