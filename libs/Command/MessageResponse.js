const { DiscordSnowflake } = require('@sapphire/snowflake');
const { DiscordjsError, DiscordjsErrorCodes, InteractionType, InteractionCollector } = require('discord.js');

/**
 * Represents an message response
 */
class MessageResponse {
    constructor(message, id) {
        /**
         * The message associated with the message response
         * @type {Message}
         */
        this.message = message;
        /**
         * The id of the original message response
         * @type {Snowflake}
         */
        this.id = id ?? message.id;
        this.client = message.client;
    }

    /**
     * The timestamp the message response was created at
     * @type {number}
     * @readonly
     */
    get createdTimestamp() {
        return DiscordSnowflake.timestampFrom(this.id);
    }

    /**
     * The time the message response was created at
     * @type {Date}
     * @readonly
     */
    get createdAt() {
        return new Date(this.createdTimestamp);
    }

    /**
     * Collects a single component message that passes the filter.
     * The Promise will reject if the time expires.
     * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
     * @returns {Promise<MessageComponentInteraction>}
     */
    awaitMessageComponent(options = {}) {
        return this.message.awaitMessageComponent(options);
    }

    /**
     * Creates a message component message collector
     * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
     * @returns {InteractionCollector}
     */
    createMessageComponentCollector(options) {
        return this.message.createMessageComponentCollector(options);
    }

    /**
     * Fetches the response as a {@link Message} object.
     * @returns {Promise<Message>}
     */
    async fetch() {
        return this.message
    }

    /**
     * Deletes the response.
     * @returns {Promise<void>}
     */
    delete() {
        return this.message.delete();
    }

    /**
     * Edits the response.
     * @param {string|MessagePayload|WebhookMessageEditOptions} options The new options for the response.
     * @returns {Promise<Message>}
     */
    edit(options) {
        return this.message.edit(options);
    }
}

module.exports = MessageResponse;