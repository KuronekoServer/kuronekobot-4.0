import mysql, { ConnectionOptions } from 'mysql2/promise';
import { escape } from 'mysql2';

import { config } from '../config';

class sql {
    static connectionOption: ConnectionOptions = {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
    }

    static select(optionOrTable: selectOption | string, colmunOrFilter?: string, filter?: string) {
        let option: selectOption;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable
            }
            if (filter) {
                option.colmun = colmunOrFilter;
                option.filter = filter;
            } else {
                option.filter = colmunOrFilter;
            }
        } else {
            option = optionOrTable;
        }

        const queryArr = ['SELECT'];
        if (option.distinct) queryArr.push('DISTINCT');
        queryArr.push(option.colmun || '*');
        queryArr.push('FROM');
        queryArr.push(option.table);
        if (option.filter) queryArr.push('WHERE', option.filter);

        return sql.query(`${queryArr.join(' ')};`);
    }

    static insert(optionOrTable: insertOption | string, colmunOrValues?: string[], values?: string[]) {
        let option: insertOption;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable
            }
            if (values) {
                option.colmun = colmunOrValues;
                option.values = values;
            } else {
                option.values = colmunOrValues;
            }
        } else {
            option = optionOrTable;
        }

        const queryArr = ['INSERT', 'INTO'];
        queryArr.push(option.table);
        if (option.colmun) queryArr.push(`(${option.colmun.join(', ')})`);
        if (option.values) queryArr.push('VALUES', `(${option.values.join(', ')})`);

        return sql.query(`${queryArr.join(' ')};`);
    }

    static update(tableOrOption: updateOption | string, data: object, filter?: string) {
        let option: updateOption;
        if (typeof tableOrOption === 'string') {
            option = {
                table: tableOrOption,
                data: data,
                filter: filter
            }
        } else {
            option = tableOrOption;
        }

        const queryArr = ['UPDATE'];
        queryArr.push(option.table);
        queryArr.push('SET');
        const dataArr: string[] = [];
        Object.entries(option.data).forEach(([key, value]) => {
            dataArr.push(`${key} = ${escape(value)}`);
        });
        queryArr.push(dataArr.join(', '));
        if (option.filter) queryArr.push('WHERE', option.filter);

        return sql.query(`${queryArr.join(' ')};`);
    }

    static delete(optionOrTable: deleteOption | string, filter?: string) {
        let option: deleteOption;
        if (typeof optionOrTable === 'string') {
            option = {
                table: optionOrTable,
                filter: filter
            }
        } else {
            option = optionOrTable;
        }

        const queryArr = ['DELETE', 'FROM'];
        queryArr.push(option.table);
        if (option.filter) queryArr.push('WHERE', option.filter);

        return sql.query(`${queryArr.join(' ')};`);
    }

    static query(query: string) {
        return new Promise((resolve, reject) => {
            mysql.createConnection(sql.connectionOption)
                .then((connection) => {
                    connection.query(query)
                        .then((result) => {
                            if (Array.isArray(result[0]) && result[0].length === 0) {
                                resolve(null);
                            } else {
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

export default sql;