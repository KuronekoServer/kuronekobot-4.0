const { Colors } = require("discord.js");
const { CustomEmbed, getEmbedName, ColorsChoice } = require("../../libs");

const defaultMaxChoice = 10;
const ExampleEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];

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
        for (let i = 1; i <= defaultMaxChoice; i++) {
            builder
                .addStringOption(option => option
                    .setName(`choice${i}`)
                    .setDescription(`アンケートの${i}番目の選択肢`)
                    .setRequired(i === 1)
                )
                .addStringOption(option => option
                    .setName(`emoji${i}`)
                    .setDescription(`アンケートの${i}番目の絵文字`)
                );
        }
        builder
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
                .setMaxValue(defaultMaxChoice)
                .setMinValue(1)
            );
        return builder;
    },
    async execute(command) {
        const { options } = command;
        const title = options.getString("title");
        const color = options.getString("color") ?? "Blue";
        const image = options.getAttachment("image");
        const maxChoice = options.getInteger("maxchoice") || defaultMaxChoice;
        const choices = [];
        const emojis = [];
        for (let i = 1; i <= maxChoice; i++) {
            const choice = options.getString(`choice${i}`);
            let emoji = options.getString(`emoji${i}`);
            if (!choice) continue;
            choices.push(choice);
            emojis.push(emoji ?? ExampleEmojis[i - 1]);
        }

        const loadEmbed = new CustomEmbed("poll")
            .setTitle("処理中...");
        const message = await command.reply({ embeds: [loadEmbed] , fetchReply: true });
        for (const emoji of emojis) {
            const check = await message.react(emoji).catch((error) => { });
            if (!check) {
                await message.delete();
                const embed = new CustomEmbed("poll").typeError()
                    .setDescription("絵文字の追加中にエラーが発生しました。")
                return command.reply({ embeds: [embed], ephemeral: true });
            }
        }
        let description = choices.map((c, i) => `${emojis[i]} ${c}`).join("\n");
        description += `\n\n 📊 **/poll sum messageid:${message.id} channelid:${message.channel.id}**`;
        const pollEmbed = new CustomEmbed(`poll${maxChoice ?? ""}`)
            .setTitle(title)
            .setDescription(description)
            .setColor(Colors[color])
        if (image) pollEmbed.setImage(image.attachment);
        command.editReply({ embeds: [pollEmbed] })
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
    async execute(command) {
        const { options, guild } = command;
        const messageId = options.getString("messageid");
        const channelId = options.getString("channelid");
        let message, channel, pollEmbed;
        try {
            channel = channelId ? await guild.channels.fetch(channelId) : command.channel;
            message = await channel.messages.fetch(messageId);
            pollEmbed = message.embeds[0]?.data;
            if (!pollEmbed || !getEmbedName(pollEmbed).startsWith("poll")) throw new Error();
        } catch (error) {
            const embed = new CustomEmbed("poll").typeError()
                .setDescription("pollメッセージが取得できませんでした。")
            return command.reply({ embeds: [embed], ephemeral: true });
        }
        const reactions = message.reactions.cache;
        const contents = pollEmbed.description.split("\n").slice(0, -2);
        let allCount = 0;
        const data = contents
            .map((content) => {
                const [emoji, ...textArr] = content.split(" ");
                const text = textArr.join(" ");
                const count = (reactions.get(emoji)?.count ?? 1) - 1;
                allCount += count;
                return { emoji, text, count };
            })
            .map((data) => {
                data.percent = ((data.count / allCount) * 100).toFixed(1);
                //ゼロ幅スペースと全角スペースを使ってます。
                data.bar = "​　" + "▀".repeat(Math.round(data.percent / 14));
                return data;
            });
        const text = data.map(d => `${d.emoji} ${d.text} **${d.percent}% (${d.count}票)**\n${d.bar}`).join("\n");
        const embed = new CustomEmbed("sumpoll")
            .setTitle(pollEmbed.title)
            .setDescription(`${text}\n[元のアンケート](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
            .setColor(Colors.Green);
        command.reply({ embeds: [embed] });
    }
};

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