const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PagesManager } = require('discord.js-pages');
const pagesManager = new PagesManager();
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDMPermission(false)
        .setDescription("ヘルプの表示"),
    async execute(interaction) {
        pagesManager.middleware(interaction);
        await interaction.pagesBuilder()
            .setPages([
                new EmbedBuilder()
                    .setTitle("読み上げ(全員)")
                    .addFields(
                        { name:'\`speak join\`', value: `ボイスチャンネルに参加します。`, inline: true },
                        { name:'\`speak skip\`', value: `読み上げをスキップします。(読み上げてる最中の物のみになります)`, inline: true },
                        { name:'\`speak disconnect\`', value: `ボイスチャンネルから退出します。`, inline: true },
                        { name:'\`speak user_voice\`', value: `話者を変更します。`, inline: true },
                        { name:'\`speak user_voice-setting\`', value: `ユーザーの各種voice設定をします。`, inline: true },
                        { name:'\`speak dictionary_add\`', value: `辞書を追加します。`, inline: true },
                        { name:'\`speak dictionary_remove\`', value: `辞書を削除します。`, inline: true },
                        { name:'\`speak dictionary_export\`', value: `辞書の内容をエクスポートします。`, inline: true },
                        { name:'\`speak dictionary_import\`', value: `辞書をインポートします。`, inline: true },
                        { name:'\`speak server_user-dictionary-list\`', value: `辞書の一覧又は読み上げないユーザーを表示します。`, inline: true },
                        { name:'\`speak user_reset\`', value: `ユーザー設定初期化`, inline: true },
                        { name:'\`speak setting_show\`', value: `読み上げ関連設定の表示`, inline: true },
                        { name:'\`speak live_read\`', value: `ライブの読み上げ。`, inline: true },
                        { name:'\`speak live_read-stop\`', value: `ライブの読み上げを停止します。`, inline: true }
                    ),
                new EmbedBuilder()
                    .setTitle("読み上げ(管理者)")
                    .addFields(
                        { name:'\`speak server_read-user\`', value: `読み上げを行うユーザーの設定をします(BOTも設定可能です)`, inline: true },
                        { name:'\`speak server_read-bot\`', value: `BOTの読み上げを許可するか決めます`, inline: true },
                        { name:'\`speak server_voice\`', value: `サーバー話者を変更します`, inline: true },
                        { name:'\`speak server_voice-setting\`', value: `サーバー各種voice設定をします`, inline: true },
                        { name:'\`speak server_force-guild\`', value: `サーバー設定を強制するかどうか`, inline: true },
                        { name:'\`speak server_read\`', value: `入退室時にユーザーを読み上げるか`, inline: true },
                        { name:'\`speak server_auto-join\`', value: `自動で読み上げチャンネルに入室する`, inline: true },
                        { name:'\`speak server_auto-join-delete\`', value: `自動で読み上げチャンネルに入室しない`, inline: true },
                        { name:'\`speak server_exvoice\`', value: `exvoiceの操作`, inline: true },
                        { name:'\`speak server_reset\`', value: `サーバー設定初期化`, inline: true },
                        { name:'\`speak server_exvoice-word\`', value: `読み上げないexvoiceの追加`, inline: true },
                        { name:'\`speak server_vc-only-tts\`', value: `ボイスチャンネル外のユーザー設定`, inline: true },
                        { name:'\`speak dictionary_username\`', value: `ユーザー名に辞書を適応するか`, inline: true },
                        { name:'\`speak read_through\`', value: `Discordのメッセージを読み上げるかどうか`, inline: true }
                    ),
                new EmbedBuilder()
                    .setTitle("その他のコマンド1(全員)")
                    .addFields(
                        { name:'\`bot status\`', value: `BOTのステータスを表示します`, inline: true },
                        { name:'\`bot report\`', value: `バグや要望を運営に送信します`, inline: true },
                        { name:'\`jobpanel create\`', value: `新しい役職パネルを作成し、そのパネルを選択します`, inline: true },
                        { name:'\`jobpanel copy\`', value: `選択しているパネルをコピーします`, inline: true },
                        { name:'\`jobpanel delete\`', value: `選択したパネルを削除します`, inline: true },
                        { name:'\`jobpanel add\`', value: `パネルに役職を追加します`, inline: true },
                        { name:'\`jobpanel edit\`', value: `選択したパネルのタイトルやカラーを変更します`, inline: true },
                        { name:'\`jobpanel remove\`', value: `パネルから役職を削除します`, inline: true },
                        { name:'\`jobpanel selected\`', value: `現在選択しているパネルのリンクを返します`, inline: true },
                        { name:'\`jobpanel refresh\`', value: `選択したパネルのリアクションをつけ直します`, inline: true },
                        { name:'\`jobpanel autoremove\`', value: `選択しているパネルに含まれる削除されたロールを取り除きます`, inline: true },
                        { name:'\`log create\`', value: `logチャンネルを指定します`, inline: true },
                        { name:'\`log delete\`', value: `logチャンネルを削除します`, inline: true },
                        { name:'\`ticket create\`', value: `チケットを作成します`, inline: true },
                        { name:'\`ticket delete\`', value: `チケットログチャンネルを削除します`, inline: true },
                    ),
                new EmbedBuilder()
                    .setTitle("その他のコマンド2(全員)")
                    .addFields(
                        { name:'\`minecraft server-java\`', value: `Java版Minecraftサーバー情報`, inline: true },
                        { name:'\`minecraft server-bedrock\`', value: `統合版Minecraftサーバー情報`, inline: true },
                        { name:'\`minecraft user\`', value: `Minecraftユーザー情報`, inline: true },
                        { name:'\`miscellaneous reserve\`', value: `指定した時間後にメッセージを送信します`, inline: true },
                        { name:'\`miscellaneous screenshot\`', value: `Webサイトをスクリーンショットします`, inline: true },
                        { name:'\`miscellaneous server-info\`', value: `サーバー情報を取得します`, inline: true },
                        { name:'\`miscellaneous user-info\`', value: `ユーザー情報を表示します`, inline: true },
                        { name:'\`miscellaneous wikipedia\`', value: `Wikipediaで何かを調べます`, inline: true },
                        { name:'\`miscellaneous role\`', value: `ロールの情報を表示`, inline: true },
                        { name:'\`miscellaneous channel\`', value: `チャンネルの情報を表示`, inline: true },
                        { name:'\`miscellaneous translate\`', value: `コンテンツの言語を翻訳`, inline: true },
                        { name:'\`poll create\`', value: `アンケートを作成します`, inline: true },
                        { name:'\`poll excreate\`', value: `一人一つの投票にします`, inline: true },
                        { name:'\`poll sum\`', value: `集計します`, inline: true },
                    ),
                    new EmbedBuilder()
                    .setTitle("サーバー管理コマンド(管理者)")
                    .addFields(
                        { name:'\`server-manage ban\`', value: `ユーザーをBANします`, inline: true },
                        { name:'\`server-manage kick\`', value: `ユーザーをkickします`, inline: true },
                        { name:'\`server-manage unban\`', value: `ユーザーのBANを解除します`, inline: true },
                        { name:'\`server-manage clear\`', value: `指定の数のメッセージを削除します`, inline: true },
                        { name:'\`server-manage mute\`', value: `指定したユーザーをミュートにします`, inline: true },
                        { name:'\`server-manage unmute\`', value: `指定したユーザーのミュートを解除`, inline: true },
                        { name:'\`server-manage show\`', value: `サーバーのデータ保存情報を表示します`, inline: true },
                    ),
            ])
            .setColor('Green')
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | help" })
            .setPaginationFormat()
            .build();
    }
}