interface Config {
    discordToken: string;
    prefix: string;
    proxy: string | undefined;
    url: string | undefined;
    db: {
        host: string;
        user: string;
        password: string;
        port: number;
        limit: number;
        name: string;
    };
    speak: {
        voicevox: string;
        coeiroink: string;
        sharevox: string;
        exvoice: string;
        maxMessage: number;
        timeout: number;
        maxFreeSockets: number;
        maxTotalSockets: number;
        maxSockets: number;
    };
    webhook: {
        error: string;
        report: string;
    };
    embed: {
        footerCR: string;
        iconUrl: string;
    };
}
