const mysql = require("mysql2/promise");
const { escape } = require("mysql2");

const logger = require("./GetLogger");
const Log = logger.createChannel("db");

const connectionLog = Log.createChild("connection");
const runCmdLog = Log.createChild("runCmd");


class SQL {
    constructor() {
        this.connectionOption = {
            host: process.env.db_host,
            port: process.env.db_port,
            user: process.env.db_user,
            password: process.env.db_password,
            database: process.env.db_name,
        };
    }

    select(table, whereObject, columns = "*") {
        const where = this.whereParser(whereObject);
        return this.sql(`SELECT ${columns} FROM ${table} WHERE ${where}`);
    }

    insert(table, data) {
        let keys, values;
        if (Array.isArray(data)) {
            values = data.map((value) => escape(value));
        } else {
            keys = Object.keys(data);
            values = Object.values(data).map((value) => escape(value));
        }
        const sql = this.sql(`INSERT INTO ${table} ${keys ? `(${keys.join(",")})` : ""} VALUES (${values.join(",")})`, true);
        return sql.then((result) => {
            return Boolean(result);
        });
    }

    update(table, data, whereObject) {
        const where = this.whereParser(whereObject);
        const set = Object.entries(data).map(([key, value]) => `${key}=${escape(value)}`).join(",");
        const sql = this.sql(`UPDATE ${table} SET ${set} WHERE ${where}`, true);
        return sql.then((result) => {
            return Boolean(result);
        });
    }

    delete(table, whereObject) {
        const where = this.whereParser(whereObject);
        return this.sql(`DELETE FROM ${table} WHERE ${where}`);
    }
    whereParser(where) {
        const whereArray = Object.entries(where).map(([key, value]) => `${key}=${escape(value)}`)
        return whereArray.join(" AND ");
    }

    sql(command, option) {
        console.log(command);
        return new Promise((resolve) => {
            mysql.createConnection(this.connectionOption)
                .then((connection) => {
                    connection.query(command)
                        .then((result) => {
                            if (option) {
                                resolve(result);
                            } else {
                                if (result[0] && result[0].length > 0) {
                                    resolve(result[0]);
                                } else {
                                    resolve();
                                }
                            }
                        })
                        .catch((error) => {
                            runCmdLog.error(error);
                            resolve();
                        })
                        .then(() => {
                            connection.end();
                        });
                })
                .catch((error) => {
                    connectionLog.error(error);
                    resolve();
                });
        });
    }
}

// thisを使いたいのでnewしてます。
const sql = new SQL();
module.exports = sql;