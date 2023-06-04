const { ApplicationCommandOptionType, CommandInteractionOptionResolver } = require('discord.js');
const Managers = require('./Managers');
const CommandManager = require('./CommandManager');
const MessageResponse = require('./MessageResponse');

class MessageCommandManager extends CommandManager {
    constructor(message) {
        const prefix = message.client.config.prefix;
        let argsStr = message.content.slice(prefix.length).trim();
        const args = argsStr.split(/\s+/).filter(Boolean);
        const name = args.shift();
        if (!name) return;
        argsStr = argsStr.slice(name.length).trim();
        super(message.client, name, ...args.slice(0, 2).map((s) => s.toLowerCase()));
        this.prefix = prefix;
        if (!this.name) return;
        if (this._parentGroup) args.shift();
        if (this._baseCommand !== this._command) args.shift();
        
        const allOptions = this._command.options.filter(o => ![ApplicationCommandOptionType.SubcommandGroup, ApplicationCommandOptionType.Subcommand].includes(o.type));
        function searchOption(name) {
            const indexOption = allOptions.findIndex((o) => o.name === name);
            if (indexOption === -1) return null;
            return allOptions.splice(indexOption, 1)[0];
        }

        let options = [];
        const attachments = message.attachments.map((a) => a); 

        function transformOption(optionData, value) {
            const result = {
                name: optionData.name,
                type: optionData.type
            };

            if (
                optionData.autocomplete &&
                [
                    ApplicationCommandOptionType.String,
                    ApplicationCommandOptionType.Integer,
                    ApplicationCommandOptionType.Number
                ].includes(optionData.type)
            ) result.autocomplete = optionData.autocomplete;

            if (value) result.value = /".+"|'.+'|`.+`/.test(value) ? value.slice(1, -1) : value;
            if ([
                ApplicationCommandOptionType.User,
                ApplicationCommandOptionType.Mentionable
            ].includes(optionData.type)) {
                result.user = message.client.users.cache.get(result.value);
                result.member = message.guild.members.cache.get(result.value);
            }
            if ([
                ApplicationCommandOptionType.Role,
                ApplicationCommandOptionType.Mentionable
            ].includes(optionData.type)) result.role = message.guild.roles.cache.get(result.value);

            if (optionData.type === ApplicationCommandOptionType.Channel) result.channel = message.client.channels.cache.get(result.value);
            if (optionData.type === ApplicationCommandOptionType.Attachment) result.attachment = attachments.shift();

            return result;
        }

        argsStr
            .match(/(\w+\s{0,}(:|：)\s{0,})?(".+"|'.+'|`.+`|[^\s]+)/g)
            ?.filter((_option) => {
                let [name, value] = _option.split(/:|：/).map((s) => s.trim());
                if (!value) return true;
                name = name.toLowerCase();
                const optionData = searchOption(name);
                if (!optionData) return true;
                options.push(transformOption(optionData, value));
            })
            .forEach((value) => options.push(transformOption(allOptions.shift(), value)));

        if (this._baseCommand !== this._command) {
            options = [{
                name: this._command.name,
                type: ApplicationCommandOptionType.Subcommand,
                options
            }];
        }
        if (this._parentGroup) {
            options = [{
                name: this._parentGroup.name,
                type: ApplicationCommandOptionType.SubcommandGroup,
                options
            }];
        }

        this.options = new CommandInteractionOptionResolver(message.client, options, this._command.options);

        this.message = message;
        this.id = message.id;
        this.author = message.author;
        this.channel = message.channel;
        this.channelId = message.channel.id;
        this.createdAt = message.createdAt;
        this.createdTimestamp = message.createdTimestamp;
        if (message.guild) {
            this.guild = message.guild;
            this.guildId = message.guild.id;
            this.member = message.member;
        }
    }

    type = Managers.Message;

    reply(options) {
        if (options.ephemeral) {
            this._replyMessage = this.message.author.send(options);
        } else {
            this._replyMessage = this.message.reply(options);
        }
        return this._replyMessage.then((message) => {
            if (options.ephemeral) this.message.delete();
            if (options.fetchReply) return message;
            return new MessageResponse(message);
        });
    }

    fetchReply() {
        return this._replyMessage;
    }

    deferReply(options) {
        return this.reply(Object.assign({}, options, { content: "処理中です..."}));
    }
}

module.exports = MessageCommandManager;