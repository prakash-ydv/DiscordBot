const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [
  {
    name: "challenge",
    description: "Get a random DSA question of a chosen difficulty",
    options: [
      {
        name: "level",
        type: 3, // STRING type
        description: "Choose difficulty: Easy, Medium, or Hard",
        required: true,
        choices: [
          { name: "Easy 😀", value: "Easy " },
          { name: "Medium 😅", value: "Medium " },
          { name: "Hard 😐", value: "Hard " },
        ],
      },
    ],
  },

  {
    name: "gfgstats",
    description: "Get stats of GeeksGorGeek user",
    options: [
      {
        name: "username",
        description: "Enter the GeeksForGeeks username",
        type: 3, // Type 3 means STRING
        required: true,
      },
    ],
  },
  {
    name: "leetcodestats",
    description: "Get stats of LeetCode user",
    options: [
      {
        name: "username",
        description: "Enter the LeetCode username",
        type: 3, // Type 3 means STRING
        required: true,
      },
    ],
  },

  {
    name: "dsaquiz",
    description: "A random DSA quiz",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );

    console.log(
      "✅ Successfully registered application (/) commands in the server!"
    );
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
}

// Run the function
registerCommands();
