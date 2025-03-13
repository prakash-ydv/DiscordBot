const {dsaChallenge} = require('../API/aiCalls')

async function callChallengeCommand(interaction) {
  const level = interaction.options.getString("level");
  await interaction.deferReply();

  try {
    const question = await dsaChallenge(level);
    await interaction.followUp(question); // Send the response
  } catch (error) {
    await interaction.followUp(
      "❌ Oops! I couldn't fetch a challenge. Please try again..."
    );
  }
}

module.exports = {callChallengeCommand};
