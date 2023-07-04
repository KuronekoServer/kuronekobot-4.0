const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("unmute")
        .setDescription("指定したユーザーのミュートを解除します。")
        .addUserOption(option => option
            .setName("user")
            .setDescription("ミュートを解除するユーザー")
            .setRequired(true)
        )
    ,
    async execute(command) {
        const user = command.options.getUser("user");
        const member = await command.guild.members.fetch(user.id);
        await member.timeout(0);
        const embed = new CustomEmbed("unmute").typeSuccess()
            .setDescription(`${member}のミュートを解除しました。`);
        command.reply({ embeds: [embed], ephemeral: true });
    }
};