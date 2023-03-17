//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const fs = require("node:fs");
const { getJson } = require("./HttpUtils");
(async () => {
    let speechlist = [];
    let list;
    const voicevox = await getJson(`http://127.0.0.1:50021/speakers`);
    const COEIROINK = await getJson(`http://127.0.0.1:50031/speakers`);
    const SHAREVOX = await getJson(`http://127.0.0.1:50025/speakers`);
    if(!voicevox.data) return console.log("voicevoxが起動していません");
    if(!COEIROINK.data) return console.log("COEIROINKが起動していません");
    if(!SHAREVOX.data) return console.log("SHAREVOXが起動していません");
    list = speechlist
        .concat(voicevox.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })))
        .concat(COEIROINK.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })))
        .concat(SHAREVOX.data.map(list => ({ name: list.name, value: String(list.styles[0].id) })));
    fs.writeFileSync('./helpers/voicelist/allvoicelist.json', JSON.stringify(list));
    fs.writeFileSync('./helpers/voicelist/voicevoxlist.json', JSON.stringify(voicevox.data.map(list => ({ name: list.name, value: String(list.styles[0].id) }))));
    fs.writeFileSync('./helpers/voicelist/coeiroinklist.json', JSON.stringify(COEIROINK.data.map(list => ({ name: list.name, value: String(list.styles[0].id) }))));
    fs.writeFileSync('./helpers/voicelist/sharevoxlist.json', JSON.stringify(SHAREVOX.data.map(list => ({ name: list.name, value: String(list.styles[0].id) }))));
    console.log("正常更新")
    process.exit(1);
})();