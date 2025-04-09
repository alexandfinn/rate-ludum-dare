import { promises as fs } from "fs";

async function findItchioGames() {
  try {
    // Read the game details file
    const data = await fs.readFile("game-details.json", "utf8");
    const { games } = JSON.parse(data);

    const gamesWithItchio = games
      .filter((game) => {
        // Check meta links (link-01, link-02, etc)
        const hasItchioInMeta = Object.entries(game.meta || {}).some(
          ([key, value]) => {
            return (
              key.startsWith("link-") &&
              typeof value === "string" &&
              value.includes("itch.io")
            );
          }
        );

        // Check body content
        const hasItchioInBody = game.body && game.body.includes("itch.io");

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

        return (hasItchioInMeta || hasItchioInBody) && hasRequiredTag;
      })
      .map((game) => {
        // Find the itch.io link
        let itchioLink = "";

        // First check meta links
        if (game.meta) {
          for (const [key, value] of Object.entries(game.meta)) {
            if (
              key.startsWith("link-") &&
              typeof value === "string" &&
              value.includes("itch.io")
            ) {
              itchioLink = value;
              break;
            }
          }
        }

        // If not found in meta, try to extract from body
        if (!itchioLink && game.body) {
          const matches = game.body.match(
            /https?:\/\/[^\s<>"]+?itch\.io\/[^\s<>"]+/g
          );
          if (matches && matches.length > 0) {
            itchioLink = matches[0];
          }
        }

        // Return the filtered object with only the required properties
        return {
          id: game.id,
          name: game.name,
          body: game.body,
          meta: game.meta,
          path: game.path,
          itchioLink,
        };
      });

    // Save the filtered games to a new file
    await fs.writeFile(
      "itch-games.json",
      JSON.stringify({ games: gamesWithItchio }, null, 2)
    );

    console.log(
      `Found ${gamesWithItchio.length} games with itch.io links and required tag`
    );
    console.log("Saved to itch-games.json");
  } catch (error) {
    console.error("Error processing games:", error);
  }
}

findItchioGames();
