module.exports = {
    builder: (builder) => builder
        .setName("test")
        .setDescription("ボットの応答速度を測定します。")
        .addStringOption((option) => option
            .setName("test")
            .setDescription("テスト")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ,
    autocomplete(command) {
        return [
            {
                name: "test",
                value: "test"
            }
        ];
    },
    async execute(command) {
        command.reply(`test: ${command.options.getString("test")}`)
    }
};