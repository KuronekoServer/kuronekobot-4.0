function padZero(num, length) {
    return num.toString().padStart(length, "0");
}

const defaultOption = {
    levels: ["fatal", "error", "warn", "info", "debug"],
    timeFormat: (d) => `${padZero(d.getHours(), 2)}:${padZero(d.getMinutes(), 2)}:${padZero(d.getSeconds(), 2)}`,
    writeLog: (data) => {
        const { lines, level, time, location } = data;
        console.log(`[${time}][${location.join("][")}] [${level}] ${lines.join(" ")}`);
        return true;
    }
};

/**
 * @typedef {Object} LoggerOption
 * @property {string[]} levels
 * @property {(d: Date) => string} timeFormat
 * @property {(data: { lineText: string, level: string, time: string, location: string[] }) => any} writeLog
 */

class LoggerChannel {
    /**
     * @param {Logger} logger
     * @param {string[]} location
     * @param {LoggerOption} option
     */
    constructor(logger, location, option) {
        this.logger = logger;
        this.option = option;
        this.location = location.map(str => str.toLowerCase());
        this.option.levels.forEach(level => {
            this[level.toLowerCase()] = function (...lines) {
                const data = {
                    lines,
                    level,
                    time: this.option.timeFormat(new Date()),
                    location: this.location
                };
                return this.option.writeLog(data);
            };
        });
    }

    /**
     * @type {Logger}
     */
    logger;

    /**
     * @type {LoggerOption}
     */
    option;

    /**
     * @type {LoggerChannel[]}
     */
    childs = [];

    /** 
     * @type {string[]}
    */
    location = [];


    createChild(locationStr) {
        const location = [...this.location, locationStr];
        const channel = new LoggerChannel(this.logger, location, this.option);
        this.childs.push(channel);
        return channel;
    }
}

class Logger {
    /**
     * @param {LoggerOption} option
     */
    constructor(option) {
        this.setOption(option);
    }

    /**
     * @type {LoggerOption}
     */
    option = defaultOption;

    /**
     * @type {LoggerChannel[]}
     */
    channels = [];

    /**
     * @param {LoggerOption} option 
     * @returns {LoggerOption}
     */
    setOption(option) {
        return this.option = {
            levels: (option.levels ?? this.option.levels).map(level => level.toUpperCase()),
            timeFormat: option.timeFormat ?? this.option.timeFormat,
            writeLog: option.writeLog ?? this.option.writeLog
        };
    }
    /**
     * @param {string} locationStr 
     * @returns {LoggerChannel}
     */
    createChannel(locationStr) {
        const location = [locationStr];
        return new LoggerChannel(this, location, this.option);
    }
    
    static LoggerChannel = LoggerChannel;
}

module.exports = Logger;