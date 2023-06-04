const { Collection, Guild, Channel, GuildMember, Snowflake, Message, CommandInteraction, Base } = require("discord.js");
const { LoggerChannel } = require("../Logger");

class CommandManager extends Base {
    constructor(client, name, subcommand1, subcommand2) {
        super(client);
        this._baseCommand = client.commands.get(name);
        if (!this._baseCommand) return;
        const subcommandNames = [subcommand1, subcommand2];
        let subcommands = this._baseCommand.subcommands;
        if ("subcommandGroups" in this._baseCommand) {
            const parentGroup = this._baseCommand.subcommandGroups.get(subcommandNames[0]);
            if (parentGroup) {
                subcommandNames.shift();
                this._parentGroup = parentGroup;
                subcommands = parentGroup.subcommands;
            } else if (subcommands) {
                this._parentGroup = null;
            } else return;
        }
        if (subcommands) {
            this._command = subcommands.get(subcommandNames.shift());
            if (!this._command) return;
        } else {
            this._command = this._baseCommand;
        }

        /**
         * コマンドの名前
         * @type {string}
         */
        this.name = this._command.name;

        /**
         * コマンドの説明
         * @type {string}
         */
        this.description = this._command.description;

        /**
         * コマンドのカテゴリ
         * @type {string}
         */
        this.category = this._command.category;

        /**
         * コマンドの関数
         * @type {function}
         */
        this.execute = this._command.execute;

        /**
         * オートコンプリートの関数
         * @type {function}
         */
        this.autocomplete = this._command.autocomplete;

        /**
         * コマンドのロガー
         * @type {LoggerChannel}
         */
        this.logger = this._command.logger;
    }

    /**
     * コマンドの種類 (Managers.Message or Managers.Slash)
     * @type {Managers}
     */
    type = null;

    /**
     * コマンドが実行されたメッセージ (メッセージコマンドのみ)
     * @type {Message|null}
     */
    message = null;

    /**
     * コマンドが実行されたスラッシュインタラクション (スラッシュコマンドのみ)
     * @type {CommandInteraction|null}
     */
    interaction = null;

    /**
     * コマンドのID
     * @type {Snowflake}
     */
    id = null;

    /**
     * コマンドが実行されたギルド (ギルド内のみ)
     * @type {Guild|null}
     */
    guild = null;

    /**
     * コマンドが実行されたギルドのID (ギルド内のみ)
     * @type {Snowflake|null}
     */
    guildId = null;

    /**
     * コマンドが実行されたチャンネル
     * @type {Channel}
     */
    channel = null;

    /**
     * コマンドが実行されたチャンネルのID
     * @type {Snowflake}
     */
    channelId = null;

    /**
     * コマンドを実行したメンバー (ギルド内のみ)
     * @type {GuildMember|null}
     */
    member = null;

    /**
     * コマンドが実行された日時
     * @type {Date}
     */
    createdAt = null;

    /**
     * コマンドが実行された時のタイムスタンプ
     * @type {number}
     */
    createdTimestamp = null;

    /**
     * コマンドのプレフィックス
     * @type {string}
     */
    prefix = "/";

    /**
     * コマンドの引数 (引数がない時はnull)
     * @type {CommandInteractionOptionResolver}
     */
    options = null;

    /**
     * Creates a reply to this command.
     * @param {string|MessagePayload|InteractionReplyOptions} options
     * @returns {Promise<Message>|Promise<MessageResponse>|Promise<InteractionResponse>}
     */
    reply() { }

    /**
     * Fetch the reply to this command.
     * @returns {Promise<Message>}
     */
    fetchReply() { }

    /**
     * Defers the reply to this interaction.
     * @param {InteractionDeferReplyOptions}
     * @returns {Promise<Message>|Promise<MessageResponse>|Promise<InteractionResponse>}
     */
    deferReply() { }

}

module.exports = CommandManager;