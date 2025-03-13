const { leetcodeDetails } = require("../API/leetcodeAPI");

async function callLeetcodeStats(interaction) {
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
}

module.exports = { callLeetcodeStats };
