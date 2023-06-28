const { sql } = require("../libs");
const logger = require("./getLogger");

const Log = logger.createChannel("sendLog");

async function sendLog(guild, callback) {
    const getdata = await sql.select("log_channel", `guildid = ${guild.id}`);
    const data = getdata[0][0];
    if (!data) return;
    try {
        const channel = await guild.channels.fetch(data.channelid);
        if (!channel) return;
        const embed = callback();
        await channel.send({ embeds: [embed] });
    } catch (error) {
        Log.error(error);
        sql.delete("log_channel", `guildid = ${guild.id}`);
    }
}

module.exports = sendLog;