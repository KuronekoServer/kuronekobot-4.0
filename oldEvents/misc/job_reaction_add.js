const { Events, EmbedBuilder, Colors } = require('discord.js');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(react, user) {
        if (user.bot) return;
        const getdata = await sql(`select * from job_message where messageid=${escape(react.message.id)};`);
        if (!getdata[0][0]?.messageid) return;
        const react_channel = await react.message.guild.channels.fetch(getdata[0][0]?.channelid);
        const react_message = await react_channel.messages.fetch(getdata[0][0]?.messageid);
        const reaction = react_message.reactions.cache.get(react._emoji.name);
        if (!reaction.me) return await react.remove();
        if (react_message.author.id !== process.env.clientId) return;
        const num = Array.from(react_message.reactions.cache.keys()).indexOf(react._emoji.name);
        const content = react_message.embeds[0]?.data?.description.split("\n")[num];
        const role = await react.message.guild.roles.fetch((content.split(/<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
        const member = await react.message.guild.members.fetch(user.id);
        await member.roles.add(role)
            .then(async () => {
                const success = new EmbedBuilder()
                    .setTitle(`✅完了`)
                    .setDescription(`ロールを付与しました。\n付与ロール:${role}\n対象ユーザー:${member}`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
                    .setColor(Colors.Green);
                const msg = await react.message.channel.send({ embeds: [success] });
                setTimeout(async () => await msg.delete(), 3 * 1000);
            })
            .catch(async ex => {
                const faild = new EmbedBuilder()
                    .setTitle(`注意`)
                    .setDescription(`ロールの付与に失敗しました。\n付与ロール:${role}\n対象ユーザー:${member}`)
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
                    .setColor(Colors.Green);
                const msg = await react.message.channel.send({ embeds: [faild] });
                setTimeout(async () => await msg.delete(), 3 * 1000);
            });
    }
}