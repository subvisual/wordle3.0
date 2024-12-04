import { Navigate, Route, Routes } from "react-router-dom";
import { useAccount } from "wagmi";
import { GamePage } from "../pages/game.page";
import { LandingPage } from "../pages/landing.page";

export const App = () => {
  const { isConnected } = useAccount();

  return (
    <Routes>
      {!isConnected ? (
        <>
          <Route path="/" element={<LandingPage />} />
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
