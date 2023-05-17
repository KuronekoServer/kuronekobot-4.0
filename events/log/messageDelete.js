const { Events, Colors, ChannelType } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const sendLog = require("../../helpers/sendLog");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.channel.type === ChannelType.DM) return;
        sendLog(message.guild, () => (
            new CustomEmbed("messagedelete")
                .setTitle("✅メッセージの削除")
                .setDescription(`メッセージユーザー:${message.author || message.author.tag}\n**対象チャンネル**${message.channel}**\n削除したメッセージ**\n${message.content}`)
                .setColor(Colors.Red)
        ));
    }
}