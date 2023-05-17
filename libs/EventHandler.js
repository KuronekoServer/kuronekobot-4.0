const fs = require("fs");
const path = require("path");
const logger = require("./GetLogger");

function EventHandler(client, eventsPath) {
    const Log = logger.createChannel("event");
    Log.info("Loading...");
    const events = [];
    fs.readdirSync(eventsPath).forEach((dir) => {
        Log.debug(`Loading ${dir}...`);
        const eventPath = path.resolve(eventsPath, dir);
        const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            Log.debug(`Loading ${dir} ${file}...`);
            const event = require(path.resolve(eventPath, file));
            event.logger = Log.createChild(event.name);
            client.on(event.name, (...args) => event.execute(...args, event.logger));
            events.push(event);
            Log.debug(`Loaded ${dir} ${event.name} (${file})`);
        }
        Log.debug(`Loaded ${eventFiles.length} events for ${dir}`);
    });
    Log.info(`Loaded ${events.length} events`);
    return events;
}

module.exports = EventHandler;