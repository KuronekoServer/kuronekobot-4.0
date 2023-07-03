const config = {
    discordToken: "",
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
        error: "",
        report: "",
    },
    embed: {
        footerCR: "© 2023 KURONEKOSERVER",
        iconUrl: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png",
    },
};

exports.config = config;