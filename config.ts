import * as path from "path";

const config: Config = {
    discordToken: "NzYxNjE2Njg5OTE3MDY3Mjc0.G4rj_C.JmhfFw_XcKw8TXO1h6t6TV7VdjQjOUmboVFNHI",
    prefix: "nk!",
    proxy: "localhost:8080", //Screenshotコマンドのプロキシ
    url: undefined, //死活監視url
    db: {
        host: "localhost",
        user: "root",
        password: "root",
        port: 3306,
        limit: 5, //DB接続を試みる時間
        name: "newer-kuronekochanbot", //DB名(SQLにログインしてcreate database hogeで作成)
    },
    speak: {
        voicevox: "http://127.0.0.1:50021", //VoiceVoxのURL
        coeiroink: "http://127.0.0.1:50031", //COEIROINKのURL
        sharevox: "http://127.0.0.1:50025", //SHAREVOXのURL
        exvoice: path.resolve(__dirname, "./exvoice"), //exvoiceのパス
        maxMessage: 50, //最大メッセージ数(以下省略まで)
        timeout: 30, //合成する際のタイムアウトの時間(秒)
        maxFreeSockets: 100, //ソケットエラー出たら増やす(増えるほどリソース食います)
        maxTotalSockets: 200, //ソケットエラー出たら増やす(増えるほどリソース食います)
        maxSockets: 100, //ソケットエラー出たら増やす(増えるほどリソース食います)
    },
    webhook: {
        error: "https://discord.com/api/webhooks/1107217041666080849/ttlySV-Hr72tztlLzplkOD3XWuEkWgzy7aP788qPNEAxRMkmWnQvHkGyAmz3X0n1QsqT",
        report: "https://discord.com/api/webhooks/1107217041666080849/ttlySV-Hr72tztlLzplkOD3XWuEkWgzy7aP788qPNEAxRMkmWnQvHkGyAmz3X0n1QsqT",
    },
    embed: {
        footerCR: "© 2023 KURONEKOSERVER",
        iconUrl: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png",
    },
};

export { config };