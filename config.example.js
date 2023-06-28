"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const path = __importStar(require("path"));
const config = {
    discordToken: "",
    prefix: "nk!",
    proxy: "localhost:8080",
    url: undefined,
    db: {
        host: "localhost",
        user: "root",
        password: "root",
        port: 3306,
        limit: 5,
        name: "newer-kuronekochanbot", //DB名(SQLにログインしてcreate database hogeで作成)
    },
    speak: {
        voicevox: "http://127.0.0.1:50021",
        coeiroink: "http://127.0.0.1:50031",
        sharevox: "http://127.0.0.1:50025",
        exvoice: path.resolve(__dirname, "./exvoice"),
        maxMessage: 50,
        timeout: 30,
        maxFreeSockets: 100,
        maxTotalSockets: 200,
        maxSockets: 100, //ソケットエラー出たら増やす(増えるほどリソース食います)
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
