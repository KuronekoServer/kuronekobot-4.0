const { config } = require("../config");
const mysql = require('mysql2/promise');

(async () => {
    const conn = await mysql.createConnection({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        port: config.db.port,
    });
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
     * 
     * 原神
     * @typedef {Object} genshin
     * @property {string} userid - ユーザーID
     * @property {string} uid - 原神のUID
     * 
     */
    await conn.query("create table ticket_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table log_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table job_message (guildid text,channelid text,messageid text);").catch(() => { });
    await conn.query("create table genshin (userid text,uid text);").catch(() => { });

    console.log("処理が終了しました。");
    process.exit(1);
})();