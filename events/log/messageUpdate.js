const { Events, Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const sendLog = require("../../helpers/sendLog");

module.exports = {
    name: Events.MessageUpdate,
    filter: (oldMessage) => !oldMessage.channel.isDMBased() && oldMessage.author.id !== oldMessage.client.user.id,
    async execute(oldMessage, newMessage) {
        sendLog(oldMessage.guild, () => (
            new CustomEmbed("messageUpdate")
                .setTitle("✅メッセージの編集")
                .setDescription(`メッセージユーザー:${oldMessage.author || oldMessage.author.tag}\n**対象チャンネル**:${newMessage.channel}\n**編集前のメッセージ**\n${oldMessage.content}\n**編集後のメッセージ**\n${newMessage.content}`)
                .setColor(Colors.Blue)
        ));
    }
}