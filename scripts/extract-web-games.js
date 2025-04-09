import { promises as fs } from "fs";

async function findItchioGames() {
  try {
    // Read the game details file
    const data = await fs.readFile("game-details.json", "utf8");
    const { games } = JSON.parse(data);

    const gamesWithItchio = games
      .filter((game) => {
        // Check for link tag containing 42336
        const hasRequiredTag = Object.entries(game.meta || {}).some(
          ([key, value]) => {
            return (
              key.endsWith("-tag") &&
              Array.isArray(value) &&
              value.includes(42336)
            );
          }
        );

        return hasRequiredTag;
      })
      .map((game) => {
        // Find the link associated with the required tag
        let link = "";

        // Check meta links
        if (game.meta) {
          for (const [key, value] of Object.entries(game.meta)) {
            if (key.startsWith("link-") && typeof value === "string") {
              // Check if this link has the required tag
              const tagKey = key.replace("link-", "link-") + "-tag";
              if (game.meta[tagKey] && Array.isArray(game.meta[tagKey]) && game.meta[tagKey].includes(42336)) {
                link = value;
                break;
              }
            }
          }
        }

        // Return the filtered object with only the required properties
        return {
          id: game.id,
          name: game.name,
          body: game.body,
          meta: game.meta,
          path: game.path,
          link,
        };
      });

    // Save the filtered games to a new file
    await fs.writeFile(
      "itch-games.json",
      JSON.stringify({ games: gamesWithItchio }, null, 2)
    );

    console.log(
      `Found ${gamesWithItchio.length} games with required tag`
    );
    console.log("Saved to itch-games.json");
  } catch (error) {
    console.error("Error processing games:", error);
  }
}

findItchioGames();
