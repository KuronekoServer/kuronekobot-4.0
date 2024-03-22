const path = require('path');

module.exports = {
    subcommandGroups: path.resolve(__dirname, './minecraft'),
    builder: (builder) => builder
        .setName('minecraft')
        .setDescription('Minecraft関係コマンド')
};