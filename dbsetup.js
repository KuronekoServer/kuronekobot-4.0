const mariadb = require('mariadb');
require('dotenv').config();
const pool = mariadb.createPool({ host: process.env.db_host, user: process.env.db_user, connectionLimit: process.env.db_limit, password: process.env.db_password, port: process.env.db_port, database: process.env.db_name });
(async () => {
    const conn = await pool.getConnection();
    await conn.query("create table ticket_channel (guildid text,channelid text);");
    console.log("処理が終了しました。");
})();