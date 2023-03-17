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
     *     
     * 読み上げ関連(user設定)
     * @typedef {Object} user_speak
     * @property {string} userid - ユーザーID
     * @property {int} speakid - 話者ID
     * @property {int} speakport - 対象話者APIのポート番号
     * @property {int} pitch - 話者のピッチ
     * @property {int} intonation - 話者のイントネーション
     * @property {int} speed - 話者スピード
     * 
     */
    await conn.query("create table ticket_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table log_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table job_message (guildid text,channelid text,messageid text);").catch(() => { });
    await conn.query("create table user_speak (userid text,speakid int,speakport int,pitch decimal,intonation decimal,speed decimal);").catch(() => { });
    console.log("処理が終了しました。");
    process.exit(1);
})();