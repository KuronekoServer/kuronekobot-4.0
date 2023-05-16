const { PermissionFlagsBits } = require("discord.js");
const path = require("path");

module.exports = {
    subcommands: path.resolve(__dirname, "./server-manage"),
    builder: (builder) => builder
        .setName("server-manage")
        .setDescription("サーバーの管理用")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
    ,
    execute() { }
};