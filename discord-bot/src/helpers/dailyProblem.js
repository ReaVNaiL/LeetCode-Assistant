async function sendDailyProblem(
    interaction,
    problemName,
    problemDifficulty,
    problemLink
) {
    await interaction.reply(`
      Here is your Daily Problem! :white_check_mark:
**:small_blue_diamond: ${problemName}**
**:small_blue_diamond: Difficulty:** ${problemDifficulty}
**:small_blue_diamond: Problem Link:** ${problemLink}
    `);
}

exports.sendDailyProblem = sendDailyProblem;
