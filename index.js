require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { explainTopic, dsaChallenge } = require("./API/aiCalls");
const { gfgUserDetails } = require("./API/gfgAPI");

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
  } else if (interaction.commandName === "gfgstats") {
    const username = interaction.options.getString("username");
    await interaction.deferReply();

    try {
      const details = await gfgUserDetails(username);
      await interaction.followUp({
        content: `🎯 **GeeksForGeeks Stats for _${username}_** 🚀\n
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🆔 **Name:** *${details.info?.fullName || "Not Available"}*
    🏆 **Coding Score:** \`${details.info?.codingScore ?? "Not Available"}\`
    🔥 **Current Streak:** \`${details.info?.currentStreak ?? "Not Available"} days\`
    ✅ **Total Problems Solved:** \`${details.info?.totalProblemsSolved ?? "0"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    **📊 Problem Breakdown:**
    > 🟢 **Basic:** \`${details.solvedStats?.basic?.count ?? "0"}\`
    > 🟡 **Easy:** \`${details.solvedStats?.easy?.count ?? "0"}\`
    > 🟠 **Medium:** \`${details.solvedStats?.medium?.count ?? "0"}\`
    > 🔴 **Hard:** \`${details.solvedStats?.hard?.count ?? "0"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🏅 **Institute Rank:** \`${details.info?.instituteRank ?? "Not Ranked"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    💡 Keep coding and climbing the leaderboard! 🚀
    `,
        ephemeral: false, // Set to true if you want only the user to see the response
    });
    
    
    } catch (error) {
      console.error(error);
      await interaction.followUp(`${username} does not exists in GFG🤔`);
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
