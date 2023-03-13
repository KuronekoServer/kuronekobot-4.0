const mariadb = require('mariadb');
require('dotenv').config();
const pool = mariadb.createPool({ host: process.env.db_host, user: process.env.db_user, connectionLimit: process.env.db_limit, password: process.env.db_password, port: process.env.db_port, database: process.env.db_name });
(async () => {
    const conn = await pool.getConnection();
    /**
     * サーバーIDとチャンネルIDを含むテーブルを自動生成する。
     *
     * @typedef {Object} TicketChannel
     * @property {string} guildid - サーバーID
     * @property {string} channelid - チャンネルID
     *
     * @typedef {Object} LogChannel
     * @property {string} guildid - サーバーID
     * @property {string} channelid - チャンネルID
     *  
     * @typedef {Object} JobPanel
     * @property {string} guildid - サーバーID
     * @property {string} channelid - チャンネルID
     * @property {string} messageid - メッセージID
     */
    await conn.query("create table ticket_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table log_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table job_message (guildid text,channelid text,messageid text);");
    console.log("処理が終了しました。");
    process.exit(1);
})();