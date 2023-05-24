//MikanBot Discord Utilities
//Licenced to KuronekoServer under the MIT
//© 2023 MikanDev All Rights Reserved

const { Colors, EmbedBuilder } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const fs = require("fs");
const path = require("path");
const ftpClient = require("ftp");
const { escape } = require("mysql2");
const mysql = require("mysql2/promise");

const { COLORS } = require("../data.json");
const permissions = require("./Permissions");

const config = require("../config");

const logger = require("./GetLogger");
const Log = logger.createChannel("utils");
const ftpLog = Log.createChild("ftp");
const sqlLog = Log.createChild("sql");

const ftp = new ftpClient();
const tmp = new Set();
const ftp_option = {
    host: process.env.core_host,
    port: process.env.core_port,
    user: process.env.core_account,
    password: process.env.core_password
};

ftp.on("error", (error) => {
    ftp.connect(ftp_option);
    ftpLog.error("非常自動再接続しました。");
    ftpLog.error(error);
});

class Utils {
    /**
     * Checks if a string contains a URL
     * @param {string} text
     */
    static containsLink(text) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            text
        );
    }

    /**
     * Checks if a string is a valid discord invite
     * @param {string} text
     */
    static containsDiscordInvite(text) {
        return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
            text
        );
    }

    /**
     * Returns a random number below a max
     * @param {number} max
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * Checks if a string is a valid Hex color
     * @param {string} text
     */
    static isHex(text) {
        return /^#[0-9A-F]{6}$/i.test(text);
    }

    /**
     * Checks if a string is a valid Hex color
     * @param {string} text
     */
    static isValidColor(text) {
        if (COLORS.indexOf(text) > -1) {
            return true;
        } else return false;
    }

    /**
     * Returns hour difference between two dates
     * @param {Date} dt2
     * @param {Date} dt1
     */
    static diffHours(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        return Math.abs(Math.round(diff));
    }

    /**
     * Returns remaining time in days, hours, minutes and seconds
     * @param {number} timeInSeconds
     */
    static timeformat(timeInSeconds) {
        const days = Math.floor((timeInSeconds % 31536000) / 86400);
        const hours = Math.floor((timeInSeconds % 86400) / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.round(timeInSeconds % 60);
        return (
            (days > 0 ? `${days} days, ` : "") +
            (hours > 0 ? `${hours} hours, ` : "") +
            (minutes > 0 ? `${minutes} minutes, ` : "") +
            (seconds > 0 ? `${seconds} seconds` : "")
        );
    }

    /**
     * Converts duration to milliseconds
     * @param {string} duration
     */
    static durationToMillis(duration) {
        return (
            duration
                .split(":")
                .map(Number)
                .reduce((acc, curr) => curr + acc * 60) * 1000
        );
    }

    /**
     * Returns time remaining until provided date
     * @param {Date} timeUntil
     */
    static getRemainingTime(timeUntil) {
        const seconds = Math.abs((timeUntil - new Date()) / 1000);
        const time = Utils.timeformat(seconds);
        return time;
    }

    /**
     * @param {import("discord.js").PermissionResolvable[]} perms
     */
    static parsePermissions(perms) {
        const permissionWord = `permission${perms.length > 1 ? "s" : ""}`;
        return "`" + perms.map((perm) => permissions[perm]).join(", ") + "` " + permissionWord;
    }

    /**
     * Recursively searches for a file in a directory
     * @param {string} dir
     * @param {string[]} allowedExtensions
     */
    static recursiveReadDirSync(dir, allowedExtensions = [".js"]) {
        const filePaths = [];
        function readCommands(dir) {
            const files = fs.readdirSync(path.join(process.cwd(), dir));
            files.forEach((file) => {
                const stat = fs.lstatSync(path.join(process.cwd(), dir, file));
                if (stat.isDirectory()) {
                    readCommands(path.join(dir, file));
                } else {
                    const extension = path.extname(file);
                    if (!allowedExtensions.includes(extension)) return;
                    const filePath = path.join(process.cwd(), dir, file);
                    filePaths.push(filePath);
                }
            });
        }
        readCommands(dir);
        return filePaths;
    }

    /**
     * SQLコマンドを使用する
     * @param {string} command - SQLコマンドの文字列
     * @example
     * const command = "CREATE TABLE table_name (id int, name varchar(10), address varchar(10));"
     * @returns {any} - 出力データ
     */
    static async sql(command) {
        try {
            const connection = await mysql.createConnection({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.name,
                port: config.db.port,
            });
            const result = await connection.query(command);
            await connection.end();
            return result;
        } catch (ex) {
            sqlLog.error("SQLでエラーが発生しました。");
            sqlLog.error(ex);
        }
    }

    /**
     * タイマーチケット
     * @param {string} interactiondata.action - アクション
     * @param {"delete"|"cancel"} interactiondata.type - タイプ
     * @returns {undefined}
     */
    static async ticket_timer(data) {
        if (data.type === "delete") setTimeout(async () => {
            if (tmp.has(data.action.channel.id)) return tmp.delete(data.action.channel.id);
            const attachment = await discordTranscripts.createTranscript(data.action.channel, {
                limit: -1,
                returnType: "buffer",
                saveImages: true,
                footerText: "Exported {number} message{s}",
                poweredBy: false
            });
            const date = new Date();
            ftp.connect(ftp_option);
            ftp.on("ready", async () => {
                ftp.put(attachment, `./${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${data.action.channel.id}.html`, (err) => {
                    if (err?.message?.includes("No such file or directory")) {
                        ftp.mkdir(`./${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, (err) => { });
                        ftp.put(attachment, `./${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${data.action.channel.id}.html`, (err) => { });
                    }
                });
                const embed = new EmbedBuilder()
                    .setTitle("チケットが削除されました")
                    .setDescription(`チャンネル:${data.action.channel.name}\nユーザー:${data.action.user}\n日時:${new Date()}\n詳細:https://kuronekobot.kuroneko6423.com/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${data.action.channel.id}.html`)
                    .setColor(Colors.Green);
                await data.action.channel.delete().catch(() => { });
                const getdata = await sql(`select * from ticket_channel where guildid=${escape(data.action.guild.id)};`);
                if (getdata[0][0]?.guildid) {
                    try {
                        const channel = await data.action.guild.channels.fetch(getdata[0][0].channelid)
                        await channel.send({ embeds: [embed] });
                    } catch (error) {
                        await sql(`DELETE FROM ticket_channel WHERE guildid = ${escape(data.action.guild.id)};`);
                    }
                }
                await data.action.user.send({ embeds: [embed] }).catch(() => { });
            })
        }, 5 * 1000);
        if (data.type === "cancel") return tmp.add(data.action.channel.id);
    };
};

module.exports = Utils;