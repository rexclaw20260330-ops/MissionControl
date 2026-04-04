const { REST, Routes } = require("discord.js");
require("dotenv").config({ path: ".env.local" });

const commands = [
  {
    name: "mc-status",
    description: "Check Mission Control server status",
  },
  {
    name: "mc-restart",
    description: "Restart Mission Control server",
    options: [
      {
        name: "token",
        description: "Restart authorization token",
        type: 3, // STRING
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
