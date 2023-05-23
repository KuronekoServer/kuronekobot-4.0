const { Colors, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const footerCR = "© 2023 KURONEKOSERVER";

class CustomEmbed extends EmbedBuilder {
    constructor(name) {
        super();
        this.setFooter({
            iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png",
            text: footerCR + (name ? ` | ${name}` : "")
        });
    }
    typeSuccess() {
        this.setTitle("✅成功");
        this.setColor(Colors.Green);
        return this;
    }
    typeError() {
        this.setTitle("⚠エラー");
        this.setColor(Colors.Red);
        return this;
    }
    toJSON() {
        if (!this.data.timestamp) this.setTimestamp();
        return super.toJSON();
    }
}

function getEmbedName(embed) {
    const footer = embed.footer.text;
    if (!footer) return null;
    if (!footer.startsWith(footerCR + " | ")) return null;
    return footer.slice(footerCR.length + 3);
}

const ColorsChoice = [
    { name: "赤色", value: "Red" },
    { name: "白色", value: "White" },
    { name: "水色", value: "Aqua" },
    { name: "緑色", value: "Green" },
    { name: "青色", value: "Blue" },
    { name: "黄色", value: "Yellow" },
    { name: "蛍光ピンク色", value: "LuminousVividPink" },
    { name: "紫色", value: "Purple" },
    { name: "赤紫色", value: "Fuchsia" },
    { name: "金色", value: "Gold" },
    { name: "オレンジ色", value: "Orange" },
    { name: "灰色", value: "Grey" },
    { name: "濃紺色", value: "Navy" },
    { name: "濃い水色", value: "DarkAqua" },
    { name: "濃い緑色", value: "DarkGreen" },
    { name: "濃い青色", value: "DarkBlue" },
    { name: "濃い紫色", value: "DarkPurple" },
    { name: "濃い蛍光ピンク色", value: "DarkVividPink" },
    { name: "濃い金色", value: "DarkGold" },
    { name: "濃いオレンジ色", value: "DarkOrange" },
    { name: "濃い赤色", value: "DarkRed" },
    { name: "濃い灰色", value: "DarkGrey" },
    { name: "明るい灰色", value: "LightGrey" },
    { name: "濃い紺色", value: "DarkNavy" },
    { name: "青紫色", value: "Blurple" }
];

const nextButton = new ButtonBuilder()
    .setCustomId("page_next")
    .setLabel("次のページ")
    .setStyle(ButtonStyle.Primary);

const backButton = new ButtonBuilder()
    .setCustomId("page_back")
    .setLabel("前のページ")
    .setStyle(ButtonStyle.Primary);

const firstComponent = new ActionRowBuilder()
    .addComponents(nextButton);

const middleComponent = new ActionRowBuilder()
    .addComponents(backButton, nextButton);

const lastComponent = new ActionRowBuilder()
    .addComponents(backButton);

class EmbedPages {
    constructor(name) {
        this.name = name;
        this.date = new Date();
        this.pages = [];
    }

    setTimestamp(timestamp = Date.now()) {
		this.date = timestamp;
		return this;
	}

    setColor(color) {
        this.color = color;
        return this;
    }

    addPage(callback) {
        const embed = new CustomEmbed(this.name)
            .setTimestamp(this.date);
        callback(embed);
        this.pages.push(embed);
        return this;
    }

    run(interaction) {
        const pages = this.pages;
        pages.forEach((embed, i) => {
            embed
                .setAuthor({ name: `${i + 1}ページ / ${pages.length}ページ` })
                .setColor(this.color)
                .setTimestamp(this.date);
        });
        let page = 0;
        const maxPage = pages.length - 1;
        interaction.reply({ embeds: [pages[page]], components: [firstComponent], fetchReply: true })
            .then(async function collecter(message) {
                message.awaitMessageComponent({ time: 3 * 60 * 1000 })
                    .then(async (i) => {
                        switch (i.customId) {
                            case "page_next":
                                    page++;
                                break;
                            case "page_back":
                                    page--;
                                break;
                        }
                        const embed = pages[page];
                        let component;
                        switch (page) {
                            case 0:
                                component = firstComponent;
                                break;
                            case maxPage:
                                component = lastComponent;
                                break;
                            default:
                                component = middleComponent;
                                break;
                        }
                        i.update({ embeds: [embed], components: [component], fetchReply: true }).then(collecter);
                    })
                    .catch((error) => {
                        console.error(error)
                        message.edit({ components: [] });
                    })
            });
        return this;
    }
}

module.exports = {
    CustomEmbed,
    getEmbedName,
    ColorsChoice,
    EmbedPages
};