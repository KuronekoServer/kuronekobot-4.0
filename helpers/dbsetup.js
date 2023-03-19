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
     * @property {string} speakname - 対象話者名前
     * @property {int} speakid - 話者ID
     * @property {int} speakport - 対象話者APIのポート番号
     * @property {decimal} pitch - 話者のピッチ
     * @property {decimal} intonation - 話者のイントネーション
     * @property {decimal} speed - 話者スピード
     * 
     * サーバー設定
     * @typedef {Object} dictionary
     * @property {string} guildid - サーバーID
     * @property {string} before - 変換前の文字
     * @property {string} after - 変換後の文字
     * 
     * @typedef {Object} server_speak
     * @property {string} guildid - サーバーID
     * @property {string} auto_voice_channel - 読み上げるボイスチャンネルID
     * @property {string} auto_text_channel - 読み上げるテキストチャンネルID
     * @property {string} speakname - 対象話者名前
     * @property {decimal} pitch - 話者のピッチ
     * @property {decimal} intonation - 話者のイントネーション
     * @property {decimal} speed - 話者のスピード
     * @property {int} speakid - 話者ID
     * @property {int} speakport - 対象話者のAPIポート番号
     * @property {boolean} bot_read - BOTのメッセージを読み上げるかどうか
     * @property {boolean} read_username - ユーザーネームを読み上げるかどうか
     * @property {boolean} read_joinremove - 入退出を読み上げるかどうか
     * @property {boolean} force_args - サーバーの設定を強制するかどうか
     * @property {boolean} force_voice - サーバーの話者を強制するかどうか
     * @property {boolean} exvoice - exvoiceを有効にするかどうか(無効がtrue)
     * 
     * @typedef {Object} read_user
     * @property {string} guildid - サーバーID
     * @property {string} userid - ユーザーID
     * @property {boolean} readmsg - 読み上げるか否か
     * 
     * 読み上げない単語
     * @typedef {Object} exvoiceword
     * @property {string} guildid - サーバーID
     * @property {string} word - 単語
     * @property {string} speakname - 対象話者名前
     */
    await conn.query("create table ticket_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table log_channel (guildid text,channelid text);").catch(() => { });
    await conn.query("create table job_message (guildid text,channelid text,messageid text);").catch(() => { });
    await conn.query("create table user_speak (userid text,speakname text,speakid int,speakport int,pitch decimal,intonation decimal,speed decimal);").catch(() => { });
    await conn.query("create table dictionary (guildid text,before_text text,after_text text);").catch(() => { });
    await conn.query("create table server_speak (guildid text,auto_voice_channel text,auto_text_channel text,speakname text,pitch decimal,intonation decimal,speed decimal,speakid int,speakport int,bot_read boolean,read_username boolean,read_joinremove boolean,force_args boolean,force_voice boolean,exvoice boolean);").catch(() => { });
    await conn.query("create table read_user (guildid text,userid text,readmsg boolean);").catch(() => { });
    await conn.query("create table exvoiceword (guildid text,word text,speakname text);").catch(() => { });

    console.log("処理が終了しました。");
    process.exit(1);
})();