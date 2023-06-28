"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const mysql2_1 = require("mysql2");
const config_1 = require("../config");
class sql {
    static select(optionOrTable, colmunOrFilter, filter) {
        let option;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable
            };
            if (filter) {
                option.colmun = colmunOrFilter;
                option.filter = filter;
            }
            else {
                option.filter = colmunOrFilter;
            }
        }
        else {
            option = optionOrTable;
        }
        const queryArr = ['SELECT'];
        if (option.distinct)
            queryArr.push('DISTINCT');
        queryArr.push(option.colmun || '*');
        queryArr.push('FROM');
        queryArr.push(option.table);
        if (option.filter)
            queryArr.push('WHERE', option.filter);
        return sql.query(`${queryArr.join(' ')};`);
    }
    static insert(optionOrTable, colmunOrValues, values) {
        let option;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable
            };
            if (values) {
                option.colmun = colmunOrValues;
                option.values = values;
            }
            else {
                option.values = colmunOrValues;
            }
        }
        else {
            option = optionOrTable;
        }
        const queryArr = ['INSERT', 'INTO'];
        queryArr.push(option.table);
        if (option.colmun)
            queryArr.push(`(${option.colmun.join(', ')})`);
        if (option.values)
            queryArr.push('VALUES', `(${option.values.join(', ')})`);
        return sql.query(`${queryArr.join(' ')};`);
    }
    static update(tableOrOption, data, filter) {
        let option;
        if (typeof tableOrOption === 'string') {
            option = {
                table: tableOrOption,
                data: data,
                filter: filter
            };
        }
        else {
            option = tableOrOption;
        }
        const queryArr = ['UPDATE'];
        queryArr.push(option.table);
        queryArr.push('SET');
        const dataArr = [];
        Object.entries(option.data).forEach(([key, value]) => {
            dataArr.push(`${key} = ${(0, mysql2_1.escape)(value)}`);
        });
        queryArr.push(dataArr.join(', '));
        if (option.filter)
            queryArr.push('WHERE', option.filter);
        return sql.query(`${queryArr.join(' ')};`);
    }
    static delete(optionOrTable, filter) {
        let option;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable,
                filter: filter
            };
        }
        else {
            option = optionOrTable;
        }
        const queryArr = ['DELETE', 'FROM'];
        queryArr.push(option.table);
        if (option.filter)
            queryArr.push('WHERE', option.filter);
        return sql.query(`${queryArr.join(' ')};`);
    }
    static query(query) {
        return new Promise((resolve, reject) => {
            promise_1.default.createConnection(sql.connectionOption)
                .then((connection) => {
                connection.query(query)
                    .then((result) => {
                    if (Array.isArray(result[0]) && result[0].length === 0) {
                        resolve(null);
                    }
                    else {
                        resolve(result[0]);
                    }
                })
                    .catch((error) => {
                    //runCmdLog.error(error);
                    resolve(void 0);
                })
                    .then(() => {
                    connection.end();
                });
            })
                .catch((error) => {
                //connectionLog.error(error);
                resolve(void 0);
            });
        });
    }
}
sql.connectionOption = {
    host: config_1.config.db.host,
    port: config_1.config.db.port,
    user: config_1.config.db.user,
    password: config_1.config.db.password,
    database: config_1.config.db.name,
};
exports.default = sql;
