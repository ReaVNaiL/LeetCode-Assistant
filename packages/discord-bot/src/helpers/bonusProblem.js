const axios = require('axios');
const emojis = require('../data/emojis.json');

async function bonusProblemStringBuilder(
    interaction,
    problemTitle,
    problemType,
    problemDifficulty,
    problemLink,
    isEveryOne = false,
    inChannel = false
) {
    const output = `
:wave: ${isEveryOne ? '@here' : ''} Listen closely, for I have a tale to tell.
:eyes: **${problemTitle}** :eyes:
**:small_blue_diamond: Problem Type:**  ${problemType}
**:small_blue_diamond: Difficulty:**  ${problemDifficulty}
**:small_blue_diamond: Follow the Link... If You Dare :mag::**  ${problemLink}
:bomb: But be warned, for this is no ordinary problem. Its difficulty is beyond mortal comprehension. The darkness that lurks within may drive you to the brink of madness. 
:skull_crossbones: Will you dare to solve it, or will you be consumed by the horrors that lie within?
    `;
    if (!inChannel) {
        await interaction.reply({
            content: output,
            allowed_mentions: { parse: ['here'] }
        }); // Add the checkmark reaction to the reply
        await interaction.react(emojis.checkmark);
    }
    return output;
}
async function requestBonusProblem() {
    const bonusInfo = await axios.get(
        'https://leetcode-api.klenir.com/daily/bonus'
    );

    return bonusInfo.data;
}

module.exports = {
    requestBonusProblem,
    bonusProblemStringBuilder
};
