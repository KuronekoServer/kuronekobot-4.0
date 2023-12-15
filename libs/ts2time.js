const { time } = require("discord.js");

function ts2time(timestamp, format) {
    return time(Math.floor(timestamp / 1000), format);
}

module.exports = ts2time;