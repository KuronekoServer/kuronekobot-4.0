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