import { Navigate, useNavigate, useParams } from "react-router";
import GameRunner from "./GameRunner";
import { getGame } from "../games/registry";

// Route element for /games/:gameId. An unknown id goes home instead of
// rendering a blank screen.
function GamePage({ onComplete }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGame(gameId);

  if (!game) return <Navigate to="/" replace />;

  return (
    <GameRunner game={game} onComplete={onComplete} onBack={() => navigate("/")} />
  );
}

export default GamePage;
