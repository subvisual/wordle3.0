import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Container } from "../components/container";
import { GameBoard } from "../components/game-board";

export const GamePage = () => {
  return (
    <Container>
      <ConnectButton />
      <GameBoard />
    </Container>
  );
};
