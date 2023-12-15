const { Events, Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const sendLog = require("../../helpers/sendLog");

module.exports = {
    name: Events.GuildBanAdd,
    async execute(guildBan) {
        sendLog(guildBan.guild, () => (
            new CustomEmbed("BANadd")
                .setTitle("ユーザーがBANされました。")
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
                .setColor(Colors.Red)
        ));
    }
}