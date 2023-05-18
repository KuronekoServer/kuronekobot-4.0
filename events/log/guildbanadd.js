const { Events, Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const sendLog = require("../../helpers/sendLog");

module.exports = {
    name: Events.GuildBanAdd,
    async execute(member) {
        sendLog(member.guild, () => (
            new CustomEmbed("BANadd")
                .setTitle("✅BAN")
                .setDescription(`${member.user} (${member.user.id})がBANされました`)
                .setColor(Colors.Red)
        ));
    }
}