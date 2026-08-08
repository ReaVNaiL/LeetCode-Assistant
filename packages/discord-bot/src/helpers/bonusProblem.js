const axios = require('axios');
const emojis = require('../data/emojis.json');
const config = require('../config');

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
:wave: ${isEveryOne ? '@everyone' : ''} Listen closely, for I have a tale to tell.\n
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
            allowed_mentions: { parse: ['everyone'] }
        });
        const reply = await interaction.fetchReply();
        await reply.react(emojis.checkmark);
    }
    return output;
}

async function requestBonusProblem() {
    try {
        const bonusInfo = await axios.get(
            `${config.apiUrl}/daily/bonus`
        );
        return bonusInfo.data;
    } catch (error) {
        console.error('Failed to fetch bonus problem:', error.message);
        return { title: 'Unavailable', type: 'N/A', difficulty: 'N/A', link: '#' };
    }
}

module.exports = {
    requestBonusProblem,
    bonusProblemStringBuilder
};
