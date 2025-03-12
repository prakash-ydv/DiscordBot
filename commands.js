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
  ];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    });

    console.log("✅ Successfully registered application (/) commands in the server!");
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
}

// Run the function
registerCommands();
