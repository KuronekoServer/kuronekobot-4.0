const { Events, Colors } = require("discord.js");
const sendLog = require("../../helpers/sendLog");
const { CustomEmbed } = require("../../libs");

module.exports = {
    name: Events.GuildBanRemove,
    async execute(member) {
        sendLog(member.guild, () => (
            new CustomEmbed("BANremove")
                .setTitle("✅BAN解除")
                .setDescription(`${member.user || member.user?.tag}がBAN解除されました`)
                .setColor(Colors.Red)
        ));
    }
}