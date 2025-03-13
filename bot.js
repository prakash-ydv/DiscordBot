require("dotenv").config();
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { explainTopic, dsaChallenge, dsaQuiz } = require("./API/aiCalls");
const { gfgUserDetails } = require("./API/gfgAPI");
const { leetcodeDetails } = require("./API/leetcodeAPI");

const { callChallengeCommand } = require("./commands/challenge");
const { callGfgStats } = require("./commands/gfgstats");
const { callLeetcodeStats } = require("./commands/leetcodestats");
const { callDsaQuiz } = require("./commands/dsaquiz");
const { callMemeGenerator } = require("./commands/meme");
const { callTopicExplainer } = require("./commands/explain");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Needed for reading messages
    GatewayIntentBits.GuildMessageReactions, // Required for reactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction], // Required for reaction events
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "challenge") {
    await callChallengeCommand(interaction);
  } else if (interaction.commandName === "gfgstats") {
    await callGfgStats(interaction);
  } else if (interaction.commandName === "leetcodestats") {
    await callLeetcodeStats(interaction);
  } else if (interaction.commandName === "dsaquiz") {
    await callDsaQuiz(interaction);
  } else if (interaction.commandName === "dsameme") {
    await callMemeGenerator(interaction);
  } else if (interaction.commandName === "explain") {
    await callTopicExplainer(interaction);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  if (message.mentions.has(client.user)) {
    const aiResponse = await explainTopic(message.content);

    message.reply({
      content: aiResponse,
    });
  } else {
    return;
  }
});

client.login(TOKEN);
