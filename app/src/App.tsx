import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Joystick, Shuffle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import gameData from "../../scripts/web-games.json";

type Game = (typeof gameData.games)[0];

// Filter games to only include those with cover images
const gamesWithCovers = gameData.games.filter((game) => game.meta.cover);

const randomGame =
  gamesWithCovers[Math.floor(Math.random() * gamesWithCovers.length)];
const sponsoredGame = gameData.games.find((game) => game.id === 412629);

export default function App() {
  const [currentGame, setCurrentGame] = useState<Game>(randomGame);
  const [nextGame, setNextGame] = useState<Game | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [hasShownSponsored, setHasShownSponsored] = useState(false);

  // Function to preload an image
  const preloadImage = (game: Game) => {
    if (game.meta.cover) {
      const img = new Image();
      img.src = `https://static.jam.host${game.meta.cover.replace(
        /^\/\//,
        ""
      )}.480x384.fit.jpg`;
    }
  };

  // Function to get a random game
  const getRandomGame = () => {
    if (clickCount === 1 && sponsoredGame && !hasShownSponsored) {
      setHasShownSponsored(true);
      return sponsoredGame;
    }
    const randomIndex = Math.floor(Math.random() * gamesWithCovers.length);
    return gamesWithCovers[randomIndex];
  };

  // Function to show a random game
  const showRandomGame = () => {
    setClickCount((prev) => prev + 1);

    // Set the current game to the preloaded next game
    if (nextGame) {
      setCurrentGame(nextGame);
    } else {
      setCurrentGame(getRandomGame());
    }

    // Preload the next game
    const newNextGame = getRandomGame();
    setNextGame(newNextGame);
    preloadImage(newNextGame);
  };

  // Initialize next game on component mount
  useEffect(() => {
    const initialNextGame = getRandomGame();
    setNextGame(initialNextGame);
    preloadImage(initialNextGame);
  }, []);

  // Function to handle playing the game
  const playGame = () => {
    window.open(currentGame.link, "_blank");
  };

  // Function to handle rating
  const rateGame = () => {
    window.open(`https://ldjam.com${currentGame.path}`, "_blank");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-violet-400 to-violet-600">
      <h1 className="mb-8 text-4xl font-bold text-white drop-shadow-sm flex items-center gap-2">
        <Gamepad2 className="h-8 w-8" />
        Ludum Dare 57 Web Games
      </h1>

      <Card className="w-full max-w-2xl overflow-hidden border border-teal-300 rounded-xl shadow-lg">
        <div
          className="relative transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={rateGame}
        >
          {currentGame.id === 412629 && (
            <div className="absolute top-4 right-4 bg-teal-400 text-violet-900 px-3 py-1 rounded-full text-sm font-bold z-10">
              Sponsored - I created this game 😊
            </div>
          )}
          <img
            src={`https://static.jam.host${currentGame.meta.cover?.replace(
              /^\/\//,
              ""
            )}.480x384.fit.jpg`}
            alt={currentGame.name}
            className="w-full h-auto object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-violet-600/70 to-transparent flex items-end transition-opacity duration-300 ${
              isHovering ? "opacity-100" : "opacity-80"
            }`}
          >
            <h2 className="text-white text-2xl font-bold p-6">
              {currentGame.name}
            </h2>
          </div>
        </div>

        <CardContent className="p-6 bg-violet-500">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                onClick={playGame}
                className="flex-1 bg-teal-400 hover:bg-teal-500 text-violet-900 font-bold py-3 transition-transform hover:scale-105 border-none cursor-pointer"
              >
                <Joystick className="h-5 w-5 mr-2" />
                Play in the browser
              </Button>
              <Button
                onClick={rateGame}
                variant="outline"
                className="flex-1 bg-violet-400 hover:bg-violet-500 text-white border-none border-teal-300 font-bold py-3 transition-transform hover:scale-105 cursor-pointer"
              >
                <Star className="h-5 w-5 mr-2" />
                Rate on LDJAM
              </Button>
            </div>
            <Button
              onClick={showRandomGame}
              variant="secondary"
              className="bg-teal-400 hover:bg-teal-500 text-violet-900 border-none font-bold py-3 transition-transform hover:scale-105 cursor-pointer"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Next Random Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
