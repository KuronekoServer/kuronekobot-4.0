const Logger = require("./Logger");
const GetLogger = require("./GetLogger");
const EventHandler = require("./EventHandler");
const SlashCommandHandler = require("./SlashCommandHandler");
const Utils = require("./Utils");
const Permissions = require("./Permissions");
const EmbedUtil = require("./EmbedUtil");
const { CustomEmbed, getEmbedName, ColorsChoice } = EmbedUtil;

module.exports = {
    Logger,
    GetLogger,
    EventHandler,
    SlashCommandHandler,
    Utils,
    Permissions,
    EmbedUtil,
    CustomEmbed,
    getEmbedName,
    ColorsChoice
}