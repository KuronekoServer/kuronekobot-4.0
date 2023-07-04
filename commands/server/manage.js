const { PermissionFlagsBits } = require("discord.js");
const path = require("path");

module.exports = {
    subcommands: path.resolve(__dirname, "./manage"),
    builder: (builder) => builder
        .setName("manage")
        .setDescription("サーバーの管理用")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
};