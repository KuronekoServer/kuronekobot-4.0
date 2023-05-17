const { Colors } = require("discord.js");
const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("mute")
        .setDescription("指定したユーザーをミュートにします。")
        .addUserOption(option => option
            .setName("user")
            .setDescription("ミュートにするユーザー")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("time")
            .setDescription("期間 (秒)")
            .setRequired(true)
            .setMinValue(1)
        )
    ,
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const time = interaction.options.getInteger("time");
        const member = await interaction.guild.members.fetch(user.id);
        await member.timeout(time);
        const embed = new CustomEmbed("mute").typeSuccess()
            .setDescription(`${member}をミュートしました。`)
            .addFields({
                name: "期間",
                value: `${time}秒`
            });
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};