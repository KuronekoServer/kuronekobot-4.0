const fs = require("fs");
const path = require("path");

function EventHandler(client, eventsPath) {
    const Log = client.logger.createChannel("event");
    Log.debug("Loading...");
    const events = [];
    fs.readdirSync(eventsPath).forEach((dir) => {
        const eventPath = path.resolve(eventsPath, dir);
        const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(path.resolve(eventPath, file));
            event.logger = Log.createChild(event.name);
            client.on(event.name, (...args) => event.execute(...args, event.logger));
            events.push(event);
        }
    });
    Log.debug(`Loaded ${events.length} events`);
    return events;
}

module.exports = EventHandler;