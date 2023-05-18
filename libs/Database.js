const mysql = require("mysql2/promise");
const { escape } = require("mysql2");

const logger = require("./GetLogger");
const Log = logger.createChannel("db");

const connectionLog = Log.createChild("connection");
const runCmdLog = Log.createChild("runCmd");


class Database {
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
        return this.sql(`INSERT INTO ${table} ${keys ? `(${keys.join(",")})` : ""} VALUES (${values.join(",")})`);
    }

    update(table, data, whereObject) {
        const where = this.whereParser(whereObject);
        const set = Object.entries(data).map(([key, value]) => `${key}=${escape(value)}`).join(",");
        return this.sql(`UPDATE ${table} SET ${set} WHERE ${where}`);
    }

    delete(table, whereObject) {
        const where = this.whereParser(whereObject);
        return this.sql(`DELETE FROM ${table} WHERE ${where}`);
    }

    whereParser(where) {
        const whereArray = Object.entries(where).map(([key, value]) => `${key}=${escape(value)}`)
        return whereArray.join(" AND ");
    }

    sql(command) {
        return new Promise((resolve) => {
            mysql.createConnection(this.connectionOption)
                .then((connection) => {
                    connection.query(command)
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((error) => {
                            Log.error(error);
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
const database = new Database();
module.exports = database;