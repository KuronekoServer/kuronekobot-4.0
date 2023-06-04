const path = require("path");

module.exports = {
    prefix: "nk!", //prefix
    token: "", // Discord Bot Token
    proxy: "localhost:8080", // ScreenShotコマンドに使用
    //推奨: Cloudflare WARP > ギアアイコン > 環境設定 > 詳細 > プロキシ モードを構成
    url: "", // 死活監視先url
    db: {
        host: "localhost", // DBホスト
        user: "root", // DBユーザー
        password: "root", // DBパスワード
        port: 3306, // DBポート
        limit: 5, // DB接続を試みる時間
        name: "newer-kuronekochanbot" // DB名(SQLにログインしてcreate database hogeで作成)
    },
    speak: {
        voicevox: "http://127.0.0.1:50021", // VoiceVoxのURL
        coeiroink: "http://127.0.0.1:50031", // COEIROINKのURL
        sharevox: "http://127.0.0.1:50025", // SHAREVOXのURL
        exvoice: path.resolve(__dirname, "./exvoice"), // exvoiceのパス
        maxMessage: 50, // 最大メッセージ数(以下省略まで)
        timeout: 30, // 合成する際のタイムアウトの時間(秒)
        maxFreeSockets: 100, // ソケットエラー出たら増やす(増えるほどリソース食います)
        maxTotalSockets: 200, // ソケットエラー出たら増やす(増えるほどリソース食います)
        maxSockets: 100//ソケットエラー出たら増やす(増えるほどリソース食います)
    },
    webhook: {
        error: "",
        report: ""
    }
};