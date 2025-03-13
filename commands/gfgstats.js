const { gfgUserDetails } = require("../API/gfgAPI");

async function callGfgStats(interaction) {
  const username = interaction.options.getString("username");
  await interaction.deferReply();

  try {
    const details = await gfgUserDetails(username);

    // Check if the user exists (handle missing or incorrect usernames)
    if (!details || !details.info || !details.info.userName) {
      return await interaction.followUp(
        `❌ **User ${username} not found on GeeksForGeeks! Make sure username is correct** 🤔`
      );
    }

    await interaction.followUp({
      content: `🎯 **GeeksForGeeks Stats for _${details.info?.userName}_** 🚀\n
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
}

module.exports = { callGfgStats };
