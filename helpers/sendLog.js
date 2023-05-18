const { Utils } = require("../libs");
const { escape } = require("mysql2");
const { GetLogger: logger } = require("../libs");
const Log = logger.createChannel("sendLog");

async function sendLog(guild, callback) {
    const getdata = await Utils.sql(`select * from log_channel where guildid=${escape(guild.id)};`);
    const data = getdata[0][0];
    if (!data) return;
    try {
        const channel = await guild.channels.fetch(data.channelid);
        if (!channel) return;
        const embed = callback();
        await channel.send({ embeds: [embed] });
    } catch (error) {
        Log.error(error);
        Utils.sql(`DELETE FROM log_channel WHERE guildid=${escape(guild.id)};`);
    }
}

module.exports = sendLog;