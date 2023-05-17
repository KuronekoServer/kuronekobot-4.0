const { Utils } = require("../libs");
const { escape } = require("mysql2");

async function sendLog(guild, callback) {
    const getdata = await Utils.sql(`select * from log_channel where guildid=${escape(guild.id)};`);
    if (!getdata[0][0]?.guildid) return;
    try {
        const channel = await member.guild.channels.fetch(getdata[0][0].channelid);
        if (!channel) return;
        const embed = callback();
        await channel.send({ embeds: [embed] });
    } catch (error) {
        Utils.sql(`DELETE FROM log_channel WHERE guildid=${escape(guild.id)};`);
    }
}

module.exports = sendLog;