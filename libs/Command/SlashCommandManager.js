const Managers = require('./Managers');
const CommandManager = require('./CommandManager');

class SlashCommandManager extends CommandManager {
    constructor(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        const subcommand = interaction.options.getSubcommand(false);
        if (subcommandGroup) {
            super(interaction.client, interaction.commandName, subcommandGroup, subcommand);
        } else {
            super(interaction.client, interaction.commandName, subcommand);
        }
        if (!this.name) return;

        this.options = interaction.options;

        this.interaction = interaction;
        this.id = interaction.id;
        this.author = interaction.user;
        this.channel = interaction.channel;
        this.channelId = interaction.channelId;
        this.createdAt = interaction.createdAt;
        this.createdTimestamp = interaction.createdTimestamp;
        if (interaction.guild) {
            this.guild = interaction.guild;
            this.guildId = interaction.guildId;
            this.member = interaction.member;
        };
    }

    type = Managers.Slash;

    reply(option) {
        return this.interaction.reply(option);
    }

    fetchReply() {
        return this.interaction.fetchReply();
    }

    deferReply(option) {
        return this.interaction.deferReply(option);
    }
}

module.exports = SlashCommandManager;