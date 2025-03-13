require("dotenv").config();
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { explainTopic, dsaChallenge, dsaQuiz } = require("./API/aiCalls");
const { gfgUserDetails } = require("./API/gfgAPI");
const { leetcodeDetails } = require("./API/leetcodeAPI");

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
  } else if (interaction.commandName === "gfgstats") {
    // GFG Stats
    const username = interaction.options.getString("username");
    await interaction.deferReply();

    try {
      const details = await gfgUserDetails(username);

      // Check if the user exists (handle missing or incorrect usernames)
      if (!details || !details.info || !details.info.userName) {
        return await interaction.followUp(
          `❌ **User _${username}_ not found on GeeksForGeeks!** 🤔`
        );
      }

      await interaction.followUp({
        content: `🎯 **GeeksForGeeks Stats for _${
          details.info?.userName
        }_** 🚀\n
    👤 **Name:** *${details.info?.fullName || "Not Available"}*
    🏫 **Institute:** *${details.info?.institute || "Not Available"}*
    🏅 **Institute Rank:** \`${details.info?.instituteRank ?? "N/A"}\`
    
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🔥 **Streaks & Scores:**
    > 🔥 **Current Streak:** \`${details.info?.currentStreak ?? "0"}\` days
    > 🌟 **Max Streak:** \`${details.info?.maxStreak ?? "0"}\` days
    > 🏆 **Coding Score:** \`${details.info?.codingScore ?? "N/A"}\`
    > 📈 **Monthly Score:** \`${details.info?.monthlyScore ?? "0"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    📊 **Problem Solving Stats:**
    > 🟢 **Basic:** \`${details.solvedStats?.basic?.count ?? "0"}\`
    > 🟡 **Easy:** \`${details.solvedStats?.easy?.count ?? "0"}\`
    > 🟠 **Medium:** \`${details.solvedStats?.medium?.count ?? "0"}\`
    > 🔴 **Hard:** \`${details.solvedStats?.hard?.count ?? "0"}\`
    > 💯 **Total Solved:** \`${details.info?.totalProblemsSolved ?? "0"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    📸 **[Profile Picture](${details.info?.profilePicture})**  
    🔗 **[View Profile](https://auth.geeksforgeeks.org/user/${
      details.info?.userName
    })**
    ━━━━━━━━━━━━━━━━━━━━━━━━
    💡 Keep grinding and leveling up your coding skills! 🚀
    `,
        ephemeral: false,
      });
    } catch (error) {
      await interaction.followUp(
        `❌ **Failed to fetch stats for _${username}_.** Please try again later.`
      );
    }
  } else if (interaction.commandName === "leetcodestats") {
    //leetcode stats
    const username = interaction.options.getString("username");
    await interaction.deferReply();

    try {
      const details = await leetcodeDetails(username);

      // Check if the user exists (handle missing or incorrect usernames)
      if (!details || !details.realName || !details.ranking) {
        return await interaction.followUp(
          `❌ **User _${username}_ not found on LeetCode!** 🤔`
        );
      }

      await interaction.followUp({
        content: `🎯 **LeetCode Stats for _${details.username}_** 🚀\n
    👤 **Name:** *${details.realName || "Not Available"}*
    🌍 **Country:** *${details.country || "Not Available"}*
    🏅 **Global Rank:** \`${details.ranking ?? "N/A"}\`
    
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🔥 **Problem Solving Stats:**
    > 🟢 **Easy:** \`${details.problemSolvingStats?.easy ?? "0"}\`
    > 🟠 **Medium:** \`${details.problemSolvingStats?.medium ?? "0"}\`
    > 🔴 **Hard:** \`${details.problemSolvingStats?.hard ?? "0"}\`
    > 💯 **Total Solved:** \`${details.problemSolvingStats?.all ?? "0"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    📊 **Acceptance Rates:**
    > ✅ **Easy:** \`${details.acceptanceRates?.easy ?? "N/A"}\`
    > ✅ **Medium:** \`${details.acceptanceRates?.medium ?? "N/A"}\`
    > ✅ **Hard:** \`${details.acceptanceRates?.hard ?? "N/A"}\`
    > 🔥 **Overall:** \`${details.acceptanceRates?.overall ?? "N/A"}\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🏆 **Contest Performance:**
    > 📈 **Rating:** \`${details.contestPerformance?.rating ?? "N/A"}\`
    > 🌍 **Global Rank:** \`${details.contestPerformance?.globalRank ?? "N/A"}\`
    > 👥 **Total Participants:** \`${
      details.contestPerformance?.totalParticipants ?? "N/A"
    }\`
    ━━━━━━━━━━━━━━━━━━━━━━━━
    🛡 **Badges:**
    ${
      details.badges && details.badges.length > 0
        ? details.badges
            .map(
              (badge) => `> 🏅 **${badge.displayName}** ![Badge](${badge.icon})`
            )
            .join("\n")
        : "❌ No badges earned yet."
    }
    ━━━━━━━━━━━━━━━━━━━━━━━━
    📸 **[Profile Picture](${details.profilePicture})**  
    🔗 **[View Profile](https://leetcode.com/${details.username})**
    ━━━━━━━━━━━━━━━━━━━━━━━━
    💡 Keep pushing your coding limits and ace those problems! 🚀
    `,
        ephemeral: false,
      });
    } catch (error) {
      await interaction.followUp(
        `❌ **Failed to fetch stats for _${username}_.** Please try again later.`
      );
    }
  } else if (interaction.commandName === "dsaquiz") {
    await interaction.deferReply();
    try {
        const quiz = await dsaQuiz();
        console.log("Raw AI Response:", quiz);

        const cleanedQuiz = quiz.replace(/```json\n|\n```/g, "");
        let parsedQuiz;

        try {
            parsedQuiz = JSON.parse(cleanedQuiz);
        } catch (error) {
            return await interaction.followUp(
                "❌ Failed to generate a valid quiz. Please try again."
            );
        }

        if (
            !parsedQuiz?.question ||
            !Array.isArray(parsedQuiz.options) ||
            parsedQuiz.options.length !== 4 ||
            !parsedQuiz.correctAnswer
        ) {
            return await interaction.followUp(
                "❌ The AI response is invalid. Please try again."
            );
        }

        const optionsEmojis = ["🔴", "🟢", "🔵", "🟡"];
        const correctAnswer = parsedQuiz.correctAnswer;

        let quizMessage = `🎯 **DSA Quiz Time!** 🎯\n\n`;
        quizMessage += `📌 **Question:**\n> **${parsedQuiz.question}**\n\n`;
        quizMessage += `📝 **Options:**\n`;

        parsedQuiz.options.forEach((option, index) => {
            quizMessage += `\`${optionsEmojis[index]}\` **${option}**\n`;
        });

        quizMessage += `\n⏳ *You have **15 seconds** to respond! React with your answer.*`;

        const quizPoll = await interaction.followUp({
            content: quizMessage,
            fetchReply: true,
        });

        for (let i = 0; i < parsedQuiz.options.length; i++) {
            await quizPoll.react(optionsEmojis[i]);
        }

        const filter = (reaction, user) =>
            optionsEmojis.includes(reaction.emoji.name) && !user.bot;
        const collector = quizPoll.createReactionCollector({
            filter,
            time: 15000,
        });

        let userVotes = new Map();

        collector.on("collect", async (reaction, user) => {
            if (userVotes.has(user.id)) {
                return await reaction.users.remove(user.id);
            }

            const userAnswerIndex = optionsEmojis.indexOf(reaction.emoji.name);
            const userAnswer = parsedQuiz.options[userAnswerIndex];

            // Store user vote (only first vote counts)
            userVotes.set(user.id, {
                answer: userAnswer,
                timestamp: Date.now(),
            });


            // Remove user's reaction to prevent multiple reactions
            await reaction.users.remove(user.id);
        });

        collector.on("end", async () => {
            let resultMessage = `✅ **Time's up! Here is the correct answer:**\n`;
            resultMessage += `🎯 **${correctAnswer}**\n\n`;

            // Get only correct answers
            let correctVotes = [...userVotes.entries()]
                .filter(([_, data]) => data.answer === correctAnswer)
                .sort((a, b) => a[1].timestamp - b[1].timestamp) // Sort by time
                .slice(0, 5); // Get top 5

            if (correctVotes.length > 0) {
                resultMessage += `🏆 **Top 5 Correct Answers:**\n`;
                correctVotes.forEach(([userId], index) => {
                    resultMessage += `${index + 1}. <@${userId}>\n`;
                });
            } else {
                resultMessage += `❌ No one answered correctly in time!\n`;
            }

            await quizPoll.reply(resultMessage);
        });
    } catch (error) {
        await interaction.followUp(
            "❌ Failed to generate Quiz. Please try again."
        );
    }
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
