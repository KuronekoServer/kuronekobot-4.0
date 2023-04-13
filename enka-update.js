const { EnkaClient } = require("enka-network-api");
const enka = new EnkaClient({ showFetchCacheLog: true });

enka.cachedAssetsManager.fetchAllContents();
