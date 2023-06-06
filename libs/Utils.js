//MikanBot Discord Utilities
//Licenced to KuronekoServer under the MIT
//© 2023 MikanDev All Rights Reserved
//© 2023 Anmoti All Rights Reserved

const ftpClient = require("ftp");
const mysql = require("mysql2/promise");

const config = require("../config");
const logger = require("../helpers/getLogger");

const Log = logger.createChannel("utils");
const ftpLog = Log.createChild("ftp");
const sqlLog = Log.createChild("sql");

const ftp = new ftpClient();
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
};

module.exports = Utils;