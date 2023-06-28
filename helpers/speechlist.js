//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const fs = require("fs");
const { config } = require("../config");
const { getJson } = require("./HttpUtils");
(async () => {
    let speechlist = [];
    let list;
    const voicevox = await getJson(`${config.speak.voicevox}/speakers`);
    const coeiroink = await getJson(`${config.speak.coeiroink}/speakers`);
    const sharevox = await getJson(`${config.speak.sharevox}/speakers`);
    if (!voicevox.data) return console.log("voicevoxが起動していません");
    if (!coeiroink.data) return console.log("COEIROINKが起動していません");
    if (!sharevox.data) return console.log("SHAREVOXが起動していません");
    list = speechlist
        .concat(voicevox.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })))
        .concat(coeiroink.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })))
        .concat(sharevox.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })));
    fs.writeFileSync('./helpers/voicelist/allvoicelist.json', JSON.stringify(list));
    fs.writeFileSync('./helpers/voicelist/voicevoxlist.json', JSON.stringify(voicevox.data.map(list => ({ name: list.name, value: list.name }))));
    fs.writeFileSync('./helpers/voicelist/coeiroinklist.json', JSON.stringify(coeiroink.data.map(list => ({ name: list.name, value: list.name }))));
    fs.writeFileSync('./helpers/voicelist/sharevoxlist.json', JSON.stringify(sharevox.data.map(list => ({ name: list.name, value: list.name }))));
    fs.writeFileSync('./helpers/voicelist/allvoicevoxlist.json', JSON.stringify(voicevox.data));
    fs.writeFileSync('./helpers/voicelist/allcoeiroinklist.json', JSON.stringify(coeiroink.data));
    fs.writeFileSync('./helpers/voicelist/allsharevoxlist.json', JSON.stringify(sharevox.data));
    console.log("正常更新")
    process.exit(1);
})();