const { Colors, EmbedBuilder } = require("discord.js");

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
}

function getEmbedName(embed) {
    const footer = embed.footer;
    if (!footer) return null;
    if (!footer.startWith(footerCR + " | ")) return null;
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

module.exports = {
    CustomEmbed,
    getEmbedName,
    ColorsChoice
};