import { Navigate, Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";
import { useMint } from "../hooks/useMintTokens";
import { GamePage } from "../pages/game.page";
import { HomePage } from "../pages/home.page";

export const App = () => {
  const { isConnected } = useAccount();
  const { hasTokens } = useMint();

  return (
    <Routes>
      {!isConnected || !hasTokens ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </>
      ) : (
        <>
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to={"/game"} />} />
        </>
      )}
    </Routes>
  );
};
