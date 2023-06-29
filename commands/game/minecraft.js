const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { Colors, time, codeBlock, AttachmentBuilder } = require('discord.js');
const { CustomEmbed } = require('../../libs');

const serverIcon = fs.readFileSync(path.resolve(__dirname, '../../assets/minecraft_server_icon.png'));

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
    ,
    execute(command) {
        const address = command.options.getString('address');
        axios.get(`https://api.mcstatus.io/v2/status/java/${address}`)
            .then((response) => {
                const data = response.data;
                const embed = new CustomEmbed('minecraftJavaServerInfo')
                    .setTitle(`Java ${data.host} : ${data.port}`)
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
                    .setThumbnail('attachment://server_icon.png')
                    .setColor(data.online ? Colors.Green : Colors.Red)
                
                const attachment = new AttachmentBuilder()
                    .setName('server_icon.png')
                    .setFile(data.icon ? Buffer.from(data.icon.slice(22), 'base64') : serverIcon)

                if (data.online) {
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
                    console.log(infoData)
                    embed
                        .setDescription((data.motd.clean.split('\n').map((l) => l.trim()).join('\n') ?? 'A Minecraft Server') + (infoData.length ? '\n\n' + codeBlock(infoData.join('\n')) : ''))
                        .addFields(
                            {
                                name: 'バージョン',
                                value: data.version.name_clean,
                            },
                            {
                                name: 'サーバーソフトウェア',
                                value: data.software ?? '不明',
                                inline: true
                            },
                            {
                                name: 'Eula違反',
                                value: data.eula_blocked ? 'はい' : 'いいえ',
                                inline: true
                            },
                        )
                } else {
                    embed.setDescription('Can\'t connect to server')
                }
                command.reply({ embeds: [embed], files: [attachment]});
            })
    }
}



const ServerInfo = {
    subcommands: [serverInfoJava],
    builder: (builder) => builder
        .setName('serverinfo')
        .setDescription('Minecraftサーバー情報')
};

module.exports = {
    subcommandGroups: [ServerInfo],
    builder: (builder) => builder
        .setName('minecraft')
        .setDescription('Minecraft関係コマンド')
};