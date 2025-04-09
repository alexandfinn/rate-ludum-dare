import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import gameData from "../../../scripts/web-games.json";

type Game = (typeof gameData.games)[0];

export default function History() {
  const [seenGames, setSeenGames] = useState<Game[]>([]);

  useEffect(() => {
    const seenIds = JSON.parse(localStorage.getItem('seenGameIds') || '[]');
    const games = seenIds
      .map((id: number) => gameData.games.find(game => game.id === id))
      .filter(Boolean)
      .reverse(); // Show most recent first
    setSeenGames(games);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('seenGameIds');
    setSeenGames([]);
  };

  return (
    <main className="min-h-screen p-4 md:p-24 bg-gradient-to-br from-violet-400 to-violet-600">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white hover:text-teal-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Game Browser
        </Link>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Your Game History</h1>
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-white/80 border-b border-white/20">
                  <th className="pb-3">Game</th>
                  <th className="pb-3">Links</th>
                </tr>
              </thead>
              <tbody>
                {seenGames.length > 0 ? (
                  seenGames.map((game) => (
                    <tr key={game.id} className="border-b border-white/10">
                      <td className="py-3 text-white">{game.name}</td>
                      <td className="py-3">
                        <div className="flex gap-4">
                          <a
                            href={game.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-300 hover:text-teal-200"
                          >
                            Play
                          </a>
                          <a
                            href={`https://ldjam.com${game.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-300 hover:text-teal-200"
                          >
                            Rate
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-6 text-center text-white/70">
                      No game history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
} 