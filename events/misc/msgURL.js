const { EmbedBuilder, Events, ChannelType } = require('discord.js');

const regex = /https:\/\/(ptb.)?discord\.com\/channels\/(\d{16,19})\/(\d{16,19})\/(\d{16,19})/;

module.exports = {
    name: Events.MessageCreate,
    filter: (message) => message.channel.type !== ChannelType.DM && message.content.match(regex),
    async execute(message) {
        let channel_id;
        let message_id;
        if (results[2] = "ptb.") {
            channel_id = results[3]
            message_id = results[4]
        } else {
            channel_id = results[2]
            message_id = results[3]
        };

        const channelch = message.client.channels.cache.get(channel_id);
        if (!channelch) return;

        channelch.messages.fetch(message_id)
            .then(msg => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${msg.author.username}`,
                        iconURL: msg.author.avatarURL({ format: 'png', size: 4096, dynamic: true })
                    })
                    .setTimestamp(msg.createdAt)
                    .setFooter({
                        text: `${msg.channel.name}`,
                        iconURL: `${msg.guild.iconURL() == null ? "https://www.freepnglogos.com/uploads/discord-logo-png/discord-logo-logodownload-download-logotipos-1.png" : msg.guild.iconURL()}`
                    })

                if (msg.content.length > 0) {
                    embed.setDescription(`${msg.content}`);
                };

                if (msg.attachments?.size > 0) {
                    embed.setImage(`${msg.attachments.map(attachment => attachment.url)}`);
                } else if (msg.stickers?.size > 0) {
                    embed.setImage(`https://media.discordapp.net/stickers/${msg.stickers.first().id}.png`);
                };

                message.reply({
                    embeds: [embed]
                });

                if (msg.embeds[0]) {
                    message.channel.send({ embeds: [msg.embeds[0]] });
                };
            })
            .catch(console.error);
    }
};