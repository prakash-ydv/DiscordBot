require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { explainTopic, dsaChallenge } = require("./API/aiCalls");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "challenge") {
    const level = interaction.options.getString("level");
    await interaction.deferReply();

    try {
      const question = await dsaChallenge(level);
      await interaction.followUp(question); // Send the response
    } catch (error) {
      console.error(error);
      await interaction.followUp("❌ Oops! I couldn't fetch a challenge.");
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return; // Ignore bot messages
  console.log("Prompt Recieved");

  if (message.mentions.has(client.user)) {
    const aiResponse = await explainTopic(message.content);

    console.log("Replied...");
    message.reply({
      content: aiResponse,
    });
  } else {
    return;
  }
});

client.login(TOKEN);
