const { Colors } = require("discord.js");
const { CustomEmbed, getEmbedName, ColorsChoice } = require("../../../libs");
const poll = require("../../events/misc/poll");

module.exports = {
    subcommands: [pollCreate, pollSum],
    builder: (builder) => builder
        .setName("poll")
        .setDescription("アンケートを実施する。")
        .setDMPermission(false)
    ,
    execute(...args) {
        return args;
    }
};

const maxChoice = 10;
const ExampleEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
const bar = "=========================>"; //4% = 1文字

const pollCreate = {
    builder: (builder) => {
        builder
            .setName("create")
            .setDescription("アンケート画面を作成します。")
            .addStringOption(option => option
                .setName("title")
                .setDescription("アンケート画面のタイトル")
                .setRequired(true)
            )
            .addAttachmentOption(option => option
                .setName("image")
                .setDescription("アンケート画面の画像")
            )
            .addStringOption(option => option
                .setName("color")
                .setDescription("アンケート画面の色")
                .setChoices(...ColorsChoice)
            )
            .addIntegerOption(option => option
                .setName("maxchoice")
                .setDescription("アンケートの選択肢の最大数")
                .setMaxValue(maxChoice)
                .setMinValue(1)
                .setRequired(true)
            );
        for (let i = 1; i <= maxChoice; i++) {
            builder
                .addStringOption(option => option
                    .setName(`choice${i}`)
                    .setDescription(`アンケートの${i}番目の選択肢`)
                )
                .addStringOption(option => option
                    .setName(`emoji${i}`)
                    .setDescription(`アンケートの${i}番目の絵文字`)
                );
        }
        return builder;
    },
    async execute(interaction) {
        const { options } = interaction;
        const title = options.getString("title");
        const color = options.getString("color") ?? "Blue";
        const image = options.getAttachment("image");
        const maxChoice = options.getInteger("maxchoice");
        const choices = [];
        const emojis = [];
        const nonSelectEmoji = Array.from(ExampleEmojis);
        for (let i = 1; i <= maxChoice; i++) {
            const choice = options.getString(`choice${i}`);
            let emoji = options.getString(`emoji${i}`);
            if (!choice) break;
            choices.push(choice);
            if (!emoji) emoji = nonSelectEmoji.shift();
            else emoji.trim();
            emojis.push(emoji);
        }

        const loadEmbed = new CustomEmbed("poll")
            .setTitle("処理中...");
        const message = await interaction.channel.send({ embeds: [loadEmbed] });
        for (const emoji of emojis) {
            const check = await message.react(emoji).catch((error) => { });
            if (!check) {
                await message.delete();
                const embed = new CustomEmbed("poll").typeError()
                    .setDescription("絵文字の追加中にエラーが発生しました。")
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
        let description = choices.map((c, i) => `${emojis[i]} ${c}`).join("\n");
        description += `\n\n 📊 **/poll sum messageid:${message.id} channelid:${message.channel.id}**`;
        const pollEmbed = new CustomEmbed(`poll${maxChoice ?? ""}`)
            .setTitle(title)
            .setDescription(description)
            .setColor(Colors[color])
        if (image) pollEmbed.setImage(image.attachment);
        message.edit({ embeds: [pollEmbed] })
    }
};

const pollSum = {
    builder: (builder) => builder
        .setName("sum")
        .setDescription("アンケートの集計を行います。")
        .addStringOption(option => option
            .setName("messageid")
            .setDescription("対象のメッセージID")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("channelid")
            .setDescription("対象のチャンネルID")
        )
    ,
    async execute(interaction) {
        const { options, guild } = interaction;
        const messageId = options.getString("messageid");
        const channelId = options.getString("channelid");
        let message, channel;
        try {
            channel = channelId ? await guild.channels.fetch(channelId) : interaction.channel;
            message = await channel.messages.fetch(messageId);
            if (!message.embeds[0] || getEmbedName(message.embeds[0]).startsWith("poll")) throw new Error();
        } catch (error) {
            const embed = new CustomEmbed("poll").typeError()
                .setDescription("pollメッセージが取得できませんでした。")
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const pollEmbed = message.embeds[0];
        const reactions = message.reactions.cache;
        const contents = pollEmbed.description.split("\n").slice(0, -2);
        let allCount = 0;
        const data = contents
            .map((content) => {
                const [emoji, ...textArr] = content.split(" ");
                const text = textArr.join(" ");
                const count = reactions.get(emoji)?.count ?? 0;
                allCount += count;
                return { emoji, text, count };
            })
            .map((data) => {
                data.percent = ((data.count / allCount) * 100).toFixed(1);
                data.bar = bar.slice(0, (bar.length - 1 - Math.floor(data.count / (allCount / (bar.length - 1)))))
            });
        const text = data.map(d => `${d.emoji} ${d.text} **${d.percent}% (${d.count}票)**\n${d.bar}`).join("\n");
        const embed = new CustomEmbed("sumpoll")
            .setTitle(pollEmbed.title)
            .setDescription(`${text}\n\n[元のアンケート](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .setColor(Colors.Green);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};