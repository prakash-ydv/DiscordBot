const { memeAPI } = require("../API/aiCalls");
async function callMemeGenerator(interaction) {
  await interaction.deferReply();

  try {
    const meme = await memeAPI();
    await interaction.followUp(meme)
  } catch (error) {
    await interaction.followUp("No Meme at this point. Please try again 😅");
  }
}

module.exports = {callMemeGenerator}
