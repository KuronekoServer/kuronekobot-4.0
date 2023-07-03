declare namespace AppConfig {
    interface DbConfig {
        host: string;
        user: string;
        password: string;
        port: number;
        limit: number;
        name: string;
    }

    interface WebhookConfig {
        error: string;
        report: string;
    }

    interface EmbedConfig {
        footerCR: string;
        iconUrl: string;
    }

    interface Config {
        discordToken: string;
        prefix: string;
        proxy: string;
        url: string | undefined;
        db: DbConfig;
        webhook: WebhookConfig;
        embed: EmbedConfig;
    }
}

export const config: AppConfig.Config;

export {};
