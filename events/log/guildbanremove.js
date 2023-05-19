const { Events, Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const sendLog = require("../../helpers/sendLog");

module.exports = {
    name: Events.GuildBanRemove,
    async execute(guildBan) {
        sendLog(guildBan.guild, () => (
            new CustomEmbed("BANremove")
                .setTitle("ユーザーのBANが解除されました。")
                .addFields(
                    {
                        name: "ユーザー (id)",
                        value: `${guildBan.user} (${guildBan.user.id})`,
                    },
                    {
                        name: "理由",
                        value: `${guildBan.reason || "なし"}`,
                    }
                )
                .setColor(Colors.Orange)
        ));
    }
}