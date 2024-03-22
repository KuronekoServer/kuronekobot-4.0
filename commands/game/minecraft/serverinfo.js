const path = require('path');
const fs = require('fs');
const { Colors, time, codeBlock, AttachmentBuilder } = require('discord.js');
const { CustomEmbed } = require('../../../libs');

const serverIcon = fs.readFileSync(path.resolve(__dirname, '../../../assets/minecraft_server_icon.png'));

function padLength(str, len) {
    if (str.length > len) return str.slice(0, len);
    return str + ' '.repeat(len - str.length);
}

function findLong(arr) {
    return arr.reduce((a, b) => a.length > b.length ? a : b).length;
}

const serverInfoJava = {
    builder: (builder) => builder
        .setName('java')
        .setDescription('Java版Minecraftサーバーの情報取得')
        .addStringOption((option) => option
            .setName('address')
            .setDescription('サーバーアドレス')
            .setRequired(true)
        )
};

const serverInfoBedrock = {
    builder: (builder) => builder
        .setName('bedrock')
        .setDescription('Bedrock版Minecraftサーバーの情報取得')
        .addStringOption((option) => option
            .setName('address')
            .setDescription('サーバーアドレス')
            .setRequired(true)
        )
};

module.exports = {
    subcommands: [serverInfoJava, serverInfoBedrock],
    builder: (builder) => builder
        .setName('serverinfo')
        .setDescription('Minecraftサーバー情報')
    ,
    async execute(command) {
        const type = command.options.getSubcommand().toLowerCase();
        const address = command.options.getString('address');

        const response = await fetch(`https://api.mcstatus.io/v2/status/${type}/${address}`);
        const data = await response.json();

        const embed = new CustomEmbed(`minecraft${type.charAt(0).toUpperCase() + type.slice(1)}ServerInfo`)
            .setTitle(`${data.hostname} : ${data.port}`)
            .setDescription(data.motd.clean.split('\n').map((l) => l.trim()).join('\n'))
            .addFields(
                {
                    name: 'ステータス',
                    value: data.online ? 'オンライン' : 'オフライン',
                    inline: true
                },
                {
                    name: '取得',
                    value: time(new Date(data.retrieved_at), 'R'),
                    inline: true
                }
            )
            .setColor(data.online ? Colors.Green : Colors.Red);

        let attachment;
        if (data.online) {
            embed.title += ` (${data.players.online}/${data.players.max})`;
            if (type === 'java') {
                let info = [
                    ['Player', ...data.players.list.map((p) => p.name_clean)],
                    ['Plugin', ...data.plugins.map((p) => `${p.name} (${p.version})`)],
                    ['Mod', ...data.mods.map((m) => `${m.name} (${m.version})`)]
                ]
                    .filter((i) => i.length > 1);
                info.forEach((i) => i.unshift(findLong(i)));
                let infoData = [];
                while (info.length > 0) {
                    let addInfos = [];
                    if (info.reduce((i, c) => c + i[0], 0) + info.length - 1 <= 30) {
                        addInfos = info;
                        info = [];
                    } else {
                        addInfos.push(info.shift());
                        if (info.length > 0 && addInfos[0][0] + info[0][0] + 1 <= 30) {
                            addInfos.push(info.shift());
                        }
                    }
                    for (let n = 1; n < Math.max(...addInfos.map((i) => i.length)); n++) {
                        infoData.push(addInfos.map((i) => padLength(i[n] ?? '', i[0])).join('|'));
                    }
                }
                embed.description += infoData.length ? '\n\n' + codeBlock(infoData.join('\n')) : '';

                attachment = new AttachmentBuilder()
                    .setName('server_icon.png')
                    .setFile(data.icon ? Buffer.from(data.icon.slice(22), 'base64') : serverIcon);
                embed
                    .setThumbnail('attachment://server_icon.png')
                    .addFields(
                        {
                            name: 'バージョン (プロトコルバージョン)',
                            value: `${data.version.name_clean} (${data.version.protocol})`
                        },
                        {
                            name: 'サーバーソフトウェア',
                            value: `${data.software ?? '不明'}`,
                            inline: true
                        }
                    );
            } else {
                embed
                    .addFields(
                        {
                            name: 'バージョン (プロトコルバージョン)',
                            value: `${data.version.name} (${data.version.protocol})`
                        },
                        {
                            name: 'エディション',
                            value: `${data.edition === 'MCPE' ? 'Pocket' : 'Education'} Edition`,
                            inline: true
                        }
                    );
            }
            embed.addFields({
                name: 'Eura違反',
                value: data.eula ? 'はい' : 'いいえ',
                inline: true
            });
        } else {
            embed.setDescription('サーバーに接続できませんでした。')
        }

        command.reply({
            embeds: [embed],
            files: attachment ? [attachment] : []
        });
    }
};