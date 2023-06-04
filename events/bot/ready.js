const { REST, Routes, Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    async execute(client, Log) {
        Log.info(`Logged in as ${client.user.tag}`);
        Log.info("Rebuiding command...");
        const commandsData = client.commands.map(command => command.build());
        Log.info(`Rebuilt ${commandsData.length} commands`);
        Log.info("Deploying command...");
        const rest = new REST({ version: "10" }).setToken(client.token);
        rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsData },
        ).then((data) => {
            Log.info(`Deployed ${data.length} commands`);
        }).catch((error) => {
            Log.error(error)
        });

        function setActivity() {
            client.user.setPresence({ activities: [{ name: `/help`, type: ActivityType.Streaming }] });
        }
        setActivity();
        setInterval(setActivity, 300 * 1000);
    }
}