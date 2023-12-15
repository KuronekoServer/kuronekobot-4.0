const mysql = require("mysql2/promise");
const { escape } = require("mysql2");

const { config } = require("../config");

const logger = require("../helpers/getLogger");
const Log = logger.createChannel("db");
const connectionLog = Log.createChild("connection");
const runCmdLog = Log.createChild("runCmd");

class sql {
    static connectionOption = {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
    }

    static select(table, whereObject, columns = "*") {
        const data = ["SELECT", columns, "FROM", table];
        if (whereObject) {
            const where = sql.whereParser(whereObject);
            data.push("WHERE", where);
        }
        const where = sql.whereParser(whereObject);
        return sql.sql(`${data.join(" ")};`);
    }

    static insert(table, data) {
        let keys, values;
        if (Array.isArray(data)) {
            values = data.map((value) => escape(value));
        } else {
            keys = Object.keys(data);
            values = Object.values(data).map((value) => escape(value));
        }
        const sql = sql.sql(`INSERT INTO ${table} ${keys ? `(${keys.join(",")})` : ""} VALUES (${values.join(",")})`, true);
        return sql.then((result) => {
            return Boolean(result);
        });
    }

    static update(table, data, whereObject) {
        const where = sql.whereParser(whereObject);
        const set = Object.entries(data).map(([key, value]) => `${key}=${escape(value)}`).join(",");
        const sql = sql.sql(`UPDATE ${table} SET ${set} WHERE ${where}`, true);
        return sql.then((result) => {
            return Boolean(result);
        });
    }

    static delete(table, whereObject) {
        const where = sql.whereParser(whereObject);
        return sql.sql(`DELETE FROM ${table} WHERE ${where}`);
    }
    static whereParser(where) {
        const whereArray = Object.entries(where).map(([key, value]) => `${key}=${escape(value)}`)
        return whereArray.join(" AND ");
    }

    static sql(command, option) {
        console.log(command);
        return new Promise((resolve) => {
            mysql.createConnection(sql.connectionOption)
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

module.exports = sql;