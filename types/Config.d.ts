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
    webhook: {
        error: string;
        report: string;
    };
    embed: {
        footerCR: string;
        iconUrl: string;
    };
}
