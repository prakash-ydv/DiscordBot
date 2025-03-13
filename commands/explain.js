const { topicExplainAPI } = require("../API/aiCalls");

async function callTopicExplainer(interaction) {
  const topic = interaction.options.getString("topic");
  await interaction.deferReply();

  try {
    const content = await topicExplainAPI(topic);
    await interaction.followUp(content);
  } catch (error) {
    await interaction.followUp(
      "Sorry I can't explain right now. Something went wrong 😢"
    );
  }
}

module.exports = { callTopicExplainer };
