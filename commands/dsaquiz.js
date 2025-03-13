const { dsaQuiz } = require("../API/aiCalls");

async function callDsaQuiz(interaction) {
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
    await interaction.followUp("❌ Failed to generate Quiz. Please try again.");
  }
}

module.exports = {callDsaQuiz}
