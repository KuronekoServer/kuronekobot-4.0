const fs = require("fs");
const path = require("path");
const logger = require("./GetLogger");

function EventHandler(client, eventsPath) {
    const Log = logger.createChannel("event");
    Log.info("Loading...");
    const events = [];
    const eventsMap = new Map();
    fs.readdirSync(eventsPath).forEach((dir) => {
        Log.debug(`Loading ${dir}...`);
        const eventPath = path.resolve(eventsPath, dir);
        const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            Log.debug(`Loading ${dir} ${file}...`);
            const event = require(path.resolve(eventPath, file));
            event.logger = Log.createChild(event.name);
            events.push(event);
            if (eventsMap.has(event.name)) {
                eventsMap.get(event.name).push(event);
            } else {
                eventsMap.set(event.name, [event]);
            }
            Log.debug(`Loaded ${dir} ${event.name} (${file})`);
        }
        Log.debug(`Loaded ${eventFiles.length} events for ${dir}`);
    });
    eventsMap.forEach((events, eventName) => {
        client.on(eventName ,(...args) => {
            events
                .filter(event => event.filter(...args))
                .forEach((event) => {
                    try {
                        event.execute(...args, event.logger);
                    } catch (error) {
                        event.logger.error(error);
                    }
                });
        });
    });
    Log.info(`Loaded ${events.length} events`);
    return events;
}

module.exports = EventHandler;