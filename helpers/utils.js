//MikanBot Discord Utilities
//Licenced to KuronekoServer under the MIT
//© 2023 MikanDev All Rights Reserved
const { Colors, EmbedBuilder } = require('discord.js');
const Client = require('ftp');
const ftp = new Client();
const tmp = new Set();
const { COLORS } = require("../data.json");
const { readdirSync, lstatSync } = require("node:fs");
const { join, extname } = require("node:path");
const permissions = require("./permissions");
const mariadb = require('mariadb');
const discordTranscripts = require('discord-html-transcripts');
const chalk = require('chalk');
const pool = mariadb.createPool({ host: process.env.db_host, user: process.env.db_user, connectionLimit: process.env.db_limit, password: process.env.db_password, port: process.env.db_port, database: process.env.db_name });
let conn;
(async () => {
  conn = await pool.getConnection()
  console.log(chalk.green("[成功]"), `mariadbと接続しました。`);
})();
ftp.connect({
  host: process.env.core_host,
  port: process.env.core_port,
  user: process.env.core_account,
  password: process.env.core_password
});
ftp.on('ready', function () {
  console.log(chalk.green("[成功]"), `FTP接続しました。`);
})
module.exports = class Utils {
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
    const readCommands = (dir) => {
      const files = readdirSync(join(process.cwd(), dir));
      files.forEach((file) => {
        const stat = lstatSync(join(process.cwd(), dir, file));
        if (stat.isDirectory()) {
          readCommands(join(dir, file));
        } else {
          const extension = extname(file);
          if (!allowedExtensions.includes(extension)) return;
          const filePath = join(process.cwd(), dir, file);
          filePaths.push(filePath);
        }
      });
    };
    readCommands(dir);
    return filePaths;
  }

  /**
 * use sql command
 * @param {any} command 
 *  example: create table table_name (id int, name varchar(10), address varchar(10));
 *  detail: https://www.javadrive.jp/mysql/
 * @return outputdata
 */
  static async sql(command) {
    const data = await conn.query(command);
    return data;
  };
  /**
 * ticket timer
 * @param { [action: interaction.channel, type: String("delete","cancel")] }
 */
  static async ticket_timer(data) {
    if (data.type === "delete") setTimeout(async () => {
      if (tmp.has(data.action.channel.id)) return tmp.delete(data.action.channel.id);
      const attachment = await discordTranscripts.createTranscript(data.action.channel, {
        limit: -1,
        returnType: 'buffer',
        saveImages: true,
        footerText: "Exported {number} message{s}",
        poweredBy: false
      });
      const date = new Date();
      ftp.mkdir(`./${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, function (err) {
        //誰かフォルダーが既にあったらこいつ処理しないようにできない？
        //console.log(err);
      });
      ftp.put(attachment, `./${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${data.action.channel.id}.html`, function (err) {
        console.log(err.message);
      });
      const create_embed = new EmbedBuilder()
        .setTitle("チケットが削除されました")
        .setDescription(`チャンネル:${data.action.channel.name}\nユーザー:${data.action.user}\n日時:${new Date()}\n詳細:https://kuronekobot.kuroneko6423.com/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${data.action.channel.id}.html`)
        .setColor(Colors.Green);
      await data.action.channel.delete().catch(() => { });
      const getdata = await conn.query(`select * from ticket_channel where guildid="${data.action.guild.id}";`);
      if (getdata[0]?.guildid) await (await data.action.guild.channels.fetch(getdata[0].channelid)).send({ embeds: [create_embed] });
      data.action.user.send({ embeds: [create_embed] })
    }, 5 * 1000);
    if (data.type === "cancel") return tmp.add(data.action.channel.id);
  };
};