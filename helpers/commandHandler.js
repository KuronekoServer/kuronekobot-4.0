const { CustomEmbed, Command } = require('../libs');

async function commandHandler(command) {
    try {
        await command.execute(command)
    } catch (error) {
        command.logger.error(error);
        const embed = new CustomEmbed('error').typeError();
        if (error.message === 'Missing Permissions') {
            embed.setDescription('権限が足りません。\nBOTに権限を与えてください')
        } else {
            embed.setDescription(`不明なエラーが発生しました。\n詳細:${error.message}\n運営に問い合わせていただけると幸いです。`)
        }
        if (command.type === Command.Managers.Message) {
            command.reply({ embeds: [embed] }).catch(() => { });
        } else {
            command.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
        }
    }
}

module.exports = commandHandler;